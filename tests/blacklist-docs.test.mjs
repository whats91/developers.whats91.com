import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");
const sidebar = fs.readFileSync(path.join(rootDir, "src/components/docs/sidebar.tsx"), "utf8");

function readRequiredFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  assert.equal(fs.existsSync(absolutePath), true, `Expected ${relativePath} to exist`);
  return fs.readFileSync(absolutePath, "utf8");
}

function sourceForSection(id) {
  const sectionsStart = docData.indexOf("export const docSections");
  assert.notEqual(sectionsStart, -1, "Expected docSections export to exist");

  const marker = `id: '${id}'`;
  const start = docData.indexOf(marker, sectionsStart);
  assert.notEqual(start, -1, `Expected section ${id} to exist`);

  const nextSection = docData.indexOf("\n  // -------------------------------------------------------------------------", start + marker.length);
  const nextCategory = docData.indexOf("\n  // =========================================================================", start + marker.length);
  const endCandidates = [nextSection, nextCategory].filter((index) => index !== -1);
  const end = Math.min(...endCandidates);

  return docData.slice(start, end);
}

function sourceForCategory(id) {
  const categoriesStart = docData.indexOf("export const docCategories");
  assert.notEqual(categoriesStart, -1, "Expected docCategories export to exist");

  const marker = `id: '${id}'`;
  const start = docData.indexOf(marker, categoriesStart);
  assert.notEqual(start, -1, `Expected category ${id} to exist`);

  const nextCategory = docData.indexOf("\n  {", start + marker.length);
  const end = nextCategory === -1 ? docData.indexOf("// ---------------------------------------------------------------------------", start) : nextCategory;

  return docData.slice(start, end);
}

function assertContainsAll(source, values) {
  for (const value of values) {
    assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
}

const blacklistSections = [
  "{ id: 'blacklist-list', title: 'List Entries', slug: 'list' }",
  "{ id: 'blacklist-get', title: 'Get Entry', slug: 'get' }",
  "{ id: 'blacklist-add', title: 'Add Number', slug: 'add' }",
  "{ id: 'blacklist-update', title: 'Update Entry', slug: 'update' }",
  "{ id: 'blacklist-delete', title: 'Delete Entry', slug: 'delete' }",
];

test("blacklist is a top-level menu with seo-friendly endpoint submenus", () => {
  const blacklistCategory = sourceForCategory("blacklist");

  assert.match(blacklistCategory, /label: 'Blacklist'/);
  assert.match(blacklistCategory, /slug: 'blacklist'/);
  assert.match(blacklistCategory, /icon: 'Ban'/);
  assertContainsAll(blacklistCategory, blacklistSections);
  assert.match(sidebar, /Ban/);
  assert.match(sidebar, /getPathForSectionId/);
});

test("list blacklist page documents filters, sender scope, and response shape", () => {
  const list = sourceForSection("blacklist-list");

  assertContainsAll(list, [
    "category: 'blacklist'",
    "GET /api/v2/message-blacklist",
    "Authorization: Bearer w91_public_token_here",
    "sender-scoped",
    "senderId",
    "status",
    "ACTIVE",
    "INACTIVE",
    "ALL",
    "search",
    "page",
    "limit",
    "blacklistEntries",
    "items is an alias",
    "Internal database IDs, user_id, admin_id, encrypted values, and Redis/cache details are never returned",
  ]);
});

test("get entry page documents single entry retrieval and not found errors", () => {
  const get = sourceForSection("blacklist-get");

  assertContainsAll(get, [
    "category: 'blacklist'",
    "GET /api/v2/message-blacklist/{blacklistUid}",
    "blacklistUid",
    "data.blacklistEntry",
    "senderId",
    "BLACKLIST_ENTRY_NOT_FOUND",
  ]);
});

test("add number page documents add and reactivation behavior", () => {
  const add = sourceForSection("blacklist-add");

  assertContainsAll(add, [
    "POST /api/v2/message-blacklist",
    "Content-Type: application/json",
    "phone",
    "reason",
    "source",
    "Customer requested opt-out",
    "Phone numbers are normalized using the same contact-book phone rules",
    "Duplicate active rows",
    "Re-adding an inactive number reactivates it",
    "Redis blacklist cache",
  ]);
});

test("update and delete pages document write contracts", () => {
  const update = sourceForSection("blacklist-update");
  const remove = sourceForSection("blacklist-delete");

  assertContainsAll(update, [
    "POST /api/v2/message-blacklist/{blacklistUid}",
    "reason",
    "status",
    "Updated opt-out reason",
    "Only reason and status are editable through public v2",
    "ACTIVE",
    "INACTIVE",
  ]);

  assertContainsAll(remove, [
    "DELETE /api/v2/message-blacklist/{blacklistUid}",
    "soft removal",
    "INACTIVE",
    "deactivatedAt",
    "future sends are no longer blocked",
    "reactivated",
  ]);
});

test("blacklist docs document validation errors and canonical route only", () => {
  assertContainsAll(docData, [
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "SENDER_NOT_ALLOWED",
    "FEATURE_NOT_AVAILABLE",
    "WHATSAPP_SETUP_INCOMPLETE",
    "VALIDATION_FAILED",
    "BLACKLIST_ENTRY_NOT_FOUND",
    "UNSUPPORTED_CONTENT_TYPE",
    "https://graph.whats91.com/api/v2/message-blacklist",
  ]);

  assert.doesNotMatch(docData, /endpoint: '\/v2\/message-blacklist/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/message-blacklist/);
});

test("blacklist route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const blacklistIndex = readRequiredFile("src/app/blacklist/page.tsx");
  const blacklistSection = readRequiredFile("src/app/blacklist/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "blacklist",
    "/blacklist",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(blacklistIndex, [
    "DocumentationPage",
    "blacklist-list",
    "blacklist",
  ]);

  assertContainsAll(blacklistSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);
});
