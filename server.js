const path = require("node:path");
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

require(path.join(__dirname, ".next", "standalone", "server.js"));
