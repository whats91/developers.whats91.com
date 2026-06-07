import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const docData = fs.readFileSync(path.join(rootDir, "src/lib/doc-data.ts"), "utf8");

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

test("getting started navigation exposes separate auth, API key, and rate limit pages", () => {
  const gettingStarted = docData.slice(
    docData.indexOf("id: 'getting-started'"),
    docData.indexOf("id: 'messaging'"),
  );

  assert.match(gettingStarted, /id: 'overview'/);
  assert.match(gettingStarted, /id: 'quick-start'/);
  assert.match(gettingStarted, /id: 'authentication'/);
  assert.match(gettingStarted, /title: 'Authentication'/);
  assert.match(gettingStarted, /id: 'api-keys'/);
  assert.match(gettingStarted, /title: 'API Keys'/);
  assert.match(gettingStarted, /id: 'rate-limits'/);
  assert.match(gettingStarted, /title: 'Rate Limits'/);
  assert.doesNotMatch(gettingStarted, /Authentication, API Keys & Rate Limits/);
});

test("overview documents Whats91 public v2 canonical API surface", () => {
  const overview = sourceForSection("overview");

  assert.match(overview, /https:\/\/graph\.whats91\.com\/api\/v2/);
  assert.match(overview, /developer layer over Meta WhatsApp Cloud API/);
  [
    "/api/v2/send",
    "/api/v2/chat",
    "/api/v2/messages",
    "/api/v2/{phoneNumberId}/messages",
    "/api/v2/templates",
    "/api/v2/templates/{identifier}",
  ].forEach((endpoint) => {
    assert.match(overview, new RegExp(endpoint.replaceAll("/", "\\/").replace(/[{}]/g, "\\$&")));
  });
  assert.match(overview, /canonical base path/);
});

test("quick start follows the dashboard-to-first-v2-chat-message flow", () => {
  const quickStart = sourceForSection("quick-start");

  [
    "WhatsApp Setup",
    "Developer -> API Tokens",
    "Authorization: Bearer <token>",
    "POST /api/v2/chat",
    "POST /api/v2/send",
    "Settings -> Webhooks",
    "Developer -> Logger",
    "https://graph.whats91.com/api/v2/chat",
    "w91_live_xxx",
    "messageId",
    "waiting_reconnect",
  ].forEach((text) => assert.match(quickStart, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("authentication page covers bearer tokens and sender selection", () => {
  const auth = sourceForSection("authentication");

  [
    "Authorization: Bearer w91_live_",
    "authToken",
    "auth_token",
    "senderId",
    "POST /api/v2/{phoneNumberId}/messages",
  ].forEach((text) => assert.match(auth, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

  assert.doesNotMatch(auth, /Developer -> API Tokens/);
  assert.doesNotMatch(auth, /80 messages per second/);
});

test("api keys page covers managed token generation and storage behavior", () => {
  const apiKeys = sourceForSection("api-keys");

  [
    "Developer -> API Tokens",
    "global",
    "selected_number",
    "specific_number",
    "SHA-256 hash",
    "w91_live_",
    "full token is shown once only",
  ].forEach((text) => assert.match(apiKeys, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

  assert.doesNotMatch(apiKeys, /80 messages per second/);
});

test("rate limits page uses cards for Meta-backed throughput and guardrails", () => {
  const rateLimits = sourceForSection("rate-limits");

  [
    "type: 'cards'",
    "Cloud API Throughput",
    "Coexistence Numbers",
    "Throughput Errors",
    "Pair Rate Limit",
    "Pair Burst",
    "Messaging Limit Tiers",
    "Webhook Capacity",
    "80 messages per second",
    "1,000 mps",
    "20 mps",
    "130429",
    "131057",
    "131056",
    "one message every six seconds",
    "250",
    "2,000",
    "10,000",
    "100,000",
    "webhook servers handle 3x outgoing message traffic",
    "billing, blacklist, or sender reconnect state",
  ].forEach((text) => assert.match(rateLimits, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("content renderer supports the docs card grid block", () => {
  const renderer = fs.readFileSync(path.join(rootDir, "src/components/docs/content-renderer.tsx"), "utf8");

  assert.match(renderer, /function CardGrid/);
  assert.match(renderer, /case 'cards'/);
  assert.match(renderer, /data-doc-card-grid/);
  assert.match(renderer, /data-doc-card/);
});

test("content renderer centers the documentation column with balanced horizontal space", () => {
  const renderer = fs.readFileSync(path.join(rootDir, "src/components/docs/content-renderer.tsx"), "utf8");

  assert.match(renderer, /id="doc-content"/);
  assert.match(renderer, /mx-auto/);
  assert.match(renderer, /max-w-\[960px\]/);
  assert.doesNotMatch(renderer, /max-w-\[720px\]/);
});
