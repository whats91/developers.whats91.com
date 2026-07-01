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

test("deploy webhook fails closed in production and validates GitHub signatures", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "createHmac",
    "GITHUB_WEBHOOK_SECRET",
    "X-Hub-Signature-256",
    "sha256=",
    "DEPLOY_WEBHOOK_MAX_BODY_BYTES",
    "Webhook payload too large.",
    "Deploy webhook is not configured.",
    "Invalid deploy webhook signature.",
    "process.env.NODE_ENV === 'production'",
  ]);

  assert.doesNotMatch(
    route,
    /if\s*\(!configuredToken\)\s*return true/,
    "production deploy webhook must not fail open when DEPLOY_WEBHOOK_TOKEN is unset",
  );
});

test("deploy webhook avoids returning operational filesystem and process details", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "Deployment queued.",
    "requestId",
    "console.error",
  ]);

  assert.doesNotMatch(
    route,
    /logPath:\s*result\.logPath/,
    "webhook responses should not expose deployment log paths",
  );
  assert.doesNotMatch(
    route,
    /pid:\s*child\.pid|pid:\s*result\.pid/,
    "webhook responses should not expose process identifiers",
  );
  assert.doesNotMatch(
    route,
    /error instanceof Error \? error\.message/,
    "webhook responses should not expose raw server error messages",
  );
});

test("Next.js config ships security headers", () => {
  const nextConfig = readRequiredFile("next.config.ts");

  assertContainsAll(nextConfig, [
    "poweredByHeader: false",
    "async headers()",
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Content-Type-Options",
    "X-Frame-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "frame-ancestors 'none'",
    "object-src 'none'",
  ]);
});

test("unused dependency and database scaffolding from the audit are removed", () => {
  const pkg = JSON.parse(readRequiredFile("package.json"));
  const deps = pkg.dependencies ?? {};
  const scripts = pkg.scripts ?? {};
  const overrides = pkg.overrides ?? {};

  for (const dependencyName of [
    "@mdxeditor/editor",
    "@prisma/client",
    "next-auth",
    "next-intl",
    "prisma",
    "react-syntax-highlighter",
    "uuid",
  ]) {
    assert.equal(Boolean(deps[dependencyName]), false, `${dependencyName} should not remain in dependencies`);
  }

  for (const scriptName of ["db:push", "db:generate", "db:migrate", "db:reset"]) {
    assert.equal(Boolean(scripts[scriptName]), false, `${scriptName} should be removed from package scripts`);
  }

  assert.equal(Boolean(overrides["js-yaml"]), true, "js-yaml advisory should be remediated with an override");
  assert.equal(Boolean(overrides.postcss), true, "postcss advisory should be remediated with an override");
  assert.equal(fs.existsSync(path.join(rootDir, "src/lib/db.ts")), false, "unused Prisma helper should be removed");
  assert.equal(fs.existsSync(path.join(rootDir, "prisma/schema.prisma")), false, "unused Prisma schema should be removed");
});

test("deployment docs require webhook secrets instead of documenting an open webhook", () => {
  const envExample = readRequiredFile(".env.example");
  const readme = readRequiredFile("README.md");

  assertContainsAll(envExample, [
    "DEPLOY_WEBHOOK_TOKEN=replace-with-a-long-random-string",
    "GITHUB_WEBHOOK_SECRET=replace-with-github-webhook-secret",
  ]);
  assertContainsAll(readme, [
    "DEPLOY_WEBHOOK_TOKEN=replace-with-a-long-random-string",
    "GITHUB_WEBHOOK_SECRET=replace-with-github-webhook-secret",
    "Secret: use the same value as `GITHUB_WEBHOOK_SECRET`",
    "The deploy webhook fails closed in production",
  ]);

  assert.doesNotMatch(readme, /webhook remains open/i);
});

test("security audit report records remediation status", () => {
  const report = readRequiredFile("docs/audits/security-audit-2026-07-01.md");

  assertContainsAll(report, [
    "Remediation Status",
    "Fixed in workspace",
    "DEPLOY_WEBHOOK_TOKEN",
    "GITHUB_WEBHOOK_SECRET",
    "Security headers",
    "Unused dependencies removed",
    "Post-remediation `npm audit --json` reports 0 vulnerabilities",
  ]);
});
