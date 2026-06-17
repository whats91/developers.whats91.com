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

test("crm lead generation LLM markdown guide contains endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/crm-lead-generation.md");

  assertContainsAll(markdown, [
    "# Whats91 CRM Lead Generation API LLM Guide",
    "https://graph.whats91.com/api/v2",
    "POST /api/v2/crm/leads",
    "POST /api/v2/crm/companies/{companyUid}/leads",
    "Authorization: Bearer",
    "companyUid",
    "lead.fields",
    "Node.js",
    "PHP",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "VALIDATION_FAILED",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("crm complaint creation LLM markdown guide contains endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/crm-complaint-creation.md");

  assertContainsAll(markdown, [
    "# Whats91 CRM Complaint Creation API LLM Guide",
    "https://graph.whats91.com/api/v2",
    "POST /api/v2/crm/complaints",
    "POST /api/v2/crm/companies/{companyUid}/complaints",
    "Authorization: Bearer",
    "companyUid",
    "complaint.fields",
    "ComplaintTitle",
    "Description",
    "Node.js",
    "PHP",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "VALIDATION_FAILED",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "X-Whats91-Crm-Complaint-Uid",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("crm lead generation LLM copy registry supports section-specific markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "crm-lead-generation",
    "/llms/crm-lead-generation.md",
    "CRM Lead Generation API LLM Guide",
    "crm-complaint-creation",
    "/llms/crm-complaint-creation.md",
    "CRM Complaint Creation API LLM Guide",
    "getLlmCopyDocForSection",
    "getLlmCopyDocForCategory",
  ]);
});

test("docs renderer resolves section-specific LLM guide before category fallback", () => {
  const renderer = readRequiredFile("src/components/docs/content-renderer.tsx");

  assertContainsAll(renderer, [
    "getLlmCopyDocForSection",
    "getLlmCopyDocForCategory",
    "section.id",
    "section.category",
  ]);
});

test("llms.txt route discovers registered crm guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "CRM APIs",
    "/crm",
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
