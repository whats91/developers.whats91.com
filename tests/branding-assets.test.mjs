import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(rootDir, relativePath), "utf8");
}

function assertPublicAsset(relativePath) {
  const assetPath = path.join(rootDir, "public", relativePath);
  assert.equal(fs.existsSync(assetPath), true, `${relativePath} should exist in public`);
  assert.ok(fs.statSync(assetPath).size > 0, `${relativePath} should not be empty`);
}

test("branding assets are available from the public folder", () => {
  [
    "logo.svg",
    "whats91_logo.svg",
    "favicon.svg",
    "icons/apple-touch-icon.png",
    "icons/icon-192.png",
    "icons/icon-512.png",
    "icons/maskable-512.png",
  ].forEach(assertPublicAsset);
});

test("application metadata uses the Whats91 brand assets for browser icons", () => {
  const layout = read("src/app/layout.tsx");
  const manifest = read("src/app/manifest.ts");
  const brandAssets = read("src/lib/brand-assets.ts");

  [
    "/favicon.svg",
    "/icons/apple-touch-icon.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/maskable-512.png",
  ].forEach((asset) => {
    assert.match(brandAssets, new RegExp(asset.replaceAll("/", "\\/")));
  });

  assert.match(layout, /brandAssets\.favicon/);
  assert.match(layout, /brandAssets\.appleTouchIcon/);
  assert.match(layout, /brandAssets\.icon192/);
  assert.match(layout, /brandAssets\.icon512/);
  assert.match(layout, /manifest:\s*["']\/manifest\.webmanifest["']/);
  assert.match(manifest, /brandAssets\.maskableIcon/);
});

test("shared page chrome renders the Whats91 logo instead of icon stand-ins", () => {
  const topNavbar = read("src/components/docs/top-navbar.tsx");
  const sidebar = read("src/components/docs/sidebar.tsx");
  const footer = read("src/components/docs/footer.tsx");

  [topNavbar, sidebar, footer].forEach((source) => {
    assert.match(source, /brandAssets\.(wordmark|mark)/);
  });

  assert.doesNotMatch(topNavbar, /Whats91\s*<span className="text-\[#00d4a4\]">/);
  assert.doesNotMatch(sidebar, /MessageSquare className="h-4 w-4 text-white"/);
  assert.doesNotMatch(footer, /MessageSquare className="h-4 w-4 text-white"/);
});

test("top navbar account actions link to Whats91 app destinations", () => {
  const topNavbar = read("src/components/docs/top-navbar.tsx");

  assert.match(topNavbar, /href="https:\/\/app\.whats91\.com\/login"/);
  assert.match(topNavbar, /href="https:\/\/app\.whats91\.com\/dashboard\/customer\/developer\/api-tokens"/);
  assert.match(topNavbar, /Sign In/);
  assert.match(topNavbar, /Get API Keys/);
  assert.doesNotMatch(topNavbar, /Get API Key</);
});

test("footer menu links point to Whats91 production pages", () => {
  const footer = read("src/components/docs/footer.tsx");

  [
    "https://whats91.com/about",
    "https://whats91.com/contact",
    "https://whats91.com/careers",
    "https://whats91.com/partners",
    "https://whats91.com/pricing",
    "https://whats91.com/privacy",
    "https://whats91.com/terms",
    "https://whats91.com/refund",
    "https://whats91.com/compliance",
    "https://whats91.com/cookies",
    "https://whats91.com/blog",
  ].forEach((href) => {
    assert.match(footer, new RegExp(href.replaceAll("/", "\\/").replaceAll(".", "\\.")));
  });

  assert.doesNotMatch(footer, /href:\s*['"]#['"]/);
});
