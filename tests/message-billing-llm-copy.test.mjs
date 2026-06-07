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

test("message billing LLM markdown guide contains billing endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/message-billing.md");

  assertContainsAll(markdown, [
    "# Whats91 Message Billing API LLM Guide",
    "https://graph.whats91.com/api/v2/billing",
    "GET /api/v2/billing/messages",
    "GET /api/v2/billing/messages/by-number/{phoneNumberId}",
    "GET /api/v2/billing/messages/by-template-type/{templateType}",
    "GET /api/v2/billing/messages/delivered",
    "GET /api/v2/billing/messages/payable",
    "GET /api/v2/billing/messages/free",
    "GET /api/v2/billing/summary",
    "GET /api/v2/billing/wallet",
    "GET /api/v2/billing/wallet/history",
    "Authorization: Bearer",
    "senderId",
    "phoneNumberId",
    "templateType",
    "billable",
    "billingClass",
    "payableAmount",
    "Node.js",
    "PHP",
    "SENDER_NOT_ALLOWED",
    "VALIDATION_FAILED",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("message billing LLM copy registry maps the message-billing category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "message-billing",
    "/llms/message-billing.md",
    "Message Billing API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered message billing LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
