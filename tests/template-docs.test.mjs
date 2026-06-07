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

test("template is a top-level menu with category-specific submenus", () => {
  const templateCategory = sourceForCategory("template");
  const messagingCategory = sourceForCategory("messaging");

  assert.match(templateCategory, /label: 'Template'/);
  assert.match(templateCategory, /icon: 'FileText'/);
  assertContainsAll(templateCategory, [
    "{ id: 'template-marketing', title: 'Marketing', slug: 'marketing' }",
    "{ id: 'template-utility', title: 'Utility', slug: 'utility' }",
    "{ id: 'template-authentication', title: 'Authentication', slug: 'authentication' }",
  ]);

  assert.doesNotMatch(messagingCategory, /message-templates/);
  assert.doesNotMatch(docData, /templates-api/);
  assert.match(sidebar, /FileText/);
  assert.match(sidebar, /categoryIconMap/);
});

test("marketing template creation page documents API contract and examples", () => {
  const marketing = sourceForSection("template-marketing");

  assertContainsAll(marketing, [
    "category: 'template'",
    "POST /api/v2/templates",
    "Authorization: Bearer w91_public_token_here",
    "Content-Type: application/json",
    "MARKETING",
    "Required fields",
    "Optional fields",
    "template.name",
    "template.category",
    "template.language",
    "template.body.text",
    "metadata",
    "Success Response",
    "Validation Error Response",
    "TEMPLATE_NAME_EXISTS",
    "META_TEMPLATE_SUBMISSION_FAILED",
    "festival_offer_v1",
    "flash_sale_alert",
    "new_product_launch",
    "cart_recovery_offer",
    "loyalty_coupon",
    "event_invitation",
  ]);
});

test("utility template creation page documents API contract and examples", () => {
  const utility = sourceForSection("template-utility");

  assertContainsAll(utility, [
    "category: 'template'",
    "POST /api/v2/templates",
    "Authorization: Bearer w91_public_token_here",
    "UTILITY",
    "Required fields",
    "Optional fields",
    "senderId",
    "mediaFile",
    "header.mediaUrl",
    "Success Response",
    "Validation Error Response",
    "MISSING_HEADER_MEDIA",
    "payment_reminder_v1",
    "invoice_ready_pdf",
    "shipping_update",
    "appointment_confirmation",
    "order_status_update",
    "service_ticket_update",
  ]);
});

test("authentication template creation page documents copy-code rules and examples", () => {
  const authentication = sourceForSection("template-authentication");

  assertContainsAll(authentication, [
    "category: 'template'",
    "POST /api/v2/templates",
    "Authorization: Bearer w91_public_token_here",
    "AUTHENTICATION",
    "COPY_CODE",
    "Do not include URLs, emojis, headers, footers, or non-copy-code buttons",
    "Required fields",
    "Optional fields",
    "Success Response",
    "Validation Error Response",
    "VALIDATION_FAILED",
    "login_otp_v1",
    "signup_verification",
    "password_reset_code",
    "transaction_pin_code",
    "account_recovery_code",
    "two_step_login_code",
  ]);
});

test("template route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const templateIndex = readRequiredFile("src/app/templates/page.tsx");
  const templateSection = readRequiredFile("src/app/templates/[section]/page.tsx");
  const legacyTemplateIndex = readRequiredFile("src/app/template/page.tsx");
  const legacyTemplateSection = readRequiredFile("src/app/template/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "template",
    "/templates",
    "/template",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(templateIndex, [
    "DocumentationPage",
    "template-marketing",
    "template",
  ]);

  assertContainsAll(templateSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assert.match(legacyTemplateIndex, /permanentRedirect\(['"]\/templates['"]\)/);
  assert.match(legacyTemplateSection, /permanentRedirect\(`\/templates\/\$\{section\}`\)/);
});
