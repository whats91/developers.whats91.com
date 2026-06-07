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

const chatbotSections = [
  "{ id: 'chatbot-list', title: 'List Chatbots', slug: 'list' }",
  "{ id: 'chatbot-get', title: 'Get Chatbot', slug: 'get' }",
  "{ id: 'chatbot-create', title: 'Create Chatbot', slug: 'create' }",
  "{ id: 'chatbot-text', title: 'Text Chatbot', slug: 'text' }",
  "{ id: 'chatbot-media', title: 'Media Chatbot', slug: 'media' }",
  "{ id: 'chatbot-interactive', title: 'Interactive Chatbot', slug: 'interactive' }",
];

test("chatbot is a top-level menu with seo-friendly endpoint submenus", () => {
  const chatbotCategory = sourceForCategory("chatbot");

  assert.match(chatbotCategory, /label: 'Chatbot'/);
  assert.match(chatbotCategory, /slug: 'chatbot'/);
  assert.match(chatbotCategory, /icon: 'Bot'/);
  assertContainsAll(chatbotCategory, chatbotSections);

  assert.doesNotMatch(docData, /id: 'chatbots'/);
  assert.match(sidebar, /Bot/);
  assert.match(sidebar, /getPathForSectionId/);
});

test("chatbot list and get pages document retrieval endpoints", () => {
  const list = sourceForSection("chatbot-list");
  const get = sourceForSection("chatbot-get");

  assertContainsAll(list, [
    "category: 'chatbot'",
    "GET /api/v2/chatbots",
    "Authorization: Bearer w91_public_token_here",
    "senderId",
    "status",
    "type",
    "trigger",
    "page",
    "limit",
    "pagination",
  ]);

  assertContainsAll(get, [
    "category: 'chatbot'",
    "GET /api/v2/chatbots/{chatbotUid}",
    "chatbotUid",
    "public identifier returned after creation",
    "CHATBOT_NOT_FOUND",
  ]);
});

test("general chatbot creation page documents common fields and validation", () => {
  const create = sourceForSection("chatbot-create");

  assertContainsAll(create, [
    "category: 'chatbot'",
    "POST /api/v2/chatbots",
    "response.type",
    "name",
    "trigger.keywords",
    "trigger.keyword",
    "contains",
    "exact",
    "starts_with",
    "ends_with",
    "contains_whole_word",
    "regex",
    "welcome",
    "priority",
    "status",
    "ACTIVE",
    "INACTIVE",
    "chatbotUid",
    "botType",
    "replyTrigger",
    "replyText",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "SENDER_NOT_ALLOWED",
    "FEATURE_NOT_AVAILABLE",
    "MISSING_CHATBOT",
    "VALIDATION_FAILED",
    "UNSUPPORTED_CONTENT_TYPE",
  ]);
});

test("text and media chatbot pages document specialized request shapes", () => {
  const text = sourceForSection("chatbot-text");
  const media = sourceForSection("chatbot-media");

  assertContainsAll(text, [
    "POST /api/v2/chatbots/text",
    "response.text",
    "Invoice Help",
    "Please share your invoice number.",
    "Order Tracking",
    "Support Hours",
    "Lead Capture",
    "Appointment Reminder",
  ]);

  assertContainsAll(media, [
    "POST /api/v2/chatbots/media",
    "IMAGE",
    "VIDEO",
    "AUDIO",
    "DOCUMENT",
    "public HTTPS",
    "http://",
    "localhost",
    "metaMediaId",
    "base64",
    "MISSING_CHATBOT_MEDIA",
    "INVALID_CHATBOT_MEDIA",
  ]);
});

test("interactive chatbot page documents buttons, cta, and list responses", () => {
  const interactive = sourceForSection("chatbot-interactive");

  assertContainsAll(interactive, [
    "POST /api/v2/chatbots/interactive",
    "buttons",
    "cta",
    "list",
    "footerText",
    "ctaUrl",
    "sections",
    "rows",
    "Buttons are limited to three choices",
    "Support Choices",
    "Open Portal",
    "Department Menu",
    "Product Picker",
  ]);
});

test("chatbot docs use the canonical api v2 chatbot route only", () => {
  assert.doesNotMatch(docData, /endpoint: '\/v2\/chatbots/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/chatbots/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/chatbots/);
});

test("chatbot route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const docsPage = readRequiredFile("src/components/docs/documentation-page.tsx");
  const chatbotIndex = readRequiredFile("src/app/chatbots/page.tsx");
  const chatbotSection = readRequiredFile("src/app/chatbots/[section]/page.tsx");
  const legacyChatbotIndex = readRequiredFile("src/app/chatbot/page.tsx");
  const legacyChatbotSection = readRequiredFile("src/app/chatbot/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "chatbot",
    "/chatbots",
    "/chatbot",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(docsPage, [
    "initialSectionId",
    "initialCategoryId",
    "ContentRenderer",
    "TableOfContents",
  ]);

  assertContainsAll(chatbotIndex, [
    "DocumentationPage",
    "chatbot-list",
    "chatbot",
  ]);

  assertContainsAll(chatbotSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assert.match(legacyChatbotIndex, /permanentRedirect\(['"]\/chatbots['"]\)/);
  assert.match(legacyChatbotSection, /permanentRedirect\(`\/chatbots\/\$\{section\}`\)/);
});
