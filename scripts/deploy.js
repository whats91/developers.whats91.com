#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(PROJECT_ROOT, ".env");
  if (!fs.existsSync(envPath)) return;

  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (key) process.env[key] = value;
  }
}

loadEnvFile();

const rootPath =
  process.env.ROOT_PATH?.trim() ||
  process.env.DEPLOY_ROOT_PATH?.trim() ||
  process.env.DEPLOY_PROJECT_PATH?.trim() ||
  PROJECT_ROOT;

const CONFIG = {
  repoUrl:
    process.env.DEPLOY_REPO_URL ||
    "https://github.com/whats91/developers.whats91.com.git",
  branch: process.env.DEPLOY_BRANCH || "main",
  pm2AppName: process.env.DEPLOY_PM2_APP_NAME || "developers-whats91-com",
  projectPath: rootPath,
  tempPath: process.env.DEPLOY_TEMP_PATH || path.join(rootPath, ".deploy-tmp"),
  logPath:
    process.env.DEPLOY_WEBHOOK_LOG_PATH ||
    path.join(rootPath, "logs", "deploy-webhook.log"),
  lockFile:
    process.env.DEPLOY_LOCK_FILE || path.join(rootPath, "active-deploy.lock"),
  lockStaleMs: Number(process.env.DEPLOY_LOCK_STALE_MS || 30 * 60 * 1000),
  delayMs: Number(process.env.DEPLOY_DELAY_MS || 1000),
  syncExcludes: [
    ".git",
    ".env",
    ".env.local",
    ".env.production",
    "node_modules",
    ".next",
    "logs",
    ".deploy-tmp",
    "active-deploy.lock",
    ".deploy.lock",
    ".DS_Store",
    "tsconfig.tsbuildinfo",
  ],
};

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  const line = `[${new Date().toISOString()}] [deploy] ${message}`;
  console.log(`${colors[color] || ""}${line}${colors.reset}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function normalizeRelativePath(relPath) {
  return relPath.split(path.sep).join("/");
}

function shouldExcludePath(relPath) {
  const normalized = normalizeRelativePath(relPath);
  const baseName = path.basename(normalized);

  if (!normalized || normalized === ".") return false;
  if (CONFIG.syncExcludes.includes(normalized)) return true;
  if (CONFIG.syncExcludes.includes(baseName)) return true;
  if (baseName === ".env" || baseName.startsWith(".env.")) return true;

  return false;
}

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    log(`Running: ${command} ${args.join(" ")}`, "cyan");

    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: false,
      env: {
        ...process.env,
        CI: process.env.CI || "true",
        GIT_TERMINAL_PROMPT: "0",
        DEBIAN_FRONTEND: "noninteractive",
        NPM_CONFIG_YES: "true",
        npm_config_yes: "true",
      },
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}, signal ${signal}`));
    });
  });
}

function acquireLock() {
  ensureDir(path.dirname(CONFIG.lockFile));

  if (fs.existsSync(CONFIG.lockFile)) {
    const stat = fs.statSync(CONFIG.lockFile);
    const ageMs = Date.now() - stat.mtimeMs;

    if (ageMs < CONFIG.lockStaleMs) {
      throw new Error(`Deployment already running. Lock file exists: ${CONFIG.lockFile}`);
    }

    log(`Removing stale deployment lock: ${CONFIG.lockFile}`, "yellow");
    fs.rmSync(CONFIG.lockFile, { force: true });
  }

  const lockData = {
    pid: process.pid,
    createdAt: new Date().toISOString(),
    host: os.hostname(),
    projectPath: CONFIG.projectPath,
  };

  fs.writeFileSync(CONFIG.lockFile, JSON.stringify(lockData, null, 2), { flag: "wx" });
}

function releaseLock() {
  try {
    if (fs.existsSync(CONFIG.lockFile)) {
      fs.rmSync(CONFIG.lockFile, { force: true });
    }
  } catch (error) {
    log(`Unable to release deployment lock: ${error.message}`, "yellow");
  }
}

function removeStalePath(targetPath, relPath) {
  fs.rmSync(targetPath, { recursive: true, force: true });
  log(`Removed stale path: ${normalizeRelativePath(relPath)}`, "yellow");
}

function syncDirectory(sourceDir, destinationDir, relPath = "") {
  if (shouldExcludePath(relPath)) {
    log(`Preserved excluded path: ${normalizeRelativePath(relPath)}`, "cyan");
    return;
  }

  ensureDir(destinationDir);

  const sourceEntries = new Map(
    fs.readdirSync(sourceDir, { withFileTypes: true }).map((entry) => [entry.name, entry])
  );
  const destinationEntries = fs.existsSync(destinationDir)
    ? fs.readdirSync(destinationDir, { withFileTypes: true })
    : [];

  for (const destinationEntry of destinationEntries) {
    const nextRelPath = relPath
      ? path.join(relPath, destinationEntry.name)
      : destinationEntry.name;
    const destinationPath = path.join(destinationDir, destinationEntry.name);

    if (shouldExcludePath(nextRelPath)) continue;
    if (!sourceEntries.has(destinationEntry.name)) {
      removeStalePath(destinationPath, nextRelPath);
    }
  }

  for (const [name] of sourceEntries) {
    const sourcePath = path.join(sourceDir, name);
    const destinationPath = path.join(destinationDir, name);
    const nextRelPath = relPath ? path.join(relPath, name) : name;

    if (shouldExcludePath(nextRelPath)) {
      log(`Preserved excluded path: ${normalizeRelativePath(nextRelPath)}`, "cyan");
      continue;
    }

    const sourceStats = fs.lstatSync(sourcePath);

    if (sourceStats.isDirectory()) {
      syncDirectory(sourcePath, destinationPath, nextRelPath);
      continue;
    }

    if (sourceStats.isSymbolicLink()) {
      if (fs.existsSync(destinationPath)) {
        fs.rmSync(destinationPath, { recursive: true, force: true });
      }
      fs.symlinkSync(fs.readlinkSync(sourcePath), destinationPath);
      continue;
    }

    ensureDir(path.dirname(destinationPath));
    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function deleteNextBuildFolder() {
  const nextPath = path.join(CONFIG.projectPath, ".next");
  if (!fs.existsSync(nextPath)) {
    log("Not found (skip): .next", "cyan");
    return;
  }

  fs.rmSync(nextPath, { recursive: true, force: true });
  log("Deleted: .next", "green");
}

async function prepareTempCheckout() {
  ensureDir(CONFIG.tempPath);

  if (!fs.existsSync(path.join(CONFIG.tempPath, ".git"))) {
    await runCommand("git", ["init"], CONFIG.tempPath);
    await runCommand("git", ["remote", "add", "origin", CONFIG.repoUrl], CONFIG.tempPath);
  }

  await runCommand("git", ["remote", "set-url", "origin", CONFIG.repoUrl], CONFIG.tempPath);
  await runCommand("git", ["fetch", "origin", CONFIG.branch], CONFIG.tempPath);
  await runCommand("git", ["reset", "--hard", `origin/${CONFIG.branch}`], CONFIG.tempPath);
  await runCommand("git", ["log", "-1", "--oneline"], CONFIG.tempPath);
}

async function deploy() {
  const startedAt = Date.now();

  ensureDir(path.dirname(CONFIG.logPath));
  log("Deployment starting", "green");
  log(`Project path: ${CONFIG.projectPath}`, "cyan");
  log(`Temp path: ${CONFIG.tempPath}`, "cyan");
  log(`Repo URL: ${CONFIG.repoUrl}`, "cyan");
  log(`Branch: ${CONFIG.branch}`, "cyan");
  log(`PM2 app: ${CONFIG.pm2AppName}`, "cyan");

  acquireLock();

  try {
    await prepareTempCheckout();
    await sleep(CONFIG.delayMs);

    syncDirectory(CONFIG.tempPath, CONFIG.projectPath);
    await sleep(CONFIG.delayMs);

    deleteNextBuildFolder();
    await sleep(CONFIG.delayMs);

    await runCommand("npm", ["ci"], CONFIG.projectPath);
    await runCommand("npm", ["run", "build"], CONFIG.projectPath);
    await runCommand(
      "pm2",
      ["startOrRestart", "ecosystem.config.cjs", "--update-env"],
      CONFIG.projectPath
    );

    const durationSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
    log(`Deployment finished in ${durationSeconds}s`, "green");
  } finally {
    releaseLock();
  }
}

deploy().catch((error) => {
  log(`Deployment failed: ${error.message}`, "red");
  if (error.stack) log(error.stack, "red");
  releaseLock();
  process.exit(1);
});
