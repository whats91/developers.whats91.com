import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

const docData = read("src/lib/doc-data.ts");
const changelogPage = read("src/app/changelog/page.tsx");
const changelogComponent = read("src/components/docs/changelog-page.tsx");

test("changelog entries use the supplied release versions and dates", () => {
  ["1.2.0", "1.0.2", "1.0.1", "1.0.0"].forEach((version) => {
    assert.match(docData, new RegExp(`version: '${version}'`));
  });

  ["2026-06-11", "2026-06-06", "2026-06-05", "2026-06-03"].forEach((date) => {
    assert.match(docData, new RegExp(`date: '${date}'`));
  });

  assert.doesNotMatch(docData, /version: 'v2\./);
  assert.doesNotMatch(docData, /2025-02-28|2024-12-01/);
});

test("changelog content includes release details extracted from the supplied source versions", () => {
  [
    "Improved dashboard return paths",
    "Flow Builder automation",
    "Campaign opt-out keyword handling",
    "Customer AI Profiles",
    "Customer AI Brains",
    "Flow journey tracking",
    "Public API v1 `sendtemplate` now supports optional `sendAsImage`",
    "Developer REST API dashboard documentation now shows a moved-docs notice",
    "Improved webhook chat-access cache safety",
    "public API v2 webhook management endpoints",
    "public API v2 message reporting endpoints",
    "public API v2 billing endpoints",
    "Improved contact book maintenance with duplicate phone cleanup",
    "partner password login support",
    "contact book duplicate phone cleanup workflow",
    "Orders > Payment Gateways",
    "The first Whats91 changelog baseline",
    "WhatsApp Cloud phone-number management",
    "Campaign source selection",
    "Developer public API tokens and REST documentation",
  ].forEach((text) => {
    assert.match(docData, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("changelog updates are split into distinct standalone entries", () => {
  [
    "Fixed: Dashboard return path after login",
    "Fixed: Campaign opt-out keyword handling",
    "Added: Customer AI Profiles",
    "Added: Flow journey tracking",
    "Changed: Flow Builder inbound trigger defaults",
    "Changed: Developer REST API dashboard documentation",
    "Added: Partner and Tech Partner account subtypes",
    "Added: Partner subscription activation with Whats91 Coins",
    "Added: Public API v2 webhook management endpoints",
    "Added: Public API v2 message reporting endpoints",
    "Added: Public API v2 billing endpoints",
    "Changed: Normal Partner and Tech Partner access boundaries",
    "Added: Partner password login support",
    "Added: Contact book duplicate phone cleanup workflow",
    "Added: Sender-scoped message blacklist management",
    "Fixed: Blacklist table source badge overflow",
    "WhatsApp Cloud phone-number management",
    "Template and Meta library management",
    "Campaign source selection",
    "Developer public API tokens and REST documentation",
  ].forEach((title) => {
    assert.match(docData, new RegExp(`title: '${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
  });

  [
    "Added: Partner controls and public API v2 coverage",
    "Added: Partner, contact, blacklist, Flow Builder, and payment tools",
    "Changed: Contact book, blacklist, partner, and legacy flows",
  ].forEach((groupedTitle) => {
    assert.doesNotMatch(
      docData,
      new RegExp(`title: '${groupedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`)
    );
  });

  assert.doesNotMatch(docData, /function releaseDetails/);
  assert.doesNotMatch(docData, /releaseDetails\(/);
});

test("changelog page groups changes under a single date and version header", () => {
  assert.match(changelogComponent, /groupedEntries/);
  assert.match(changelogComponent, /group\.entries\.map/);
  assert.match(changelogComponent, /\{formatDate\(group\.date\)\}/);
  assert.match(changelogComponent, /\{group\.version\}/);
  assert.doesNotMatch(changelogComponent, /filteredEntries\.map\(\(entry/);
  assert.doesNotMatch(changelogComponent, /\{formatDate\(entry\.date\)\}/);
  assert.doesNotMatch(changelogComponent, /\{entry\.version\}/);
});

test("changelog route metadata reflects the current release set", () => {
  assert.match(changelogPage, /Versions 1\.2\.0, 1\.0\.2, 1\.0\.1, and 1\.0\.0/);
  assert.match(changelogPage, /11 Jun 2026/);
  assert.match(changelogPage, /06 Jun 2026/);
  assert.match(changelogPage, /05 Jun 2026/);
  assert.match(changelogPage, /03 Jun 2026/);
});
