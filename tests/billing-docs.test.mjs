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

const billingSections = [
  "{ id: 'billing-user-history', title: 'User History', slug: 'user-history' }",
  "{ id: 'billing-number-history', title: 'Number History', slug: 'number-history' }",
  "{ id: 'billing-template-type', title: 'Template Type', slug: 'template-type' }",
  "{ id: 'billing-delivered', title: 'Delivered', slug: 'delivered' }",
  "{ id: 'billing-payable', title: 'Payable', slug: 'payable' }",
  "{ id: 'billing-free', title: 'Free', slug: 'free' }",
  "{ id: 'billing-summary', title: 'Summary', slug: 'summary' }",
  "{ id: 'billing-wallet', title: 'Wallet', slug: 'wallet' }",
  "{ id: 'billing-wallet-history', title: 'Wallet History', slug: 'wallet-history' }",
];

test("message billing is a top-level menu with every billing endpoint submenu", () => {
  const billingCategory = sourceForCategory("message-billing");

  assert.match(billingCategory, /label: 'Message Billing'/);
  assert.match(billingCategory, /icon: 'CreditCard'/);
  assertContainsAll(billingCategory, billingSections);
  assert.match(sidebar, /CreditCard/);
  assert.match(sidebar, /categoryIconMap/);
});

test("user billing history page documents filters and billing record response shape", () => {
  const userHistory = sourceForSection("billing-user-history");

  assertContainsAll(userHistory, [
    "category: 'message-billing'",
    "GET /api/v2/billing/messages",
    "Authorization: Bearer w91_live_xxxxxxxxxxxxxxxxx",
    "authToken",
    "senderId",
    "phoneNumberId",
    "page",
    "limit",
    "dateFrom",
    "dateTo",
    "status",
    "templateType",
    "billable",
    "pricingType",
    "messageId",
    "recipient",
    "conversationId",
    "sortBy",
    "sortOrder",
    "billingRecords",
    "billingUid",
    "billingClass",
    "pricingCategory",
    "rate",
    "pagination",
  ]);
});

test("number and template billing history pages document scoped endpoints", () => {
  const numberHistory = sourceForSection("billing-number-history");
  const templateType = sourceForSection("billing-template-type");

  assertContainsAll(numberHistory, [
    "category: 'message-billing'",
    "GET /api/v2/billing/messages?senderId=919999999999",
    "GET /api/v2/billing/messages/by-number/{phoneNumberId}",
    "senderId",
    "phoneNumberId",
    "Number-scoped tokens cannot use another number",
    "scope",
    "sender",
  ]);

  assertContainsAll(templateType, [
    "category: 'message-billing'",
    "GET /api/v2/billing/messages/by-template-type/{templateType}",
    "templateType",
    "marketing",
    "utility",
    "authentication",
    "service",
    "Meta pricing category",
  ]);
});

test("delivered, payable, and free classification pages document convenience endpoints", () => {
  assertContainsAll(sourceForSection("billing-delivered"), [
    "GET /api/v2/billing/messages/delivered",
    "status=delivered",
    "delivered records",
    "billingClass",
  ]);

  assertContainsAll(sourceForSection("billing-payable"), [
    "GET /api/v2/billing/messages/payable",
    "billable=payable",
    "payable records",
    "payableAmount",
  ]);

  assertContainsAll(sourceForSection("billing-free"), [
    "GET /api/v2/billing/messages/free",
    "billable=free",
    "free records",
    "billingClass",
  ]);
});

test("summary, wallet, and wallet history pages document billing account endpoints", () => {
  assertContainsAll(sourceForSection("billing-summary"), [
    "GET /api/v2/billing/summary",
    "totalRecords",
    "deliveredRecords",
    "payableRecords",
    "freeRecords",
    "payableAmount",
    "categoryBreakdown",
  ]);

  assertContainsAll(sourceForSection("billing-wallet"), [
    "GET /api/v2/billing/wallet",
    "wallet",
    "balance",
    "currency",
  ]);

  assertContainsAll(sourceForSection("billing-wallet-history"), [
    "GET /api/v2/billing/wallet/history",
    "transactionType",
    "credit",
    "debit",
    "transactions",
    "pagination",
  ]);
});

test("message billing docs use the canonical api v2 billing route only", () => {
  assert.doesNotMatch(docData, /endpoint: '\/v2\/billing/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/billing/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/billing/);
});
