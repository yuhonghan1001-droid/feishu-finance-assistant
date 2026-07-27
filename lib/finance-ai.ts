import {
  createFinanceAssistantReply,
  findAnswer,
  formatAnswerForFeishu,
  isHelpRequest,
} from "./finance-knowledge";

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

type UrlCitation = {
  type?: string;
  url?: string;
  title?: string;
};

type ResponseContent = {
  type?: string;
  text?: string;
  annotations?: UrlCitation[];
};

type ResponsesApiPayload = {
  output?: Array<{
    type?: string;
    content?: ResponseContent[];
  }>;
};

export type FinanceAssistantOptions = {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  history?: ConversationTurn[];
  enableWebSearch?: boolean;
  fetchImpl?: typeof fetch;
  safetyIdentifier?: string;
  onError?: (error: Error) => void;
};

const DEFAULT_MODEL = "gpt-5.6-terra";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_CONTENT_LENGTH = 4_000;

const INSTRUCTIONS = `你是面向中国企业员工的“财税小助手”。直接回答用户问题，不要套用固定拒答模板。

回答要求：
1. 第一段必须直接回答用户实际问的内容；用户问“有哪些”时直接列出有哪些，问“能不能”时先明确回答能或不能以及条件，问“怎么办”时先给操作办法。
2. 默认控制在 300—600 个汉字。不要先讲审核方法论，不要要求用户先阅读政策，不要重复问题，也不要使用“【公开规则】”一类标签开头。
3. 先给结论和必要的可执行步骤，再补充风险边界；默认使用简洁、自然的中文。
4. 明确区分“公开规则”“通用企业做法”和“需公司确认”。不得把通用做法说成用户公司的正式制度。
5. 公司制度未提供时，也要先给多数企业可采用的通用流程，再指出金额、权限、材料、时限等需要向本公司确认的项目。
6. 涉及税率、申报期限、现行政策或其他可能变化的信息时，使用联网检索，并优先采用中国政府、财政部、国家税务总局等官方来源；来源放在回答末尾，只作补充，正文必须独立回答问题。
7. 本地参考资料是已审核内容。与问题相关时优先采用；不相关时忽略。不得编造政策名称、条文、公司审批结果或不存在的内部制度。
8. 信息不足时，先给当前条件下有用的通用答案，再提出不超过两个关键追问。
9. 不要求用户提供密码、验证码、银行卡号、身份证完整号码或其他不必要的敏感信息。
10. 仅提供办事参考；涉及正式申报、合同签署、重大税务处理或最终审批时，提示由公司财务、税务或法务人员复核。`;

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function buildLocalReference(question: string): string {
  const answer = findAnswer(question);
  if (!answer.sourceIds.length) {
    return "本地知识库没有命中该问题。请根据公开规则或通用企业实践回答，不要因此拒绝回答。";
  }

  return [
    "以下是本地已审核参考。请针对用户的具体问法重新组织答案，不要机械照抄：",
    formatAnswerForFeishu(answer, { includeSources: true }),
  ].join("\n\n");
}

function trimHistory(history: ConversationTurn[] = []): ConversationTurn[] {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    role: turn.role,
    content: turn.content.slice(0, MAX_HISTORY_CONTENT_LENGTH),
  }));
}

function extractTextAndCitations(payload: ResponsesApiPayload): {
  text: string;
  citations: Array<{ title: string; url: string }>;
} {
  const textParts: string[] = [];
  const citations = new Map<string, string>();

  for (const item of payload.output ?? []) {
    if (item.type !== "message") continue;

    for (const content of item.content ?? []) {
      if (content.type !== "output_text" || !content.text) continue;
      textParts.push(content.text);

      for (const annotation of content.annotations ?? []) {
        if (annotation.type !== "url_citation" || !annotation.url) continue;
        citations.set(
          annotation.url,
          annotation.title?.trim() || "参考资料",
        );
      }
    }
  }

  return {
    text: textParts
      .join("\n")
      .replace(/cite[^]+/g, "")
      .trim(),
    citations: [...citations].map(([url, title]) => ({ title, url })),
  };
}

function appendCitations(
  text: string,
  citations: Array<{ title: string; url: string }>,
): string {
  const missingCitations = citations.filter(({ url }) => !text.includes(url));
  if (!missingCitations.length) return text;

  return [
    text,
    "",
    "参考资料：",
    ...missingCitations.map(
      ({ title, url }, index) => `${index + 1}. ${title}\n${url}`,
    ),
  ].join("\n");
}

function fallbackAfterModelFailure(question: string): string {
  const answer = findAnswer(question);
  if (answer.sourceIds.length) {
    return [
      formatAnswerForFeishu(answer),
      "",
      "说明：智能问答服务暂时不可用，以上为本地知识库答案。",
    ].join("\n");
  }

  return [
    "智能问答服务暂时不可用，请稍后再试。",
    "",
    "你的问题已经收到；这不是因为问题没有答案，也不需要反复改写问题。",
  ].join("\n");
}

export async function createFinanceAssistantReplyWithAI(
  question: string,
  options: FinanceAssistantOptions = {},
): Promise<string> {
  if (!question || isHelpRequest(question)) {
    return createFinanceAssistantReply(question);
  }

  const apiKey = options.apiKey?.trim();
  if (!apiKey) {
    return fallbackAfterModelFailure(question);
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = normalizeBaseUrl(options.baseUrl?.trim() || DEFAULT_BASE_URL);
  const model = options.model?.trim() || DEFAULT_MODEL;
  const input = [
    ...trimHistory(options.history),
    {
      role: "user" as const,
      content: question,
    },
  ];
  const instructions = [
    INSTRUCTIONS,
    "",
    "<local_reference>",
    buildLocalReference(question),
    "</local_reference>",
  ].join("\n");

  try {
    const response = await fetchImpl(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        store: false,
        max_output_tokens: 1_600,
        reasoning: { effort: "low" },
        text: { verbosity: "medium" },
        ...(options.enableWebSearch === false
          ? {}
          : { tools: [{ type: "web_search" }] }),
        ...(options.safetyIdentifier
          ? { safety_identifier: options.safetyIdentifier }
          : {}),
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const requestId = response.headers.get("x-request-id");
      throw new Error(
        `OpenAI Responses API returned ${response.status}${
          requestId ? ` (request ${requestId})` : ""
        }.`,
      );
    }

    const payload = (await response.json()) as ResponsesApiPayload;
    const result = extractTextAndCitations(payload);
    if (!result.text) {
      throw new Error("OpenAI Responses API returned no text.");
    }
    return appendCitations(result.text, result.citations);
  } catch (error) {
    const normalizedError =
      error instanceof Error ? error : new Error("Unknown model error.");
    options.onError?.(normalizedError);
    return fallbackAfterModelFailure(question);
  }
}
