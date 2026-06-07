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

test("next not-found route renders a branded recovery page", () => {
  const notFoundRoute = readRequiredFile("src/app/not-found.tsx");
  const notFoundPage = readRequiredFile("src/components/docs/not-found-page.tsx");

  assertContainsAll(notFoundRoute, [
    "metadata",
    "Page Not Found | Whats91 Developers",
    "NotFoundPage",
    "export default function NotFound",
  ]);

  assertContainsAll(notFoundPage, [
    "'use client'",
    "brandAssets.wordmark",
    "404",
    "Page not found",
    "router.back()",
    "Go back",
    "href=\"/overview\"",
    "Go home",
  ]);
});
