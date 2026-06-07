import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");
const sidebar = fs.readFileSync(path.join(rootDir, "src/components/docs/sidebar.tsx"), "utf8");

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

const reportSections = [
  "{ id: 'reports-all', title: 'All Reports', slug: 'all-reports' }",
  "{ id: 'reports-message-status', title: 'Message Status', slug: 'message-status' }",
  "{ id: 'reports-mobile-history', title: 'Mobile History', slug: 'mobile-history' }",
  "{ id: 'reports-campaigns', title: 'Campaigns', slug: 'campaigns' }",
  "{ id: 'reports-campaign-detail', title: 'Campaign Detail', slug: 'campaign-detail' }",
  "{ id: 'reports-campaign-messages', title: 'Campaign Messages', slug: 'campaign-messages' }",
  "{ id: 'reports-campaign-timeline', title: 'Campaign Timeline', slug: 'campaign-timeline' }",
  "{ id: 'reports-campaign-responses', title: 'Campaign Responses', slug: 'campaign-responses' }",
  "{ id: 'reports-delivery-analytics', title: 'Delivery Analytics', slug: 'delivery-analytics' }",
  "{ id: 'reports-failure-analytics', title: 'Failure Analytics', slug: 'failure-analytics' }",
  "{ id: 'reports-template-analytics', title: 'Template Analytics', slug: 'template-analytics' }",
  "{ id: 'reports-date-analytics', title: 'Date Analytics', slug: 'date-analytics' }",
];

test("reports is a top-level menu with every public reporting endpoint", () => {
  const reportsCategory = sourceForCategory("reports");

  assert.match(reportsCategory, /label: 'Reports'/);
  assert.match(reportsCategory, /icon: 'BarChart3'/);
  assertContainsAll(reportsCategory, reportSections);
  assert.match(sidebar, /BarChart3/);
  assert.match(sidebar, /categoryIconMap/);
});

test("all reports page documents pagination, filters, and response shape", () => {
  const allReports = sourceForSection("reports-all");

  assertContainsAll(allReports, [
    "category: 'reports'",
    "GET /api/v2/reports/messages",
    "Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx",
    "authToken",
    "senderId",
    "page",
    "limit",
    "dateFrom",
    "dateTo",
    "storage",
    "status",
    "receiver",
    "campaignUid",
    "templateName",
    "messageType",
    "sourceType",
    "reports",
    "pagination",
    "latestStatus",
    "occurredAt",
  ]);
});

test("message status and mobile history pages document their required query fields", () => {
  const status = sourceForSection("reports-message-status");
  const history = sourceForSection("reports-mobile-history");

  assertContainsAll(status, [
    "category: 'reports'",
    "GET /api/v2/reports/messages/status",
    "messageId",
    "Meta message ID",
    "local report UID",
    "events",
    "latestStatus",
    "MESSAGE_NOT_FOUND",
  ]);

  assertContainsAll(history, [
    "category: 'reports'",
    "GET /api/v2/reports/messages/history",
    "mobileNumber",
    "recipient",
    "same pagination and filters",
    "senderId",
    "status",
    "storage",
  ]);
});

test("campaign report pages document list, detail, messages, timeline, and responses", () => {
  assertContainsAll(sourceForSection("reports-campaigns"), [
    "GET /api/v2/reports/campaigns",
    "totals",
    "campaigns",
    "recipients",
    "sent",
    "delivered",
    "read",
    "failed",
    "pending",
  ]);

  assertContainsAll(sourceForSection("reports-campaign-detail"), [
    "GET /api/v2/reports/campaigns/{campaignUid}",
    "campaignUid",
    "summary",
    "totals",
    "status breakdown",
    "step breakdown",
    "CAMPAIGN_NOT_FOUND",
  ]);

  assertContainsAll(sourceForSection("reports-campaign-messages"), [
    "GET /api/v2/reports/campaigns/{campaignUid}/messages",
    "recipient/message rows",
    "Meta message ID",
    "template",
    "error fields",
    "pagination",
  ]);

  assertContainsAll(sourceForSection("reports-campaign-timeline"), [
    "GET /api/v2/reports/campaigns/{campaignUid}/timeline",
    "status",
    "webhook status",
    "execution",
    "interaction",
    "unsubscribe",
  ]);

  assertContainsAll(sourceForSection("reports-campaign-responses"), [
    "GET /api/v2/reports/campaigns/responses",
    "campaignUid",
    "intent",
    "replyTitle",
    "replyType",
    "search",
    "dateFrom",
    "dateTo",
  ]);
});

test("analytics report pages document each analytics endpoint", () => {
  assertContainsAll(sourceForSection("reports-delivery-analytics"), [
    "GET /api/v2/reports/analytics/delivery",
    "Delivery summary by status/source",
    "status",
    "sourceType",
  ]);

  assertContainsAll(sourceForSection("reports-failure-analytics"), [
    "GET /api/v2/reports/analytics/failures",
    "Failed message report grouped by error and template/source",
    "error",
    "templateName",
  ]);

  assertContainsAll(sourceForSection("reports-template-analytics"), [
    "GET /api/v2/reports/analytics/templates",
    "Template-wise delivery counts",
    "templateName",
    "delivered",
    "read",
    "failed",
  ]);

  assertContainsAll(sourceForSection("reports-date-analytics"), [
    "GET /api/v2/reports/analytics/dates",
    "Date-wise message counts and status counts",
    "date",
    "statusCounts",
  ]);
});

test("reports docs use the canonical api v2 reports route only", () => {
  assert.doesNotMatch(docData, /endpoint: '\/v2\/reports/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/reports/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/reports/);
});
