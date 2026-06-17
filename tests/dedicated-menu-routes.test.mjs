import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");

function readRequiredFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  assert.equal(fs.existsSync(absolutePath), true, `Expected ${relativePath} to exist`);
  return fs.readFileSync(absolutePath, "utf8");
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

const routedMenus = [
  ["messaging", "messaging"],
  ["messaging-meta", "messaging/meta-compatibility"],
  ["template", "templates"],
  ["webhook", "webhooks"],
  ["reports", "reports"],
  ["message-billing", "message-billing"],
  ["chatbot", "chatbots"],
  ["contact-book", "contact-books"],
  ["blacklist", "blacklist"],
  ["conversations", "conversations"],
  ["crm", "crm"],
];

test("every non-getting-started menu is route backed instead of homepage-only", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");

  for (const [categorySlug, appPath] of routedMenus) {
    assertContainsAll(docRoutes, [
      `${categorySlug}`,
    ]);

    assert.match(readRequiredFile(`src/app/${appPath}/page.tsx`), /DocumentationPage/);
    assertContainsAll(readRequiredFile(`src/app/${appPath}/[section]/page.tsx`), [
      "generateStaticParams",
      "resolveRoutedDoc",
      "DocumentationPage",
      "notFound",
    ]);
  }

  assert.doesNotMatch(docRoutes, /getting-started: \{ basePath: '\/getting-started'/);
});

test("legacy singular API menu paths redirect to canonical routes", () => {
  [
    "src/app/template/page.tsx",
    "src/app/template/[section]/page.tsx",
    "src/app/webhook/page.tsx",
    "src/app/webhook/[section]/page.tsx",
    "src/app/chatbot/page.tsx",
    "src/app/chatbot/[section]/page.tsx",
    "src/app/contact-book/page.tsx",
    "src/app/contact-book/[section]/page.tsx",
    "src/app/messaging-meta/page.tsx",
    "src/app/messaging-meta/[section]/page.tsx",
  ].forEach((relativePath) => {
    assert.match(readRequiredFile(relativePath), /permanentRedirect\(/);
  });
});

test("changelog is a single routed main menu without an updates submenu", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const sidebar = readRequiredFile("src/components/docs/sidebar.tsx");
  const topNavbar = readRequiredFile("src/components/docs/top-navbar.tsx");
  const changelogPage = readRequiredFile("src/app/changelog/page.tsx");
  const changelogCategory = sourceForCategory("changelog");

  assertContainsAll(docRoutes, [
    "changelog",
    "/changelog",
    "singlePage",
    "isSinglePageRouteCategory",
  ]);
  assertContainsAll(sidebar, [
    "isSinglePageRouteCategory",
    "getPathForCategoryId",
    "singlePageCategory",
  ]);
  assertContainsAll(topNavbar, [
    "Changelog",
    "changelog",
  ]);
  assertContainsAll(changelogPage, [
    "DocumentationPage",
    "initialSectionId=\"changelog\"",
    "initialCategoryId=\"changelog\"",
  ]);

  assert.doesNotMatch(changelogCategory, /All Updates|all-updates|Updates/);
  assert.equal(fs.existsSync(path.join(rootDir, "src/app/changelog/[section]/page.tsx")), false);
});
