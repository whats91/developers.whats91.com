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

test("documentation data exposes summaries, FAQs, SEO overrides, and explicit internal links", () => {
  const docData = readRequiredFile("src/lib/doc-data.ts");
  const majorSectionIds = [
    "overview",
    "quick-start",
    "authentication",
    "api-keys",
    "rate-limits",
    "messaging-overview",
    "messaging-meta-overview",
    "template-marketing",
    "webhook-create",
    "reports-all",
    "billing-user-history",
    "chatbot-list",
    "contact-book-list",
    "blacklist-list",
    "conversations-list",
  ];

  assertContainsAll(docData, [
    "export interface DocFaq",
    "summary?: string",
    "prerequisites?: string[]",
    "faqs?: DocFaq[]",
    "getSectionSummary",
    "getSectionPrerequisites",
    "getSectionFaqs",
    "getSeoTitleForSection",
    "getSeoDescriptionForSection",
    "getExplicitRelatedSectionIds",
    "How do I generate API keys?",
    "How do I send a WhatsApp message?",
    "How long does Meta approval take?",
  ]);

  for (const sectionId of majorSectionIds) {
    assert.match(
      docData,
      new RegExp(`['"]${sectionId}['"]:\\s*\\{[\\s\\S]*?summary:[\\s\\S]*?seoTitle:[\\s\\S]*?seoDescription:[\\s\\S]*?faqs:`),
      `${sectionId} should have summary, SEO metadata, and FAQs`,
    );
  }
});

test("documentation renderer shows summary and FAQ sections with dynamic related labels", () => {
  const renderer = readRequiredFile("src/components/docs/content-renderer.tsx");

  assertContainsAll(renderer, [
    "SummaryBlock",
    "FaqSection",
    "getSectionSummary",
    "getSectionPrerequisites",
    "getSectionFaqs",
    "Related Documentation",
    "Related APIs",
  ]);
});

test("SEO metadata emits branded social images and FAQ structured data", () => {
  const seo = readRequiredFile("src/lib/seo.ts");
  const layout = readRequiredFile("src/app/layout.tsx");

  assertContainsAll(seo, [
    "getSeoTitleForSection",
    "getSeoDescriptionForSection",
    "getSectionFaqs",
    "FAQPage",
    "summary_large_image",
    "/opengraph-image",
    "/twitter-image",
  ]);

  assertContainsAll(layout, [
    "/opengraph-image",
    "/twitter-image",
    "summary_large_image",
  ]);
});

test("branded OpenGraph and Twitter image routes exist", () => {
  const openGraphImage = readRequiredFile("src/app/opengraph-image/route.ts");
  const twitterImage = readRequiredFile("src/app/twitter-image/route.ts");

  assertContainsAll(openGraphImage, [
    "image/svg+xml",
    "Whats91 Developer Documentation",
    "1200",
    "630",
  ]);

  assertContainsAll(twitterImage, [
    "image/svg+xml",
    "Whats91 Developer Documentation",
    "1200",
    "630",
  ]);
});

test("robots rules include major search and AI crawler user agents", () => {
  const robots = readRequiredFile("src/app/robots.ts");

  assertContainsAll(robots, [
    "Googlebot",
    "Google-Extended",
    "Bingbot",
    "BingPreview",
    "DuckDuckBot",
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "userAgent: '*'",
    "allow: '/'",
  ]);
});

test("legacy and duplicate canonical routes use permanent redirects", () => {
  const redirectFiles = [
    "src/app/page.tsx",
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
    "src/app/messaging/[section]/page.tsx",
    "src/app/messaging/meta-compatibility/[section]/page.tsx",
  ];

  for (const relativePath of redirectFiles) {
    const source = readRequiredFile(relativePath);
    assert.match(source, /permanentRedirect\(/, `${relativePath} should use permanentRedirect`);
  }
});

test("non-documentation api placeholder is not crawlable", () => {
  const apiRoute = readRequiredFile("src/app/api/route.ts");

  assertContainsAll(apiRoute, [
    "status: 404",
    "X-Robots-Tag",
    "noindex, nofollow",
  ]);
  assert.doesNotMatch(apiRoute, /Hello, world!/);
});

test("production build does not ignore TypeScript errors", () => {
  const nextConfig = readRequiredFile("next.config.ts");

  assert.doesNotMatch(nextConfig, /ignoreBuildErrors:\s*true/);
});

test("SEO and AI crawlability audit report is committed as markdown", () => {
  const audit = readRequiredFile("docs/audits/seo-ai-crawlability-audit.md");

  assertContainsAll(audit, [
    "Complete SEO Audit Report",
    "Complete AI Crawler Audit Report",
    "Before vs After",
    "Remaining Recommendations",
    "Google SEO Score",
    "AI Crawlability Score",
    "Documentation Discoverability Score",
  ]);
});
