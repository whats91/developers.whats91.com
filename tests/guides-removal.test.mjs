import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");
const footer = fs.readFileSync(path.join(rootDir, "src/components/docs/footer.tsx"), "utf8");
const searchDialog = fs.readFileSync(path.join(rootDir, "src/components/docs/search-dialog.tsx"), "utf8");

test("guides menu and submenu sections are removed from docs navigation", () => {
  assert.doesNotMatch(docData, /id: 'guides'/);
  assert.doesNotMatch(docData, /label: 'Guides'/);
  assert.doesNotMatch(docData, /slug: 'guides'/);
  assert.doesNotMatch(docData, /category: 'guides'/);

  [
    "whatsapp-business-api",
    "two-factor-auth",
    "bulk-messaging",
    "error-codes",
  ].forEach((sectionId) => {
    assert.doesNotMatch(docData, new RegExp(`id: '${sectionId}'`));
  });
});

test("guides label is not exposed in shared navigation text", () => {
  assert.doesNotMatch(footer, /Guides/);
  assert.doesNotMatch(searchDialog, /guides/i);
});
