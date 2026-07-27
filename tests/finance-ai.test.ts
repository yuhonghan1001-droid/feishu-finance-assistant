import assert from "node:assert/strict";
import test from "node:test";
import { createFinanceAssistantReplyWithAI } from "../lib/finance-ai";

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("uses the model for an open-ended finance question", async () => {
  let requestBody: Record<string, unknown> | undefined;
  const reply = await createFinanceAssistantReplyWithAI(
    "如何设计跨境股权激励的税务方案？",
    {
      apiKey: "test-key",
      fetchImpl: async (_input, init) => {
        requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
        return jsonResponse({
          output: [
            {
              type: "message",
              content: [
                {
                  type: "output_text",
                  text: "可以从交易实质、税率、发票和付款条款四方面审核合同。",
                  annotations: [],
                },
              ],
            },
          ],
        });
      },
    },
  );

  assert.match(reply, /交易实质、税率、发票和付款条款/);
  assert.equal(requestBody?.model, "gpt-5.6-terra");
  assert.equal(requestBody?.store, false);
  assert.deepEqual(requestBody?.tools, [{ type: "web_search" }]);
  assert.match(String(requestBody?.instructions), /通用企业做法/);
  assert.match(String(requestBody?.instructions), /不要因此拒绝回答/);
  assert.match(String(requestBody?.instructions), /第一段必须直接回答/);
  assert.match(String(requestBody?.instructions), /正文必须独立回答问题/);
});

test("passes reviewed local knowledge to the model", async () => {
  let serializedInstructions = "";
  const reply = await createFinanceAssistantReplyWithAI(
    "数电发票没有章能报销吗？",
    {
      apiKey: "test-key",
      enableWebSearch: false,
      fetchImpl: async (_input, init) => {
        const body = JSON.parse(String(init?.body)) as {
          instructions?: unknown;
          tools?: unknown;
        };
        serializedInstructions = String(body.instructions);
        assert.equal(body.tools, undefined);
        return jsonResponse({
          output: [
            {
              type: "message",
              content: [
                {
                  type: "output_text",
                  text: "数电发票无需加盖发票专用章，但仍需满足公司报销审批要求。",
                },
              ],
            },
          ],
        });
      },
    },
  );

  assert.match(
    serializedInstructions,
    /关于推广应用全面数字化电子发票的公告/,
  );
  assert.match(reply, /无需加盖发票专用章/);
});

test("includes recent conversation turns for follow-up questions", async () => {
  let serializedInput = "";
  await createFinanceAssistantReplyWithAI("那需要什么材料？", {
    apiKey: "test-key",
    history: [
      { role: "user", content: "我的出差费用怎么报销？" },
      { role: "assistant", content: "先准备出差申请和合法票据。" },
    ],
    fetchImpl: async (_input, init) => {
      const body = JSON.parse(String(init?.body)) as { input?: unknown };
      serializedInput = JSON.stringify(body.input);
      return jsonResponse({
        output: [
          {
            type: "message",
            content: [{ type: "output_text", text: "通常需要出差申请和票据。" }],
          },
        ],
      });
    },
  });

  assert.match(serializedInput, /我的出差费用怎么报销/);
  assert.match(serializedInput, /先准备出差申请和合法票据/);
});

test("appends web citations returned by the API", async () => {
  const reply = await createFinanceAssistantReplyWithAI("最新申报期限是什么？", {
    apiKey: "test-key",
    fetchImpl: async () =>
      jsonResponse({
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: "请以税务机关最新公告为准。",
                annotations: [
                  {
                    type: "url_citation",
                    title: "国家税务总局",
                    url: "https://www.chinatax.gov.cn/example",
                  },
                ],
              },
            ],
          },
        ],
      }),
  });

  assert.match(reply, /参考资料/);
  assert.match(reply, /https:\/\/www\.chinatax\.gov\.cn\/example/);
});

test("does not disguise a missing model as missing finance knowledge", async () => {
  const reply = await createFinanceAssistantReplyWithAI(
    "如何设计跨境股权激励的税务方案？",
  );

  assert.match(reply, /智能问答服务暂时不可用/);
  assert.doesNotMatch(reply, /暂时没有找到足够明确的公开依据/);
});

test("falls back to reviewed knowledge when the API is unavailable", async () => {
  const errors: string[] = [];
  const reply = await createFinanceAssistantReplyWithAI(
    "数电发票没有章能报销吗？",
    {
      apiKey: "test-key",
      fetchImpl: async () => jsonResponse({ error: "unavailable" }, 503),
      onError: (error) => errors.push(error.message),
    },
  );

  assert.match(reply, /数电发票不需要发票专用章/);
  assert.match(reply, /智能问答服务暂时不可用/);
  assert.match(errors[0], /returned 503/);
});
