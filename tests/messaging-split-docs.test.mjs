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

const messagingSections = [
  "{ id: 'messaging-overview', title: 'Overview', slug: 'overview' }",
  "{ id: 'messaging-template-send', title: 'Template Send', slug: 'template-send' }",
  "{ id: 'messaging-chat-text', title: 'Chat Text', slug: 'chat-text' }",
  "{ id: 'messaging-chat-media', title: 'Chat Media', slug: 'chat-media' }",
  "{ id: 'messaging-chat-interactive', title: 'Chat Interactive', slug: 'chat-interactive' }",
];

const metaSections = [
  "{ id: 'messaging-meta-overview', title: 'Overview', slug: 'overview' }",
  "{ id: 'messaging-meta-text', title: 'Text', slug: 'text' }",
  "{ id: 'messaging-meta-template', title: 'Template', slug: 'template' }",
  "{ id: 'messaging-meta-media', title: 'Media', slug: 'media' }",
  "{ id: 'messaging-meta-interactive', title: 'Interactive', slug: 'interactive' }",
  "{ id: 'messaging-meta-errors', title: 'Responses & Errors', slug: 'responses-errors' }",
];

test("messaging menus split Whats91 APIs from Meta-compatible APIs", () => {
  const messagingCategory = sourceForCategory("messaging");
  const metaCategory = sourceForCategory("messaging-meta");

  assert.match(messagingCategory, /label: 'Messaging'/);
  assert.match(messagingCategory, /slug: 'messaging'/);
  assert.match(messagingCategory, /icon: 'MessageSquare'/);
  assertContainsAll(messagingCategory, messagingSections);
  assert.doesNotMatch(messagingCategory, /send-messages|media-messages|interactive-messages|message-status/);

  assert.match(metaCategory, /label: 'Messaging Meta-Compatibility'/);
  assert.match(metaCategory, /slug: 'messaging-meta'/);
  assert.match(metaCategory, /icon: 'Code2'/);
  assertContainsAll(metaCategory, metaSections);
  assert.doesNotMatch(docData, /send-message-api/);

  assert.match(sidebar, /MessageSquare/);
  assert.match(sidebar, /Code2/);
});

test("Whats91 messaging docs only document project-specific send and chat endpoints", () => {
  const overview = sourceForSection("messaging-overview");
  const templateSend = sourceForSection("messaging-template-send");
  const chatText = sourceForSection("messaging-chat-text");
  const chatMedia = sourceForSection("messaging-chat-media");
  const chatInteractive = sourceForSection("messaging-chat-interactive");
  const whats91Messaging = [overview, templateSend, chatText, chatMedia, chatInteractive].join("\n");

  assertContainsAll(overview, [
    "POST /api/v2/send",
    "POST /api/v2/chat",
    "Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx",
    "authToken",
    "auth_token",
    "senderId",
    "application/json",
    "multipart/form-data",
    "16 MB",
    "data.messageId",
    "metadata.requestId",
    "queued: true",
    "queueUid",
    "reportUid",
  ]);

  assertContainsAll(templateSend, [
    "POST /api/v2/send",
    "templateName",
    "template_name",
    "parameters",
    "buttonParameters",
    "button_parameters",
    "mediaUrl",
    "mediaFile",
    "CAROUSEL_TEMPLATE_NOT_SUPPORTED_IN_V2_SEND",
  ]);

  assertContainsAll(chatText, [
    "POST /api/v2/chat",
    "messageText",
    "message_text",
    "body",
    "message",
    "MISSING_TEXT",
  ]);

  assertContainsAll(chatMedia, [
    "mediaUrl",
    "mediaId",
    "mediaFile",
    "pdf, txt, doc, docx, xls, xlsx, csv, jpg, jpeg, png, gif, mp3, mp4, 3gp, 3gpp",
    "UNSUPPORTED_CONTENT_TYPE",
  ]);

  assertContainsAll(chatInteractive, [
    "buttons",
    "max 3",
    "List",
    "sections.rows",
    "max 10 rows",
    "UNSUPPORTED_CHAT_MESSAGE_TYPE",
  ]);

  assert.doesNotMatch(whats91Messaging, /\/api\/v2\/messages/);
  assert.doesNotMatch(whats91Messaging, /messaging_product/);
  assert.doesNotMatch(whats91Messaging, /https:\/\/api\.whats91\.com\/v2\/messages/);
});

test("Meta-compatible messaging docs only document Meta-style JSON payloads", () => {
  const overview = sourceForSection("messaging-meta-overview");
  const text = sourceForSection("messaging-meta-text");
  const template = sourceForSection("messaging-meta-template");
  const media = sourceForSection("messaging-meta-media");
  const interactive = sourceForSection("messaging-meta-interactive");
  const errors = sourceForSection("messaging-meta-errors");
  const metaMessaging = [overview, text, template, media, interactive, errors].join("\n");

  assertContainsAll(overview, [
    "POST /api/v2/messages",
    "POST /api/v2/{phoneNumberId}/messages",
    "application/json only",
    "messaging_product",
    "text",
    "image",
    "video",
    "audio",
    "document",
    "sticker",
    "location",
    "contacts",
    "template",
    "interactive",
    "reaction",
  ]);

  assertContainsAll(text, [
    "https://graph.whats91.com/api/v2/messages",
    "senderId",
    "messaging_product",
    "type",
    "text",
    "body",
  ]);

  assertContainsAll(template, [
    "type",
    "template",
    "name",
    "language",
    "components",
    "parameters",
  ]);

  assertContainsAll(media, [
    "image",
    "video",
    "audio",
    "document",
    "sticker",
    "link or id",
    "filename",
  ]);

  assertContainsAll(interactive, [
    "interactive",
    "button",
    "list",
    "reply",
    "sections",
  ]);

  assertContainsAll(errors, [
    "messaging_product",
    "contacts",
    "messages",
    "wamid.xxxxx",
    "MISSING_BEARER_TOKEN",
    "INVALID_PUBLIC_API_TOKEN",
    "PHONE_NUMBER_NOT_FOUND",
    "MISSING_TYPE_OBJECT",
    "UNSUPPORTED_MESSAGE_TYPE",
  ]);

  assert.doesNotMatch(metaMessaging, /templateName/);
  assert.doesNotMatch(metaMessaging, /buttonParameters/);
  assert.doesNotMatch(metaMessaging, /mediaFile/);
  assert.doesNotMatch(metaMessaging, /\/api\/v2\/send/);
  assert.doesNotMatch(metaMessaging, /\/api\/v2\/chat/);
});

test("messaging split route files expose dedicated page paths", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const messagingIndex = readRequiredFile("src/app/messaging/page.tsx");
  const messagingSection = readRequiredFile("src/app/messaging/[section]/page.tsx");
  const metaIndex = readRequiredFile("src/app/messaging/meta-compatibility/page.tsx");
  const metaSection = readRequiredFile("src/app/messaging/meta-compatibility/[section]/page.tsx");
  const legacyMetaIndex = readRequiredFile("src/app/messaging-meta/page.tsx");
  const legacyMetaSection = readRequiredFile("src/app/messaging-meta/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "messaging",
    "/messaging",
    "messaging-meta",
    "/messaging/meta-compatibility",
    "/messaging-meta",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(messagingIndex, [
    "DocumentationPage",
    "messaging-overview",
    "messaging",
  ]);

  assertContainsAll(messagingSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assertContainsAll(metaIndex, [
    "DocumentationPage",
    "messaging-meta-overview",
    "messaging-meta",
  ]);

  assertContainsAll(metaSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assert.match(legacyMetaIndex, /permanentRedirect\(['"]\/messaging\/meta-compatibility['"]\)/);
  assert.match(legacyMetaSection, /permanentRedirect\(`\/messaging\/meta-compatibility\/\$\{section\}`\)/);
});
