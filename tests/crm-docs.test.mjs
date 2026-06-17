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

test("crm is a top-level menu with lead generation and complaint submenus", () => {
  const crmCategory = sourceForCategory("crm");

  assert.match(crmCategory, /label: 'CRM'/);
  assert.match(crmCategory, /slug: 'crm'/);
  assert.match(crmCategory, /icon: 'UsersRound'/);
  assertContainsAll(crmCategory, [
    "{ id: 'crm-lead-generation', title: 'Lead Generation', slug: 'lead-generation' }",
    "{ id: 'crm-complaint-creation', title: 'Complaint Creation', slug: 'complaint-creation' }",
  ]);

  assert.match(sidebar, /UsersRound/);
  assert.match(sidebar, /getPathForSectionId/);
});

test("lead generation page documents the crm lead creation api", () => {
  const leadGeneration = sourceForSection("crm-lead-generation");

  assertContainsAll(leadGeneration, [
    "category: 'crm'",
    "CRM Lead Generation",
    "POST /api/v2/crm/leads",
    "POST /api/v2/crm/companies/{companyUid}/leads",
    "Authorization: Bearer w91_public_token_here",
    "tokenless company-URL",
    "companyUid",
    "lead.fields",
    "Request Fields",
    "Automatic Customer Matching",
    "Flow Builder Custom API Setup",
    "Success Response",
    "Error Responses",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "CUSTOMER_TOKEN_REQUIRED",
    "VALIDATION_FAILED",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "FORBIDDEN",
    "NOT_FOUND",
    "Internal database ids, Whats91 user ids, and private token details are never returned",
  ]);
});

test("complaint creation page documents the crm complaint creation api", () => {
  const complaintCreation = sourceForSection("crm-complaint-creation");

  assertContainsAll(complaintCreation, [
    "category: 'crm'",
    "CRM Complaint Creation",
    "POST /api/v2/crm/complaints",
    "POST /api/v2/crm/companies/{companyUid}/complaints",
    "Authorization: Bearer w91_public_token_here",
    "tokenless company-URL",
    "companyUid",
    "complaint.fields",
    "ComplaintTitle",
    "Description",
    "Supported Fields",
    "Customer Matching",
    "Success Response",
    "Error Responses",
    "X-Whats91-Request-Id",
    "X-Whats91-Crm-Complaint-Uid",
    "TOKEN_SCOPE_NOT_ALLOWED",
    "CUSTOMER_TOKEN_REQUIRED",
    "VALIDATION_FAILED",
    "MISSING_AUTH_TOKEN",
    "INVALID_AUTH_TOKEN",
    "FORBIDDEN",
    "NOT_FOUND",
    "Internal database ids, Whats91 user ids, tokens, encrypted values, and raw private payloads are never returned",
  ]);
});

test("crm docs document canonical api v2 routes only", () => {
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/crm\/leads/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/crm\/companies\/crmco_abc\/leads/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/crm\/complaints/);
  assert.match(docData, /https:\/\/graph\.whats91\.com\/api\/v2\/crm\/companies\/crmco_abc\/complaints/);
  assert.doesNotMatch(docData, /endpoint: '\/v2\/crm\/leads/);
  assert.doesNotMatch(docData, /endpoint: '\/v2\/crm\/complaints/);
  assert.doesNotMatch(docData, /endpoint: '\/v2\/crm\/companies/);
  assert.doesNotMatch(docData, /https:\/\/api\.whats91\.com\/v2\/crm/);
});

test("crm route files expose dedicated page paths", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");
  const crmIndex = readRequiredFile("src/app/crm/page.tsx");
  const crmSection = readRequiredFile("src/app/crm/[section]/page.tsx");

  assertContainsAll(docRoutes, [
    "crm",
    "/crm",
    "getPathForSectionId",
    "resolveRoutedDoc",
  ]);

  assertContainsAll(crmIndex, [
    "DocumentationPage",
    "crm-lead-generation",
    "crm",
    "buildDocMetadata",
    "DocJsonLd",
  ]);

  assertContainsAll(crmSection, [
    "resolveRoutedDoc",
    "generateStaticParams",
    "notFound",
    "DocumentationPage",
    "buildDocMetadata",
    "DocJsonLd",
  ]);
});
