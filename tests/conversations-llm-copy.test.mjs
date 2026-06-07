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

test("conversations LLM markdown guide contains conversation report endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/conversations.md");

  assertContainsAll(markdown, [
    "# Whats91 Conversations API LLM Guide",
    "https://graph.whats91.com/api/v2/reports/conversations",
    "GET /api/v2/reports/conversations",
    "GET /api/v2/reports/conversations/summary",
    "GET /api/v2/reports/conversations/by-mobile/{mobileNumber}",
    "GET /api/v2/reports/conversations/{conversationId}",
    "GET /api/v2/reports/conversations/{conversationId}/messages",
    "Authorization: Bearer",
    "senderId",
    "conversationId",
    "mobileNumber",
    "unreadOnly",
    "labelUid",
    "labelMatchMode",
    "lastDirection",
    "Node.js",
    "PHP",
    "CONVERSATION_NOT_FOUND",
    "SENDER_NOT_ALLOWED",
    "VALIDATION_FAILED",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("conversations LLM copy registry maps the conversations category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "conversations",
    "/llms/conversations.md",
    "Conversations API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered conversations LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
