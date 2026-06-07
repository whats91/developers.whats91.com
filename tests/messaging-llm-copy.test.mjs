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

test("messaging LLM markdown guide contains implementation and debugging context", () => {
  const markdown = readRequiredFile("public/llms/messaging.md");

  assertContainsAll(markdown, [
    "# Whats91 Messaging API LLM Guide",
    "https://graph.whats91.com/api/v2",
    "Public API v2",
    "Authorization: Bearer",
    "Content-Type: application/json",
    "senderId",
    "Webhooks",
    "Reports",
    "POST /api/v2/send",
    "POST /api/v2/chat",
    "templateName",
    "mediaUrl",
    "buttons",
    "list",
    "Node.js",
    "PHP",
    "Invalid or missing bearer token",
    "Missing media payload",
    "16 MB media upload limit",
    "Queued reconnect responses",
    "data.messageId",
    "data.status",
    "data.senderId",
    "data.receiverId",
    "metadata.requestId",
  ]);
});

test("messaging LLM copy registry maps messaging to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "messaging",
    "/llms/messaging.md",
    "Messaging API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("docs renderer exposes a messaging-only Copy for LLM button with clipboard fallback", () => {
  const renderer = readRequiredFile("src/components/docs/content-renderer.tsx");

  assertContainsAll(renderer, [
    "CopyForLlmButton",
    "Copy for LLM",
    "Copying...",
    "Copied",
    "Copy failed",
    "navigator.clipboard.writeText",
    "document.createElement('textarea')",
    "getLlmCopyDocForCategory",
    "section.category",
    "shouldShowLlmActionInHeading",
    'placement="heading"',
    "sm:justify-between",
  ]);
});

test("llms.txt references the Messaging LLM markdown guide for AI discovery", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "Messaging API LLM Guide",
    "/llms/messaging.md",
  ]);
});
