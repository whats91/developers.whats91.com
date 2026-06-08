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

test("template LLM markdown guide contains template creation implementation context", () => {
  const markdown = readRequiredFile("public/llms/templates.md");

  assertContainsAll(markdown, [
    "# Whats91 Template API LLM Guide",
    "https://graph.whats91.com/api/v2",
    "POST /api/v2/templates",
    "Authorization: Bearer",
    "Content-Type: application/json",
    "senderId",
    "MARKETING",
    "UTILITY",
    "AUTHENTICATION",
    "template.name",
    "template.category",
    "template.language",
    "template.body.examples",
    "COPY_CODE",
    "account meta",
    "14 days",
    "authenticationTemplateEligibleAt",
    "AUTHENTICATION_TEMPLATE_ACCOUNT_AGE_RESTRICTED",
    "mediaUrl",
    "Node.js",
    "PHP",
    "Template name already exists",
    "META_TEMPLATE_SUBMISSION_FAILED",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("template LLM copy registry maps the template category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "template",
    "/llms/templates.md",
    "Template API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered non-messaging LLM guides", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
