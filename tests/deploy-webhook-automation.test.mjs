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

test("deploy worker fetches the public main branch and performs production deploy steps", () => {
  const deployScript = readRequiredFile("scripts/deploy.js");

  assertContainsAll(deployScript, [
    "https://github.com/whats91/developers.whats91.com.git",
    "DEPLOY_BRANCH || \"main\"",
    "DEPLOY_PM2_APP_NAME || \"developers-whats91-com\"",
    "loadEnvFile()",
    ".deploy-tmp",
    "deploy-webhook.log",
    "active-deploy.lock",
    "git",
    "fetch",
    "origin",
    "reset",
    "--hard",
    "origin/${CONFIG.branch}",
    "copyRuntimeEnvToTemp()",
    "removeTempBuildOutput()",
    "buildCommandEnv()",
    "safeCommandEnvKeys",
    "privateNextEnvPrefixes",
    "NEXT_TELEMETRY_DISABLED",
    "webhookRemovedPrivateNextEnv",
    "assertStandaloneBuild(CONFIG.tempPath)",
    "assertStandaloneBuild(CONFIG.projectPath)",
    "npm",
    "ci",
    "--include=dev",
    "NPM_CONFIG_PRODUCTION",
    "npm_config_production",
    "NPM_CONFIG_OMIT",
    "run",
    "build",
    "pm2",
    "startOrRestart",
    "ecosystem.config.cjs",
    "--update-env",
  ]);

  assert.match(deployScript, /runCommand\("npm", \["ci", "--include=dev"\], CONFIG\.tempPath\)/);
  assert.match(deployScript, /runCommand\("npm", \["ci", "--include=dev"\], CONFIG\.tempPath\)[\s\S]*removeTempBuildOutput\(\)[\s\S]*runCommand\("npm", \["run", "build"\], CONFIG\.tempPath\)/);
  assert.match(deployScript, /runCommand\("npm", \["run", "build"\], CONFIG\.tempPath\)/);
  assert.match(deployScript, /assertStandaloneBuild\(CONFIG\.tempPath\)[\s\S]*syncDirectory\(CONFIG\.tempPath, CONFIG\.projectPath\)/);
  assert.match(deployScript, /runCommand\(\s*"npm",\s*\["run", "build"\],\s*CONFIG\.tempPath\s*\)[\s\S]*syncDirectory\(CONFIG\.tempPath, CONFIG\.projectPath\)/);
  assert.match(deployScript, /assertStandaloneBuild\(CONFIG\.projectPath\)[\s\S]*startOrRestart/);
  assert.match(deployScript, /syncExcludes:[\s\S]*"\.env"[\s\S]*"node_modules"[\s\S]*"logs"[\s\S]*"\.deploy-tmp"/);
  assert.doesNotMatch(deployScript, /syncExcludes:\s*\[[^\]]*"\.next"/);
  assert.doesNotMatch(deployScript, /deleteNextBuildFolder\(\)/);
  assert.match(deployScript, /baseName !== "\.env\.example"/);
  assert.doesNotMatch(
    deployScript,
    /env:\s*\{\s*\.\.\.process\.env[\s\S]*NPM_CONFIG_YES/,
    "deploy worker child commands must not inherit the full webhook/Next.js runtime environment",
  );
});

test("deploy webhook route validates optional trigger auth and launches detached deployment", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "export const runtime = 'nodejs'",
    "export const dynamic = 'force-dynamic'",
    "DEPLOY_WEBHOOK_TOKEN",
    "x-deploy-token",
    "timingSafeEqual",
    "process.env.PROJECT_ROOT?.trim()",
    "x-github-event",
    "ping",
    "expectedRef",
    "scripts/deploy.js",
    "spawn(",
    "detached: true",
    "sanitizeDeployEnv",
    "safePassthroughEnvKeys",
    "privateNextEnvPrefixes",
    "NEXT_TELEMETRY_DISABLED",
    "DEPLOY_SANITIZED_PRIVATE_NEXT_ENV_REMOVED",
    "DEPLOY_TRIGGER_SOURCE",
    "deploy-webhook.log",
    "NextResponse.json",
    "status: 202",
  ]);

  assert.doesNotMatch(
    route,
    /return\s*\{\s*\.\.\.process\.env[\s\S]*DEPLOY_TRIGGER_SOURCE/,
    "webhook deploy env must not inherit the full live Next.js runtime environment",
  );
});

test("deploy webhook route parses GitHub json and form encoded payloads", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "application/x-www-form-urlencoded",
    "request.text()",
    "URLSearchParams",
    "payload",
    "JSON.parse(payloadParam)",
  ]);
});

test("deploy webhook route returns a clear error when a push payload has no ref", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "const expectedRef = `refs/heads/${process.env.DEPLOY_BRANCH || 'main'}`",
    "Push webhook missing ref.",
    "Expected GitHub to send payload.ref.",
    "status: 400",
  ]);
});

test("deploy webhook route exposes a safe browser health check", () => {
  const route = readRequiredFile("src/app/api/webhooks/deploy/route.ts");

  assertContainsAll(route, [
    "export async function GET",
    "Deploy webhook is ready.",
    "GitHub must call this endpoint with POST.",
    "tokenConfigured",
    "method: 'POST'",
    "events: ['ping', 'push']",
  ]);
});

test("deployment config and docs expose webhook setup", () => {
  const pkg = JSON.parse(readRequiredFile("package.json"));
  const envExample = readRequiredFile(".env.example");
  const gitignore = readRequiredFile(".gitignore");
  const readme = readRequiredFile("README.md");

  assert.equal(pkg.scripts?.["deploy:run"], "node scripts/deploy.js");

  assertContainsAll(envExample, [
    "DEPLOY_DOMAIN=developers.whats91.com",
    "DEPLOY_REPO_URL=https://github.com/whats91/developers.whats91.com.git",
    "DEPLOY_BRANCH=main",
    "DEPLOY_PM2_APP_NAME=developers-whats91-com",
    "DEPLOY_WEBHOOK_TOKEN=",
  ]);

  assertContainsAll(gitignore, [
    "logs/",
    ".deploy-tmp/",
    "active-deploy.lock",
  ]);

  assertContainsAll(readme, [
    "https://developers.whats91.com/api/webhooks/deploy?token=YOUR_TOKEN",
    "Content type: `application/json`",
    "Event: push only",
    "Branch: `main`",
    "npm run deploy:run",
  ]);
});
