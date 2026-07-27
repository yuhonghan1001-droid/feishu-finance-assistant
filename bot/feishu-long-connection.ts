import * as Lark from "@larksuiteoapi/node-sdk";
import { createHmac } from "node:crypto";
import {
  createFinanceAssistantReplyWithAI,
  type ConversationTurn,
} from "../lib/finance-ai";
import { createFinanceAssistantReply } from "../lib/finance-knowledge";

type ReceiveMessageEvent = Parameters<
  NonNullable<Lark.EventHandles["im.message.receive_v1"]>
>[0];

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function extractQuestion(event: ReceiveMessageEvent): string {
  if (event.message.message_type !== "text") return "";

  let content: { text?: unknown };
  try {
    content = JSON.parse(event.message.content) as { text?: unknown };
  } catch {
    return "";
  }
  if (typeof content.text !== "string") return "";

  let question = content.text;
  for (const mention of event.message.mentions ?? []) {
    question = question.replaceAll(mention.key, " ");
  }
  return question.replace(/\s+/g, " ").trim();
}

function rememberMessage(messageIds: Set<string>, messageId: string): void {
  messageIds.add(messageId);
  if (messageIds.size <= 1_000) return;

  const oldestMessageId = messageIds.values().next().value;
  if (oldestMessageId) messageIds.delete(oldestMessageId);
}

function rememberConversation(
  conversations: Map<string, ConversationTurn[]>,
  conversationId: string,
  question: string,
  reply: string,
): void {
  const turns = conversations.get(conversationId) ?? [];
  turns.push(
    { role: "user", content: question },
    { role: "assistant", content: reply },
  );
  conversations.set(conversationId, turns.slice(-8));

  if (conversations.size <= 500) return;
  const oldestConversationId = conversations.keys().next().value;
  if (oldestConversationId) conversations.delete(oldestConversationId);
}

const appId = requireEnvironmentVariable("FEISHU_APP_ID");
const appSecret = requireEnvironmentVariable("FEISHU_APP_SECRET");
const assistantMode =
  process.env.FINANCE_ASSISTANT_MODE?.trim().toLowerCase() === "knowledge"
    ? "knowledge"
    : "ai";
const handledMessageIds = new Set<string>();
const conversations = new Map<string, ConversationTurn[]>();
const openAIOptions = {
  apiKey: process.env.OPENAI_API_KEY,
  baseUrl: process.env.OPENAI_BASE_URL,
  model: process.env.OPENAI_MODEL,
  enableWebSearch: !["0", "false", "off"].includes(
    process.env.OPENAI_WEB_SEARCH?.trim().toLowerCase() ?? "",
  ),
};

if (assistantMode === "ai" && !openAIOptions.apiKey?.trim()) {
  console.warn(
    "[feishu-bot] OPENAI_API_KEY is not configured; AI answers are disabled",
  );
}
console.info(`[feishu-bot] assistant mode: ${assistantMode}`);

const client = new Lark.Client({
  appId,
  appSecret,
  loggerLevel: Lark.LoggerLevel.warn,
});

const eventDispatcher = new Lark.EventDispatcher({
  loggerLevel: Lark.LoggerLevel.warn,
}).register({
  "im.message.receive_v1": async (event) => {
    if (
      event.sender.sender_type !== "user" ||
      handledMessageIds.has(event.message.message_id)
    ) {
      return;
    }

    rememberMessage(handledMessageIds, event.message.message_id);
    try {
      const question = extractQuestion(event);
      const senderId =
        event.sender.sender_id?.open_id ??
        event.sender.sender_id?.user_id ??
        event.sender.sender_id?.union_id ??
        "unknown";
      const conversationId = `${event.message.chat_id}:${senderId}`;
      const reply =
        event.message.message_type === "text"
          ? assistantMode === "knowledge"
            ? createFinanceAssistantReply(question)
            : await createFinanceAssistantReplyWithAI(question, {
                ...openAIOptions,
                history: conversations.get(conversationId),
                safetyIdentifier: createHmac("sha256", appSecret)
                  .update(senderId)
                  .digest("hex"),
                onError: (error) =>
                  console.error(
                    "[feishu-bot] AI answer failed:",
                    error.message,
                  ),
              })
          : "目前支持文字咨询。请把问题以文字形式发送给我。";
      const result = await client.im.v1.message.reply({
        path: { message_id: event.message.message_id },
        data: {
          msg_type: "text",
          content: JSON.stringify({ text: reply }),
        },
      });
      if ((result.code ?? 0) !== 0 || !result.data?.message_id) {
        throw new Error(result.msg || `Feishu API returned code ${result.code}`);
      }
      if (event.message.message_type === "text") {
        rememberConversation(conversations, conversationId, question, reply);
      }
      console.info(
        `[feishu-bot] replied to ${event.message.chat_type} message ${event.message.message_id}`,
      );
    } catch (error) {
      handledMessageIds.delete(event.message.message_id);
      console.error(
        "[feishu-bot] failed to reply:",
        error instanceof Error ? error.message : "Unknown error",
      );
      throw error;
    }
  },
});

const wsClient = new Lark.WSClient({
  appId,
  appSecret,
  loggerLevel: Lark.LoggerLevel.warn,
  autoReconnect: true,
  handshakeTimeoutMs: 15_000,
  wsConfig: { pingTimeout: 10 },
  onReady: () => console.info("[feishu-bot] connected"),
  onReconnecting: () => console.warn("[feishu-bot] reconnecting"),
  onReconnected: () => console.info("[feishu-bot] reconnected"),
  onError: (error) => console.error("[feishu-bot] connection error:", error.message),
});

await wsClient.start({ eventDispatcher });

const shutdown = (signal: string) => {
  console.info(`[feishu-bot] received ${signal}, shutting down`);
  wsClient.close();
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
