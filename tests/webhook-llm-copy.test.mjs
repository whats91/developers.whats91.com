import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function readRequiredFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  assert.equal(fs.existsSync(absolutePath), true, `Expected ${relativePath} to exist`);
  return fs.readFileSync(absolutePath, "utf8");
}

function assertContainsAll(source, values) {
  for (const value of values) {
    assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
}

test("webhook LLM markdown guide contains management and receiver implementation context", () => {
  const markdown = readRequiredFile("public/llms/webhooks.md");

  assertContainsAll(markdown, [
    "# Whats91 Webhook API LLM Guide",
    "https://graph.whats91.com/api/v2",
    "GET /api/v2/webhooks/events",
    "POST /api/v2/webhooks",
    "GET /api/v2/webhooks",
    "GET /api/v2/webhooks/:webhookUid",
    "POST /api/v2/webhooks/:webhookUid",
    "Authorization: Bearer",
    "Content-Type: application/json",
    "senderId",
    "webhook.name",
    "webhook.endpointUrl",
    "webhook.events",
    "message.inbound.text",
    "message.status.delivered",
    "template.status_update",
    "signingSecret",
    "X-CRM-Webhook-Token",
    "X-Whats91-Signature",
    "Node.js",
    "PHP",
    "WEBHOOK_ENDPOINT_REQUIRES_HTTPS",
    "WEBHOOK_NOT_FOUND",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("webhook LLM copy registry maps the webhook category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "webhook",
    "/llms/webhooks.md",
    "Webhook API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered webhook LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
