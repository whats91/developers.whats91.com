import assert from "node:assert/strict";
import test from "node:test";
import { rankSearchIndexEntries } from "../src/lib/search-ranking.mjs";

const entries = [
  {
    sectionId: "webhook-samples",
    sectionTitle: "Samples",
    category: "webhook",
    categoryLabel: "Webhook",
    canonicalPath: "/webhooks/samples",
    description: "Webhook samples for delivery events.",
    content: "Use these samples when a chatbot message status is delivered.",
  },
  {
    sectionId: "reports-delivery",
    sectionTitle: "Delivery Analytics",
    category: "reports",
    categoryLabel: "Reports",
    canonicalPath: "/reports/delivery-analytics",
    description: "Delivery reports for message traffic.",
    content: "Analyze chatbot delivery traffic by sender.",
  },
  {
    sectionId: "chatbot-list",
    sectionTitle: "List Chatbots",
    category: "chatbot",
    categoryLabel: "Chatbot",
    canonicalPath: "/chatbots/list",
    description: "List chatbot rules.",
    content: "Retrieve rules for a sender.",
  },
  {
    sectionId: "chatbot-get",
    sectionTitle: "Get Chatbot",
    category: "chatbot",
    categoryLabel: "Chatbot",
    canonicalPath: "/chatbots/get",
    description: "Get one chatbot by UID.",
    content: "Retrieve a single automation rule.",
  },
];

test("search ranking puts API title matches before content matches", () => {
  const results = rankSearchIndexEntries(entries, "chatbot");

  assert.deepEqual(
    results.slice(0, 2).map((result) => result.sectionId),
    ["chatbot-get", "chatbot-list"],
  );
  assert.equal(results[0].matchType, "title");
  assert.equal(results[1].matchType, "title");
  assert.equal(results.at(-1)?.matchType, "content");
});

test("search ranking prefers exact singular title wording over plural title wording", () => {
  const results = rankSearchIndexEntries(entries, "chatbot");

  assert.equal(results[0].sectionTitle, "Get Chatbot");
  assert.equal(results[1].sectionTitle, "List Chatbots");
});
