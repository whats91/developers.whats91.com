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

const contactBookSections = [
  "{ id: 'contact-book-list', title: 'List Books', slug: 'list' }",
  "{ id: 'contact-book-get', title: 'Get Book', slug: 'get' }",
  "{ id: 'contact-book-contacts', title: 'Get Contacts', slug: 'contacts' }",
  "{ id: 'contact-book-create', title: 'Create Book', slug: 'create' }",
  "{ id: 'contact-book-update', title: 'Update Book', slug: 'update' }",
  "{ id: 'contact-book-upload', title: 'Upload Contacts', slug: 'upload' }",
];

test("contact book is a top-level menu with seo-friendly endpoint submenus", () => {
  const contactBookCategory = sourceForCategory("contact-book");

  assert.match(contactBookCategory, /label: 'Contact Book'/);
  assert.match(contactBookCategory, /slug: 'contact-book'/);
  assert.match(contactBookCategory, /icon: 'BookUser'/);
  assertContainsAll(contactBookCategory, contactBookSections);
  assert.match(sidebar, /BookUser/);
  assert.match(sidebar, /getPathForSectionId/);
});

test("list contact books page documents pagination and global token scope", () => {
  const list = sourceForSection("contact-book-list");

  assertContainsAll(list, [
    "category: 'contact-book'",
    "GET /api/v2/contact-books",
    "Authorization: Bearer w91_public_token_here",
    "global public API token",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "page",
    "limit",
    "status",
    "search",
    "contactBooks",
    "items is an alias of contactBooks",
    "pagination",
  ]);
});

test("get book and get contacts pages document book and contact response shapes", () => {
  const get = sourceForSection("contact-book-get");
  const contacts = sourceForSection("contact-book-contacts");

  assertContainsAll(get, [
    "category: 'contact-book'",
    "GET /api/v2/contact-books/{bookUid}",
    "bookUid",
    "contactBookUid",
    "description",
    "color",
    "contactCount",
    "CONTACT_BOOK_NOT_FOUND",
  ]);

  assertContainsAll(contacts, [
    "category: 'contact-book'",
    "GET /api/v2/contact-books/{bookUid}/contacts",
    "phoneE164",
    "displayName",
    "email",
    "companyName",
    "groups",
    "customFields",
    "Internal database IDs, user_id, and admin_id are never returned",
  ]);
});

test("create and update pages document public v2 write contracts", () => {
  const create = sourceForSection("contact-book-create");
  const update = sourceForSection("contact-book-update");

  assertContainsAll(create, [
    "POST /api/v2/contact-books",
    "Content-Type: application/json",
    "name",
    "description",
    "color",
    "ACTIVE",
    "Retail Leads",
    "Contact book created",
  ]);

  assertContainsAll(update, [
    "POST /api/v2/contact-books/{bookUid}",
    "Retail Leads Updated",
    "Only name is editable through public v2 in this phase",
    "Contact book updated",
  ]);
});

test("upload contacts page documents json-only bulk behavior and row results", () => {
  const upload = sourceForSection("contact-book-upload");

  assertContainsAll(upload, [
    "POST /api/v2/contact-books/{bookUid}/contacts/bulk",
    "JSON-only",
    "CSV/XLSX multipart upload remains dashboard-only",
    "defaultCountryCode",
    "contacts",
    "Maximum 1000 contacts per request",
    "DUPLICATE_IN_REQUEST",
    "row-level results",
    "summary",
    "created",
    "updated",
    "skipped",
    "invalid",
  ]);
});

test("contact book docs document validation errors and canonical route only", () => {
  assertContainsAll(docData, [
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "FEATURE_NOT_AVAILABLE",
    "VALIDATION_FAILED",
    "CONTACT_BOOK_NOT_FOUND",
    "UNSUPPORTED_CONTENT_TYPE",
    "https://graph.whats91.com/api/v2/contact-books",
  ]);

  assert.doesNotMatch(docData, /endpoint: '\/v2\/contact-books/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/contact-books/);
});

test("contact book route files expose dedicated page paths for each submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const contactBookIndex = readRequiredFile("src/app/contact-books/page.tsx");
  const contactBookSection = readRequiredFile("src/app/contact-books/[section]/page.tsx");
  const legacyContactBookIndex = readRequiredFile("src/app/contact-book/page.tsx");
  const legacyContactBookSection = readRequiredFile("src/app/contact-book/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "contact-book",
    "/contact-books",
    "/contact-book",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(contactBookIndex, [
    "DocumentationPage",
    "contact-book-list",
    "contact-book",
  ]);

  assertContainsAll(contactBookSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
  ]);

  assert.match(legacyContactBookIndex, /permanentRedirect\(['"]\/contact-books['"]\)/);
  assert.match(legacyContactBookSection, /permanentRedirect\(`\/contact-books\/\$\{section\}`\)/);
});
