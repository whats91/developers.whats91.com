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

test("doc route registry exposes previous and next links from active menu order", () => {
  const docRoutes = readRequiredFile("src/lib/doc-routes.ts");

  assertContainsAll(docRoutes, [
    "export function getAdjacentDocRoutes",
    "item.sections.some",
    "category.sections.map",
    "previous",
    "next",
    "getPathForSectionId",
  ]);
});

test("content renderer displays bottom previous and next documentation buttons", () => {
  const renderer = readRequiredFile("src/components/docs/content-renderer.tsx");

  assertContainsAll(renderer, [
    "PageNavigation",
    "getAdjacentDocRoutes(section.id)",
    "Previous:",
    "Next:",
    "pageNavigationLabelOverrides",
    "messaging-overview",
    "messaging-template-send",
    "Overview",
    "Send Template",
    "<PageNavigation section={section} />",
  ]);
});
