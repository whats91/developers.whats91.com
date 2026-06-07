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

test("reports LLM markdown guide contains report endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/reports.md");

  assertContainsAll(markdown, [
    "# Whats91 Reports API LLM Guide",
    "https://graph.whats91.com/api/v2/reports",
    "GET /api/v2/reports/messages",
    "GET /api/v2/reports/messages/status",
    "GET /api/v2/reports/messages/history",
    "GET /api/v2/reports/campaigns",
    "GET /api/v2/reports/campaigns/{campaignUid}",
    "GET /api/v2/reports/campaigns/{campaignUid}/messages",
    "GET /api/v2/reports/campaigns/{campaignUid}/timeline",
    "GET /api/v2/reports/campaigns/responses",
    "GET /api/v2/reports/analytics/delivery",
    "GET /api/v2/reports/analytics/failures",
    "GET /api/v2/reports/analytics/templates",
    "GET /api/v2/reports/analytics/dates",
    "Authorization: Bearer",
    "senderId",
    "messageId",
    "mobileNumber",
    "campaignUid",
    "pagination",
    "latestStatus",
    "Node.js",
    "PHP",
    "MESSAGE_NOT_FOUND",
    "CAMPAIGN_NOT_FOUND",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("reports LLM copy registry maps the reports category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "reports",
    "/llms/reports.md",
    "Reports API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered reports LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
