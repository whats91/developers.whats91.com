import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");
const topNavbar = fs.readFileSync(path.join(rootDir, "src/components/docs/top-navbar.tsx"), "utf8");
const footer = fs.readFileSync(path.join(rootDir, "src/components/docs/footer.tsx"), "utf8");

test("api reference menu and submenu sections are removed from docs navigation", () => {
  assert.doesNotMatch(docData, /id: 'api-reference'/);
  assert.doesNotMatch(docData, /label: 'API Reference'/);
  assert.doesNotMatch(docData, /slug: 'api-reference'/);
  assert.doesNotMatch(docData, /category: 'api-reference'/);

  [
    "rest-api-overview",
    "media-api",
    "contacts-api",
    "groups-api",
  ].forEach((sectionId) => {
    assert.doesNotMatch(docData, new RegExp(`id: '${sectionId}'`));
  });
});

test("api reference label is not exposed in header or footer navigation", () => {
  assert.doesNotMatch(topNavbar, /API Reference/);
  assert.doesNotMatch(topNavbar, /api-reference/);
  assert.doesNotMatch(topNavbar, /rest-api-overview/);

  assert.doesNotMatch(footer, /API Reference/);
});
