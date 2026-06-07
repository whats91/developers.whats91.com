import assert from "node:assert/strict";
import test from "node:test";

import { highlightCode } from "../src/lib/code-highlight.mjs";

test("code highlighting preserves URLs inside quoted strings", () => {
  const html = highlightCode(
    'curl -X POST "https://graph.whats91.com/api/v2/chat" \\\n  -H "Authorization: Bearer w91_live_xxx"',
    "curl",
  );

  assert.match(html, /https:\/\/graph\.whats91\.com\/api\/v2\/chat/);
  assert.doesNotMatch(html, /https:<span/);
  assert.doesNotMatch(html, /comment[^>]*>\/\/graph/);
});

test("code highlighting still marks standalone comments", () => {
  const html = highlightCode("// keep this as a comment", "javascript");

  assert.match(html, /<span class="comment">\/\/ keep this as a comment<\/span>/);
});
