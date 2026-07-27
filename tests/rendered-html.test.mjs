import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

async function render() {
  const worker = await loadWorker();
  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finance assistant", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>财税小助手/);
  assert.match(html, /权威政策库/);
  assert.match(html, /公开资料已核验/);
  assert.match(html, /内部制度待接入/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("keeps public sources explicit and current", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(
    new URL("../app/layout.tsx", import.meta.url),
    "utf8",
  );

  assert.match(page, /国家税务总局公告 2024 年第 11 号/);
  assert.match(page, /企业所得税税前扣除凭证管理办法/);
  assert.match(page, /2026-07-25/);
  assert.match(page, /需内部制度/);
  assert.match(layout, /lang="zh-CN"/);
  assert.doesNotMatch(page, /_sites-preview|react-loading-skeleton/);
});

test("verifies the Feishu callback URL without exposing secrets", async () => {
  const worker = await loadWorker();
  const request = new Request("http://localhost/api/feishu/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      challenge: "challenge-code",
      token: "verification-token",
      type: "url_verification",
    }),
  });
  const response = await worker.fetch(
    request,
    {
      FEISHU_VERIFICATION_TOKEN: "verification-token",
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { challenge: "challenge-code" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("rejects a Feishu callback with the wrong verification token", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/feishu/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        challenge: "challenge-code",
        token: "wrong-token",
        type: "url_verification",
      }),
    }),
    {
      FEISHU_VERIFICATION_TOKEN: "verification-token",
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 401);
});

test("decrypts an encrypted Feishu URL verification request", async () => {
  const worker = await loadWorker();
  const encryptKey = "test-encrypt-key";
  const verificationToken = "verification-token";
  const iv = Uint8Array.from({ length: 16 }, (_, index) => index + 1);
  const keyBytes = createHash("sha256").update(encryptKey).digest();
  const key = await webcrypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );
  const plaintext = new TextEncoder().encode(
    JSON.stringify({
      challenge: "encrypted-challenge",
      token: verificationToken,
      type: "url_verification",
    }),
  );
  const encrypted = new Uint8Array(
    await webcrypto.subtle.encrypt({ name: "AES-CBC", iv }, key, plaintext),
  );
  const combined = Buffer.concat([Buffer.from(iv), Buffer.from(encrypted)]);

  const response = await worker.fetch(
    new Request("http://localhost/api/feishu/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ encrypt: combined.toString("base64") }),
    }),
    {
      FEISHU_VERIFICATION_TOKEN: verificationToken,
      FEISHU_ENCRYPT_KEY: encryptKey,
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    challenge: "encrypted-challenge",
  });
});

test("answers a Feishu text message and removes the bot mention", async () => {
  const worker = await loadWorker();
  const originalFetch = globalThis.fetch;
  const outboundRequests = [];
  const backgroundTasks = [];

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    outboundRequests.push({
      url,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
      headers: init?.headers,
    });

    if (url.endsWith("/auth/v3/tenant_access_token/internal")) {
      return Response.json({
        code: 0,
        msg: "success",
        tenant_access_token: "tenant-token",
        expire: 7200,
      });
    }
    if (url.includes("/im/v1/messages/") && url.endsWith("/reply")) {
      return Response.json({ code: 0, msg: "success" });
    }
    throw new Error(`Unexpected outbound request: ${url}`);
  };

  try {
    const response = await worker.fetch(
      new Request("http://localhost/api/feishu/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          schema: "2.0",
          header: {
            event_id: "5e3702a84e847582be8db7fb73283c02",
            event_type: "im.message.receive_v1",
            token: "verification-token",
            app_id: "cli_test",
          },
          event: {
            sender: { sender_type: "user" },
            message: {
              message_id: "om_test",
              message_type: "text",
              content: JSON.stringify({
                text: "@_user_1 数电发票没有章，可以报销吗？",
              }),
              mentions: [{ key: "@_user_1" }],
            },
          },
        }),
      }),
      {
        FEISHU_APP_ID: "cli_test",
        FEISHU_APP_SECRET: "app-secret",
        FEISHU_VERIFICATION_TOKEN: "verification-token",
      },
      {
        waitUntil(promise) {
          backgroundTasks.push(promise);
        },
        passThroughOnException() {},
      },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {});
    await Promise.all(backgroundTasks);

    assert.equal(outboundRequests.length, 2);
    assert.match(
      outboundRequests[1].url,
      /\/open-apis\/im\/v1\/messages\/om_test\/reply$/,
    );
    assert.equal(outboundRequests[1].body.msg_type, "text");
    assert.equal(
      outboundRequests[1].body.uuid,
      "5e3702a8-4e84-7582-be8d-b7fb73283c02",
    );
    const replyContent = JSON.parse(outboundRequests[1].body.content);
    assert.match(replyContent.text, /数电发票不需要发票专用章/);
    assert.doesNotMatch(replyContent.text, /@_user_1/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
