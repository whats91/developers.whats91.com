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

const conversationSections = [
  "{ id: 'conversations-list', title: 'List Conversations', slug: 'list' }",
  "{ id: 'conversations-summary', title: 'Summary', slug: 'summary' }",
  "{ id: 'conversations-by-mobile', title: 'By Mobile', slug: 'by-mobile' }",
  "{ id: 'conversations-get', title: 'Get Conversation', slug: 'get' }",
  "{ id: 'conversations-messages', title: 'Messages', slug: 'messages' }",
];

test("conversations is a top-level menu with all get endpoint submenus", () => {
  const conversationsCategory = sourceForCategory("conversations");

  assert.match(conversationsCategory, /label: 'Conversations'/);
  assert.match(conversationsCategory, /slug: 'conversations'/);
  assert.match(conversationsCategory, /icon: 'MessageCircle'/);
  assertContainsAll(conversationsCategory, conversationSections);
  assert.match(sidebar, /MessageCircle/);
  assert.match(sidebar, /getPathForSectionId/);
});

test("list conversations page documents filters and conversation response shape", () => {
  const list = sourceForSection("conversations-list");

  assertContainsAll(list, [
    "category: 'conversations'",
    "GET /api/v2/reports/conversations",
    "Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx",
    "senderId",
    "page",
    "limit",
    "dateFrom",
    "dateTo",
    "search",
    "status",
    "archived",
    "unreadOnly",
    "lastDirection",
    "labelUid",
    "labelMatchMode",
    "sortBy",
    "conversations",
    "lastMessageContent",
    "unreadCount",
    "labels",
    "pagination",
  ]);
});

test("summary and by-mobile pages document their get endpoints", () => {
  const summary = sourceForSection("conversations-summary");
  const byMobile = sourceForSection("conversations-by-mobile");

  assertContainsAll(summary, [
    "GET /api/v2/reports/conversations/summary",
    "totalConversations",
    "unreadConversations",
    "archivedConversations",
    "activeConversations",
    "inboundLastCount",
    "outboundLastCount",
    "same conversation filters",
  ]);

  assertContainsAll(byMobile, [
    "GET /api/v2/reports/conversations/by-mobile/{mobileNumber}",
    "mobileNumber",
    "recipient phone",
    "thread summaries",
    "scoped to the authenticated sender",
  ]);
});

test("get conversation and messages pages document detail endpoints", () => {
  const get = sourceForSection("conversations-get");
  const messages = sourceForSection("conversations-messages");

  assertContainsAll(get, [
    "GET /api/v2/reports/conversations/{conversationId}",
    "conversationId",
    "numeric conversation id",
    "CONVERSATION_NOT_FOUND",
    "authenticated customer and sender",
  ]);

  assertContainsAll(messages, [
    "GET /api/v2/reports/conversations/{conversationId}/messages",
    "direction",
    "messageType",
    "messageId",
    "messageContent",
    "mediaUrl",
    "interactiveData",
    "locationData",
    "contactData",
    "Raw inbound/outbound payload dumps, internal database user IDs, encrypted values, and access tokens are never returned",
  ]);
});

test("conversation docs document auth, scope, errors, and canonical route only", () => {
  assertContainsAll(docData, [
    "GET endpoints also accept authToken, auth_token, or token as query parameters",
    "Public APIs do not accept a userId filter",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "SENDER_NOT_ALLOWED",
    "FEATURE_NOT_AVAILABLE",
    "WHATSAPP_SETUP_INCOMPLETE",
    "VALIDATION_FAILED",
    "CONVERSATION_NOT_FOUND",
    "https://graph.whats91.com/api/v2/reports/conversations",
  ]);

  assert.doesNotMatch(docData, /endpoint: '\/v2\/reports\/conversations/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/reports\/conversations/);
});

test("conversation route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const conversationsIndex = readRequiredFile("src/app/conversations/page.tsx");
  const conversationsSection = readRequiredFile("src/app/conversations/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "conversations",
    "/conversations",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(conversationsIndex, [
    "DocumentationPage",
    "conversations-list",
    "conversations",
  ]);

  assertContainsAll(conversationsSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);
});
