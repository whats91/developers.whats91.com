import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function readRequiredFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  assert.equal(fs.existsSync(absolutePath), true, `Expected ${relativePath} to exist`);
  return fs.readFileSync(absolutePath, "utf8");
}

function assertContainsAll(source, values) {
  for (const value of values) {
    assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
}

test("canonical documentation routes and legacy redirects are declared from one registry", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");

  assertContainsAll(docRoutes, [
    "canonicalPath",
    "legacyPaths",
    "getIndexableDocRoutes",
    "getLegacyRedirects",
    "/overview",
    "/quickstart",
    "/authentication",
    "/api-keys",
    "/rate-limits",
    "/templates",
    "/webhooks",
    "/chatbots",
    "/contact-books",
    "/crm",
    "/messaging/meta-compatibility",
    "/template",
    "/webhook",
    "/chatbot",
    "/contact-book",
    "/messaging-meta",
  ]);
});

test("getting started pages are independently routed and root redirects to overview", () => {
  assert.match(readRequiredFile("src/app/page.tsx"), /permanentRedirect\(['"]\/overview['"]\)/);

  [
    ["overview", "overview"],
    ["quickstart", "quick-start"],
    ["authentication", "authentication"],
    ["api-keys", "api-keys"],
    ["rate-limits", "rate-limits"],
  ].forEach(([routePath, sectionId]) => {
    const route = readRequiredFile(`src/app/${routePath}/page.tsx`);
    assertContainsAll(route, [
      "DocumentationPage",
      `initialSectionId="${sectionId}"`,
      'initialCategoryId="getting-started"',
      "buildDocMetadata",
      "DocJsonLd",
    ]);
  });
});

test("renamed API families use canonical plural routes and old routes redirect", () => {
  const canonicalRoutes = [
    ["templates", "template"],
    ["webhooks", "webhook"],
    ["chatbots", "chatbot"],
    ["contact-books", "contact-book"],
  ];

  for (const [routePath, categoryId] of canonicalRoutes) {
    assertContainsAll(readRequiredFile(`src/app/${routePath}/page.tsx`), [
      "buildDocMetadata",
      "DocJsonLd",
      "DocumentationPage",
      `initialCategoryId="${categoryId}"`,
    ]);
    assertContainsAll(readRequiredFile(`src/app/${routePath}/[section]/page.tsx`), [
      "generateStaticParams",
      "buildDocMetadata",
      "DocJsonLd",
      "resolveRoutedDoc",
      "DocumentationPage",
    ]);
  }

  assertContainsAll(readRequiredFile("src/app/messaging/meta-compatibility/page.tsx"), [
    "buildDocMetadata",
    "DocJsonLd",
    "DocumentationPage",
    'initialCategoryId="messaging-meta"',
  ]);
  assertContainsAll(readRequiredFile("src/app/messaging/meta-compatibility/[section]/page.tsx"), [
    "generateStaticParams",
    "buildDocMetadata",
    "DocJsonLd",
    "resolveRoutedDoc",
  ]);

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
    assert.match(readRequiredFile(relativePath), /permanentRedirect\(/, `${relativePath} should redirect permanently`);
  });
});

test("technical SEO and AI crawlability routes exist", () => {
  const seo = readRequiredFile("src/lib/seo.ts");
  const sitemap = readRequiredFile("src/app/sitemap.ts");
  const robots = readRequiredFile("src/app/robots.ts");
  const llms = readRequiredFile("src/app/llms.txt/route.ts");
  const searchIndex = readRequiredFile("src/app/search-index.json/route.ts");

  assertContainsAll(seo, [
    "SITE_URL",
    "buildDocMetadata",
    "buildGlobalSchemas",
    "buildDocPageSchemas",
    "BreadcrumbList",
    "SoftwareApplication",
    "APIReference",
  ]);

  assertContainsAll(sitemap, [
    "getIndexableDocRoutes",
    "lastModified",
    "changeFrequency",
    "priority",
  ]);

  assertContainsAll(robots, [
    "Googlebot",
    "Bingbot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "/login",
    "/dashboard",
    "/admin",
    "/api",
    "https://developers.whats91.com/sitemap.xml",
  ]);

  assertContainsAll(llms, [
    "text/plain",
    "Whats91 Developer Documentation",
    "/overview",
    "/quickstart",
    "/authentication",
    "/messaging",
    "/templates",
    "/webhooks",
    "/chatbots",
    "/reports",
    "/message-billing",
    "/conversations",
    "/crm",
    "/changelog",
  ]);

  assertContainsAll(searchIndex, [
    "getSearchIndexEntries",
    "NextResponse.json",
    "canonicalPath",
  ]);
});

test("documentation UI emits JSON-LD, related APIs, SDK examples, and lazy search index", () => {
  const jsonLd = readRequiredFile("src/components/docs/json-ld.tsx");
  const renderer = readRequiredFile("src/components/docs/content-renderer.tsx");
  const searchDialog = readRequiredFile("src/components/docs/search-dialog.tsx");
  const docData = readRequiredFile("src/lib/doc-data.ts");

  assertContainsAll(jsonLd, [
    'type="application/ld+json"',
    "buildGlobalSchemas",
    "buildDocPageSchemas",
  ]);

  assertContainsAll(renderer, [
    "Related APIs",
    "SDK Examples",
    "relatedSectionIds",
    "getSdkExamplesForSection",
    "getPathForSectionId",
  ]);

  assertContainsAll(searchDialog, [
    "fetch('/search-index.json')",
    "canonicalPath",
  ]);
  assert.doesNotMatch(searchDialog, /import \{ searchDocs,/);

  assertContainsAll(docData, [
    "seoTitle",
    "seoDescription",
    "relatedSectionIds",
  ]);
});
