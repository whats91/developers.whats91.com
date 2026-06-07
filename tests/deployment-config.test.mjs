import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

test("package configuration uses Node.js deployment tooling instead of Bun", () => {
  const pkg = readJson("package.json");
  const scripts = JSON.stringify(pkg.scripts ?? {}).toLowerCase();

  assert.equal(fs.existsSync(path.join(rootDir, "bun.lock")), false, "bun.lock should be removed");
  assert.equal(scripts.includes("bun"), false, "package scripts should not reference Bun");
  assert.equal(Boolean(pkg.devDependencies?.["bun-types"]), false, "Bun-specific type package should be removed");
  assert.equal(Boolean(pkg.devDependencies?.["@types/node"]), true, "Node.js types should be available");
  assert.equal(Boolean(pkg.dependencies?.dotenv), true, "dotenv should be installed for runtime .env loading");
  assert.equal(pkg.scripts?.start, "node server.js", "npm start should use the Node.js bootstrap");
});

test("production bootstrap loads .env before starting the Next.js standalone server", () => {
  const serverPath = path.join(rootDir, "server.js");
  assert.equal(fs.existsSync(serverPath), true, "server.js bootstrap should exist");

  const server = fs.readFileSync(serverPath, "utf8");
  assert.match(server, /require\(["']dotenv["']\)/, "server.js should require dotenv");
  assert.match(server, /dotenv\.config\(/, "server.js should load .env files");
  assert.match(server, /NODE_ENV/, "server.js should default NODE_ENV for production");
  assert.match(
    server,
    /\.next[\s\S]*standalone[\s\S]*server\.js/,
    "server.js should start the generated standalone Next.js server",
  );
});

test("production bootstrap exposes the project root for webhook deploys", () => {
  const server = fs.readFileSync(path.join(rootDir, "server.js"), "utf8");

  assert.match(
    server,
    /process\.env\.ROOT_PATH\s*=\s*process\.env\.ROOT_PATH\s*\|\|\s*__dirname/,
    "server.js should preserve the project root before Next standalone changes cwd",
  );
  assert.match(
    server,
    /process\.env\.PROJECT_ROOT\s*=\s*process\.env\.PROJECT_ROOT\s*\|\|\s*__dirname/,
    "server.js should expose PROJECT_ROOT for deployment helpers",
  );
});

test("CloudPanel deployment does not bind Next.js to a configured HOSTNAME", () => {
  const server = fs.readFileSync(path.join(rootDir, "server.js"), "utf8");
  const envExample = fs.readFileSync(path.join(rootDir, ".env.example"), "utf8");
  const readme = fs.readFileSync(path.join(rootDir, "README.md"), "utf8");

  assert.match(
    server,
    /delete process\.env\.HOSTNAME/,
    "server.js should remove HOSTNAME so Next standalone binds to its default host",
  );
  assert.doesNotMatch(envExample, /^HOSTNAME=/m, ".env.example should not recommend HOSTNAME");
  assert.doesNotMatch(readme, /^HOSTNAME=/m, "README deployment instructions should not recommend HOSTNAME");
  assert.doesNotMatch(readme, /159\.65\.148\.106/, "README should not hard-code a server IP");
});

test("PM2 ecosystem starts the Node.js bootstrap and leaves PORT to .env or CloudPanel", async () => {
  const ecosystemPath = path.join(rootDir, "ecosystem.config.cjs");
  assert.equal(fs.existsSync(ecosystemPath), true, "ecosystem.config.cjs should exist");

  const ecosystem = await import(pathToFileURL(ecosystemPath).href);
  const config = ecosystem.default ?? ecosystem;
  const app = config.apps?.[0];

  assert.equal(app?.script, "server.js");
  assert.equal(app?.interpreter, "node");
  assert.deepEqual(app?.env, { NODE_ENV: "production" });
  assert.equal(
    Object.hasOwn(app?.env ?? {}, "PORT"),
    false,
    "PORT should come from CloudPanel or .env instead of being hard-coded in PM2 config",
  );
});
