import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sidebar = fs.readFileSync(path.join(rootDir, "src/components/docs/sidebar.tsx"), "utf8");
const documentationPage = fs.readFileSync(
  path.join(rootDir, "src/components/docs/documentation-page.tsx"),
  "utf8"
);

test("sidebar keeps only one expandable main menu open", () => {
  assert.match(sidebar, /useState<string \| null>/);
  assert.match(
    sidebar,
    /setExpandedCategory\(\(currentCategoryId\) =>\s*currentCategoryId === categoryId \? null : categoryId\s*\)/s
  );
  assert.match(sidebar, /const isExpanded = singlePageCategory \? false : expandedCategory === category\.id/);
  assert.match(sidebar, /aria-expanded=\{singlePageCategory \? undefined : isExpanded\}/);
  assert.match(sidebar, /\{!singlePageCategory && isExpanded && \(/);
  assert.doesNotMatch(sidebar, /Record<string,\s*boolean>/);
  assert.doesNotMatch(sidebar, /setCollapsed/);
});

test("sidebar expands and scrolls the active route into view", () => {
  assert.match(sidebar, /useRef/);
  assert.match(sidebar, /activeMenuItemRef/);
  assert.match(sidebar, /isSinglePageRouteCategory\(displayedActiveCategory\) \? null : displayedActiveCategory/);
  assert.match(documentationPage, /key=\{`desktop-sidebar-\$\{renderedActiveCategory\}`\}/);
  assert.match(documentationPage, /key=\{`mobile-sidebar-\$\{renderedActiveCategory\}`\}/);
  assert.match(
    sidebar,
    /scrollIntoView\(\{\s*behavior: 'smooth',\s*block: 'center',\s*inline: 'nearest',\s*\}\)/s
  );
  assert.match(sidebar, /displayedActiveSection/);
  assert.match(sidebar, /expandedCategory/);
  assert.doesNotMatch(sidebar, /setExpandedCategory\(displayedActiveCategory\)/);
});
