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

test("chatbot LLM markdown guide contains chatbot endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/chatbots.md");

  assertContainsAll(markdown, [
    "# Whats91 Chatbot API LLM Guide",
    "https://graph.whats91.com/api/v2/chatbots",
    "GET /api/v2/chatbots",
    "GET /api/v2/chatbots/{chatbotUid}",
    "POST /api/v2/chatbots",
    "POST /api/v2/chatbots/text",
    "POST /api/v2/chatbots/media",
    "POST /api/v2/chatbots/interactive",
    "Authorization: Bearer",
    "senderId",
    "chatbotUid",
    "trigger",
    "keywords",
    "response.type",
    "buttons",
    "ctaUrl",
    "sections",
    "Node.js",
    "PHP",
    "CHATBOT_NOT_FOUND",
    "FEATURE_NOT_AVAILABLE",
    "VALIDATION_FAILED",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("chatbot LLM copy registry maps the chatbot category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "chatbot",
    "/llms/chatbots.md",
    "Chatbot API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered chatbot LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
