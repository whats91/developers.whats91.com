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

test("contact book LLM markdown guide contains contact book endpoint implementation context", () => {
  const markdown = readRequiredFile("public/llms/contact-books.md");

  assertContainsAll(markdown, [
    "# Whats91 Contact Book API LLM Guide",
    "https://graph.whats91.com/api/v2/contact-books",
    "GET /api/v2/contact-books",
    "GET /api/v2/contact-books/{bookUid}",
    "GET /api/v2/contact-books/{bookUid}/contacts",
    "POST /api/v2/contact-books",
    "POST /api/v2/contact-books/{bookUid}",
    "POST /api/v2/contact-books/{bookUid}/contacts/bulk",
    "Authorization: Bearer",
    "global public API token",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "contactBookUid",
    "bookUid",
    "contacts",
    "defaultCountryCode",
    "customFields",
    "DUPLICATE_IN_REQUEST",
    "Node.js",
    "PHP",
    "CONTACT_BOOK_NOT_FOUND",
    "VALIDATION_FAILED",
    "Debugging Checklist",
    "metadata.requestId",
  ]);
});

test("contact book LLM copy registry maps the contact-book category to the public markdown guide", () => {
  const registry = readRequiredFile("src/lib/llm-copy-docs.ts");

  assertContainsAll(registry, [
    "contact-book",
    "/llms/contact-books.md",
    "Contact Book API LLM Guide",
    "getLlmCopyDocForCategory",
  ]);
});

test("llms.txt route discovers registered contact book LLM guide", () => {
  const llmsRoute = readRequiredFile("src/app/llms.txt/route.ts");

  assertContainsAll(llmsRoute, [
    "getLlmCopyDocs()",
    "Copy-ready Markdown for LLM implementation and debugging context.",
  ]);
});
