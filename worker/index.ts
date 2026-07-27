/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { createFinanceAssistantReply } from "../lib/finance-knowledge";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  FEISHU_APP_ID?: string;
  FEISHU_APP_SECRET?: string;
  FEISHU_VERIFICATION_TOKEN?: string;
  FEISHU_ENCRYPT_KEY?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type FeishuEventPayload = {
  schema?: string;
  type?: string;
  token?: string;
  challenge?: string;
  header?: {
    event_id?: string;
    event_type?: string;
    token?: string;
    app_id?: string;
  };
  event?: {
    sender?: {
      sender_type?: string;
    };
    message?: {
      message_id?: string;
      message_type?: string;
      content?: string;
      mentions?: Array<{
        key?: string;
      }>;
    };
  };
};

type FeishuTokenResponse = {
  code?: number;
  msg?: string;
  tenant_access_token?: string;
  expire?: number;
};

type FeishuReplyResponse = {
  code?: number;
  msg?: string;
};

let tenantTokenCache:
  | {
      appId: string;
      token: string;
      expiresAt: number;
    }
  | undefined;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function constantTimeEquals(left: string, right: string): boolean {
  if (left.length !== right.length) return false;

  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hasValidFeishuSignature(
  request: Request,
  rawBody: string,
  encryptKey: string,
): Promise<boolean> {
  const timestamp = request.headers.get("x-lark-request-timestamp");
  const nonce = request.headers.get("x-lark-request-nonce");
  const signature = request.headers.get("x-lark-signature");
  if (!timestamp || !nonce || !signature) return false;

  const numericTimestamp = Number(timestamp);
  if (!Number.isFinite(numericTimestamp)) return false;
  const timestampMs =
    numericTimestamp > 1_000_000_000_000
      ? numericTimestamp
      : numericTimestamp * 1000;
  if (Math.abs(Date.now() - timestampMs) > 10 * 60 * 1000) return false;

  const expected = await sha256Hex(`${timestamp}${nonce}${encryptKey}${rawBody}`);
  return constantTimeEquals(expected, signature.toLowerCase());
}

function decodeBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function decryptFeishuPayload(
  encryptedPayload: string,
  encryptKey: string,
): Promise<FeishuEventPayload> {
  const encrypted = decodeBase64(encryptedPayload);
  if (encrypted.byteLength <= 16) {
    throw new Error("Feishu encrypted payload is too short.");
  }

  const keyBytes = await crypto.subtle.digest(
    "SHA-256",
    textEncoder.encode(encryptKey),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["decrypt"],
  );
  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-CBC",
      iv: encrypted.slice(0, 16),
    },
    key,
    encrypted.slice(16),
  );

  return JSON.parse(textDecoder.decode(decrypted)) as FeishuEventPayload;
}

async function parseFeishuPayload(
  rawBody: string,
  encryptKey?: string,
): Promise<{ encrypted: boolean; payload: FeishuEventPayload }> {
  const wirePayload = JSON.parse(rawBody) as FeishuEventPayload & {
    encrypt?: string;
  };
  if (!wirePayload.encrypt) {
    return { encrypted: false, payload: wirePayload };
  }
  if (!encryptKey) {
    throw new Error("FEISHU_ENCRYPT_KEY is required for encrypted callbacks.");
  }

  return {
    encrypted: true,
    payload: await decryptFeishuPayload(wirePayload.encrypt, encryptKey),
  };
}

function extractQuestion(payload: FeishuEventPayload): string {
  const message = payload.event?.message;
  if (!message?.content) return "";

  let parsedContent: { text?: unknown };
  try {
    parsedContent = JSON.parse(message.content) as { text?: unknown };
  } catch {
    return "";
  }
  if (typeof parsedContent.text !== "string") return "";

  let text = parsedContent.text;
  for (const mention of message.mentions ?? []) {
    if (mention.key) text = text.replaceAll(mention.key, " ");
  }
  return text.replace(/\s+/g, " ").trim();
}

async function getTenantAccessToken(env: Env): Promise<string> {
  const appId = env.FEISHU_APP_ID?.trim();
  const appSecret = env.FEISHU_APP_SECRET?.trim();
  if (!appId || !appSecret) {
    throw new Error("Feishu App ID or App Secret is not configured.");
  }

  if (
    tenantTokenCache?.appId === appId &&
    tenantTokenCache.expiresAt > Date.now()
  ) {
    return tenantTokenCache.token;
  }

  const response = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        app_id: appId,
        app_secret: appSecret,
      }),
    },
  );
  const result = (await response.json()) as FeishuTokenResponse;
  if (
    !response.ok ||
    result.code !== 0 ||
    !result.tenant_access_token
  ) {
    throw new Error(
      `Unable to obtain Feishu tenant token: ${result.msg ?? response.status}`,
    );
  }

  tenantTokenCache = {
    appId,
    token: result.tenant_access_token,
    expiresAt: Date.now() + Math.max((result.expire ?? 7200) - 300, 60) * 1000,
  };
  return result.tenant_access_token;
}

function normalizeReplyUuid(eventId: string): string | undefined {
  const compact = eventId.replaceAll("-", "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compact)) return undefined;
  return [
    compact.slice(0, 8),
    compact.slice(8, 12),
    compact.slice(12, 16),
    compact.slice(16, 20),
    compact.slice(20),
  ].join("-");
}

async function replyToFeishuMessage(
  messageId: string,
  eventId: string,
  text: string,
  env: Env,
): Promise<void> {
  const tenantAccessToken = await getTenantAccessToken(env);
  const uuid = normalizeReplyUuid(eventId);
  const response = await fetch(
    `https://open.feishu.cn/open-apis/im/v1/messages/${encodeURIComponent(messageId)}/reply`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${tenantAccessToken}`,
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        msg_type: "text",
        content: JSON.stringify({ text }),
        ...(uuid ? { uuid } : {}),
      }),
    },
  );
  const result = (await response.json()) as FeishuReplyResponse;
  if (!response.ok || result.code !== 0) {
    throw new Error(
      `Unable to reply to Feishu message: ${result.msg ?? response.status}`,
    );
  }
}

async function handleFeishuMessage(
  payload: FeishuEventPayload,
  env: Env,
): Promise<void> {
  const eventId = payload.header?.event_id;
  const message = payload.event?.message;
  if (!eventId || !message?.message_id) return;

  const text =
    message.message_type === "text"
      ? createFinanceAssistantReply(extractQuestion(payload))
      : "目前支持文字咨询。请把问题以文字形式发送给我。";
  await replyToFeishuMessage(message.message_id, eventId, text, env);
}

async function receiveFeishuEvent(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const rawBody = await request.text();
  const encryptKey = env.FEISHU_ENCRYPT_KEY?.trim();

  let parsed: { encrypted: boolean; payload: FeishuEventPayload };
  try {
    parsed = await parseFeishuPayload(rawBody, encryptKey);
  } catch {
    return jsonResponse({ error: "Invalid callback payload" }, 400);
  }

  if (parsed.encrypted && encryptKey) {
    const signature = request.headers.get("x-lark-signature");
    const isUrlVerification = parsed.payload.type === "url_verification";
    if (
      (signature || !isUrlVerification) &&
      !(await hasValidFeishuSignature(request, rawBody, encryptKey))
    ) {
      return jsonResponse({ error: "Invalid callback signature" }, 401);
    }
  }

  const verificationToken = env.FEISHU_VERIFICATION_TOKEN?.trim();
  if (!verificationToken) {
    return jsonResponse({ error: "Feishu callback is not configured" }, 503);
  }

  const receivedToken =
    parsed.payload.type === "url_verification"
      ? parsed.payload.token
      : parsed.payload.header?.token;
  if (
    !receivedToken ||
    !constantTimeEquals(receivedToken, verificationToken)
  ) {
    return jsonResponse({ error: "Invalid verification token" }, 401);
  }

  if (
    env.FEISHU_APP_ID &&
    parsed.payload.header?.app_id &&
    parsed.payload.header.app_id !== env.FEISHU_APP_ID
  ) {
    return jsonResponse({ error: "Invalid application ID" }, 401);
  }

  if (parsed.payload.type === "url_verification") {
    if (!parsed.payload.challenge) {
      return jsonResponse({ error: "Missing challenge" }, 400);
    }
    return jsonResponse({ challenge: parsed.payload.challenge });
  }

  if (
    parsed.payload.header?.event_type === "im.message.receive_v1" &&
    parsed.payload.event?.sender?.sender_type === "user"
  ) {
    ctx.waitUntil(
      handleFeishuMessage(parsed.payload, env).catch((error: unknown) => {
        console.error(
          "Failed to handle Feishu message:",
          error instanceof Error ? error.message : "Unknown error",
        );
      }),
    );
  }

  return jsonResponse({});
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "");

    if (pathname === "/api/feishu/events") {
      return receiveFeishuEvent(request, env, ctx);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
