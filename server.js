const path = require("node:path");
const fs = require("node:fs");
const dotenv = require("dotenv");

dotenv.config({
  path: process.env.DOTENV_CONFIG_PATH || path.join(__dirname, ".env"),
});

process.env.ROOT_PATH = process.env.ROOT_PATH || __dirname;
process.env.PROJECT_ROOT = process.env.PROJECT_ROOT || __dirname;
process.env.NODE_ENV = process.env.NODE_ENV || "production";
// CloudPanel reverse proxy expects the app to listen on the configured PORT.
// A public HOSTNAME value can make Next bind away from localhost and cause 502s.
delete process.env.HOSTNAME;

const standaloneServerPath = path.join(__dirname, ".next", "standalone", "server.js");

if (!fs.existsSync(standaloneServerPath)) {
  console.error(
    [
      `Missing Next.js standalone build: ${standaloneServerPath}`,
      "Run `npm run deploy:run` from the project root to rebuild and restart PM2.",
    ].join("\n")
  );
  process.exit(1);
}

require(standaloneServerPath);
