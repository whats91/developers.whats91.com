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

test("webhook is a top-level menu with create, samples, and examples submenus", () => {
  const webhookCategory = sourceForCategory("webhook");

  assert.match(webhookCategory, /label: 'Webhook'/);
  assert.match(webhookCategory, /icon: 'Webhook'/);
  assertContainsAll(webhookCategory, [
    "{ id: 'webhook-create', title: 'Create', slug: 'create' }",
    "{ id: 'webhook-samples', title: 'Samples', slug: 'samples' }",
    "{ id: 'webhook-examples', title: 'Examples', slug: 'examples' }",
  ]);

  assert.doesNotMatch(docData, /webhooks-api/);
  assert.doesNotMatch(docData, /webhook-setup/);
  assert.match(sidebar, /Webhook/);
  assert.match(sidebar, /categoryIconMap/);
});

test("webhook create page documents the public v2 create contract", () => {
  const create = sourceForSection("webhook-create");

  assertContainsAll(create, [
    "category: 'webhook'",
    "Endpoint: POST /api/v2/webhooks",
    "GET /api/v2/webhooks/events",
    "Authorization: Bearer w91_public_token_here",
    "Content-Type: application/json",
    "senderId",
    "webhook.name",
    "webhook.endpointUrl",
    "webhook.events",
    "timeoutMs",
    "retryEnabled",
    "retryMaxAttempts",
    "verificationHeaderKey",
    "verificationToken",
    "signingSecret is returned only on create",
    "WEBHOOK_ENDPOINT_REQUIRES_HTTPS",
    "FEATURE_NOT_AVAILABLE",
    "UNSUPPORTED_CONTENT_TYPE",
    "WEBHOOK_NOT_FOUND",
  ]);
});

test("webhook samples page includes management and event payload samples", () => {
  const samples = sourceForSection("webhook-samples");

  assertContainsAll(samples, [
    "category: 'webhook'",
    "GET /api/v2/webhooks",
    "GET /api/v2/webhooks/:webhookUid",
    "POST /api/v2/webhooks/:webhookUid",
    "message.inbound.text",
    "message.status.delivered",
    "message.status.failed",
    "template.status_update",
    "CRM delivery hook",
    "clearVerificationToken",
    "MISSING_AUTH_TOKEN",
    "VALIDATION_FAILED",
  ]);
});

test("webhook examples page provides practical receiver and use-case guidance", () => {
  const examples = sourceForSection("webhook-examples");

  assertContainsAll(examples, [
    "category: 'webhook'",
    "Use Cases",
    "CRM handoff",
    "Delivery status sync",
    "Template review alerts",
    "Node.js receiver",
    "WHATS91_WEBHOOK_SIGNING_SECRET",
    "X-CRM-Webhook-Token",
    "respond with 200 quickly",
    "message.inbound.text",
    "message.status.delivered",
    "template.status_update",
  ]);
});

test("webhook docs use the canonical api v2 route only", () => {
  assert.doesNotMatch(docData, /endpoint: '\/v2\/webhooks'/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/webhooks/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/webhooks/);
});

test("webhook route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const webhookIndex = readRequiredFile("src/app/webhooks/page.tsx");
  const webhookSection = readRequiredFile("src/app/webhooks/[section]/page.tsx");
  const legacyWebhookIndex = readRequiredFile("src/app/webhook/page.tsx");
  const legacyWebhookSection = readRequiredFile("src/app/webhook/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "webhook",
    "/webhooks",
    "/webhook",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(webhookIndex, [
    "DocumentationPage",
    "webhook-create",
    "webhook",
  ]);

  assertContainsAll(webhookSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assert.match(legacyWebhookIndex, /permanentRedirect\(['"]\/webhooks['"]\)/);
  assert.match(legacyWebhookSection, /permanentRedirect\(`\/webhooks\/\$\{section\}`\)/);
});
