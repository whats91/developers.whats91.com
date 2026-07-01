# Security Audit - developers.whats91.com Static Documentation Site

Date: 2026-07-01  
Auditor: Codex with Codex Security deep scan workspace  
Scan ID: `c76a6006-471f-46a3-96c6-2e33be1ce8d5`  
Repository path: `/Users/devendarsingh/Desktop/NewCodeFolder/websites/developers.whats91.com`  
Reviewed revision: `f32ed3030cbeae94511bdfd2e1db7bb99137ecf8`  

## Scope

This audit covers the attached `developers.whats91.com` codebase, which is a Next.js standalone static documentation website with a small number of server routes for generated metadata, search index files, and deployment automation.

The user request mentioned `graph.whats91.com`, but the supplied workspace and writable project root are `developers.whats91.com`. Findings below are therefore scoped to this static documentation website. If the production `graph.whats91.com` API repository is intended instead, it should receive a separate API security audit.

## Executive Summary

The site is mostly static and does not expose file upload handlers, database-backed public forms, or general-purpose server-side request handlers. The primary security-sensitive surface is the deployment webhook at `/api/webhooks/deploy`, which can start a server-side deployment worker.

No committed real secrets were found. No upload paths or server-side script execution paths were found in the public static asset tree. The code uses current installed framework versions at audit time: `next@16.2.7`, `react@19.2.7`, and `react-dom@19.2.7`.

The most important gaps are operational hardening issues:

1. The deployment webhook is designed to fail open when `DEPLOY_WEBHOOK_TOKEN` is unset.
2. The Next.js app does not define security headers such as CSP, HSTS, frame protection, MIME sniffing protection, referrer policy, or permissions policy.
3. `npm audit` reports 10 moderate dependency advisories, and several vulnerable packages are present through dependencies that appear unused by the current source.
4. The deployment webhook lacks GitHub HMAC signature validation and request size limits, and it returns some operational details.

## Remediation Status

Status: Fixed in workspace on 2026-07-01.

Implemented fixes:

- `DEPLOY_WEBHOOK_TOKEN` now fails closed in production instead of allowing unauthenticated deployment triggers.
- `GITHUB_WEBHOOK_SECRET` and `X-Hub-Signature-256` validation were added for GitHub webhook authenticity.
- Deploy webhook request bodies are limited by `DEPLOY_WEBHOOK_MAX_BODY_BYTES`.
- Deploy webhook responses no longer expose deployment log paths, process IDs, or raw server error messages.
- Security headers were added in `next.config.ts`, including CSP, HSTS, `nosniff`, frame protection, referrer policy, and permissions policy.
- The framework fingerprinting header was disabled with `poweredByHeader: false`.
- Unused dependencies removed from the direct dependency surface: `@mdxeditor/editor`, `@prisma/client`, `next-auth`, `next-intl`, `prisma`, `react-syntax-highlighter`, and `uuid`.
- npm overrides were added for transitive `js-yaml` and `postcss` advisories.
- Unused Prisma/database scaffolding was removed.
- Deployment docs and `.env.example` now require both `DEPLOY_WEBHOOK_TOKEN` and `GITHUB_WEBHOOK_SECRET`.
- Post-remediation `npm audit --json` reports 0 vulnerabilities.

## Findings

### S-001 - High - Deployment webhook can be unauthenticated when token is unset

Status: Fixed in workspace  
Affected paths:

- `src/app/api/webhooks/deploy/route.ts`
- `README.md`
- `.env.example`

Original evidence before remediation:

- `src/app/api/webhooks/deploy/route.ts:43-45` returns authorized when `DEPLOY_WEBHOOK_TOKEN` is empty.
- `README.md:122` documents that an empty token leaves the webhook open.
- `.env.example` ships `DEPLOY_WEBHOOK_TOKEN=` as an empty value.
- `src/app/api/webhooks/deploy/route.ts:202-259` accepts `POST` and starts deployment for allowed GitHub events/refs.

Risk:

If production is deployed with `DEPLOY_WEBHOOK_TOKEN` missing or empty, any internet client can call the deployment webhook. Because the repository is public and the deploy worker only fetches `origin/main`, this is not direct arbitrary code execution by itself. It is still a meaningful operational risk: an attacker can repeatedly trigger `npm ci`, `npm run build`, file sync, and PM2 restart attempts, causing CPU/disk pressure, deployment lock contention, log growth, service churn, and potential downtime.

Recommendation:

- Fail closed in production. If `NODE_ENV === 'production'` and `DEPLOY_WEBHOOK_TOKEN` is missing, return `503` or `500` and do not accept webhook requests.
- Require `DEPLOY_WEBHOOK_TOKEN` in `.env.example` and deployment docs as mandatory, not optional.
- Prefer `x-deploy-token` over `?token=` so secrets are not stored in URLs, browser history, proxy logs, or GitHub webhook delivery URLs.
- Rotate any token that has been shared in chat, screenshots, logs, or issue trackers.
- Add rate limiting or a server-level allowlist for GitHub webhook source networks if CloudPanel/Nginx makes that practical.

Suggested implementation shape:

```ts
const configuredToken = process.env.DEPLOY_WEBHOOK_TOKEN?.trim()
if (!configuredToken && process.env.NODE_ENV === 'production') {
  return false
}
```

### S-002 - Medium - Deployment webhook does not validate GitHub HMAC signatures

Status: Fixed in workspace  
Affected path: `src/app/api/webhooks/deploy/route.ts`

Original evidence before remediation:

- Authorization checks only `?token=` or `x-deploy-token` in `src/app/api/webhooks/deploy/route.ts:47-52`.
- The route does not read or validate `X-Hub-Signature-256`.
- The route accepts `x-github-event` and parsed payload data after token validation in `src/app/api/webhooks/deploy/route.ts:213-242`.

Risk:

A shared static token proves knowledge of the token, but it does not prove the request came from GitHub or that the payload body was signed by GitHub. If the token leaks, anyone can spoof `x-github-event: push` and trigger deployment work. HMAC verification also protects against accidental proxy or webhook replay tooling that sends malformed payloads.

Recommendation:

- Add a separate `GITHUB_WEBHOOK_SECRET`.
- Read the raw request body once, compute `sha256=` HMAC with `crypto.createHmac('sha256', secret)`, and compare against `X-Hub-Signature-256` with `timingSafeEqual`.
- Keep the existing deploy token as a secondary defense, or replace it with GitHub HMAC validation plus source controls.
- Reject unsigned production webhook requests.

### S-003 - Medium - Missing application-level security headers

Status: Fixed in workspace  
Affected path: `next.config.ts`

Original evidence before remediation:

- `next.config.ts:3-9` defines `output`, `turbopack.root`, and `reactStrictMode`, but no `headers()` configuration.
- No middleware or route-level security header policy was found.

Risk:

The site is mostly static and does not use application cookies, which reduces impact. However, without app-level headers the site relies entirely on CloudPanel/Nginx/CDN defaults for browser protections. Missing headers increase blast radius for any future XSS, static SVG/content issue, or third-party script/config mistake.

Recommended headers:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- `Content-Security-Policy` tuned for Next.js static assets and current inline JSON-LD needs

Implementation note:

Because this app emits JSON-LD through `dangerouslySetInnerHTML`, a CSP must either use a nonce/hash strategy or explicitly allow the small required inline scripts. Do not ship a broken CSP that blocks Next.js runtime or metadata scripts without testing production pages.

### S-004 - Medium - Dependency audit reports 10 moderate advisories and unused direct dependencies increase supply-chain surface

Status: Fixed in workspace  
Affected paths:

- `package.json`
- `package-lock.json`

Original evidence before remediation:

- `npm audit --json` returned 10 moderate vulnerabilities and 0 high/critical vulnerabilities.
- Installed top-level versions include:
  - `next@16.2.7`
  - `react@19.2.7`
  - `react-dom@19.2.7`
  - `@mdxeditor/editor@3.55.0`
  - `next-auth@4.24.14`
  - `next-intl@4.13.0`
  - `react-syntax-highlighter@15.6.6`
- `package.json:28`, `package.json:70`, `package.json:71`, and `package.json:80` include `@mdxeditor/editor`, `next-auth`, `next-intl`, and `react-syntax-highlighter`.
- Source import search did not find active imports for `@mdxeditor/editor`, `next-auth`, `next-intl`, `react-syntax-highlighter`, or direct `uuid` usage in `src/`.
- Current syntax highlighting is implemented locally in `src/lib/code-highlight.mjs` and escapes `&`, `<`, and `>`.

Audit advisories observed:

| Package | Severity | Notes |
| --- | --- | --- |
| `js-yaml` via `@mdxeditor/editor` | Moderate | Quadratic complexity DoS in merge key handling. |
| `postcss` via `next` | Moderate | CSS stringify XSS advisory. |
| `prismjs` via `react-syntax-highlighter`/`refractor` | Moderate | DOM clobbering advisory. |
| `uuid` via `next-auth` | Moderate | Bounds check advisory in older transitive version. |

Post-remediation validation:

- Direct unused dependencies listed above were removed.
- Transitive `js-yaml` and `postcss` advisories were remediated through npm overrides.
- `npm audit --json` now reports 0 vulnerabilities.

Risk:

Unused dependencies still execute during `npm ci`, may bring transitive install/build hooks, increase build time, and create future scanner noise. For a static docs site, unnecessary editor/auth/i18n/runtime libraries are a larger supply-chain surface than the app needs.

Recommendation:

- Remove unused direct dependencies from `package.json` and regenerate `package-lock.json`.
- If an unused dependency is intentionally retained for a planned feature, document that reason and pin/upgrade it.
- Upgrade or replace `react-syntax-highlighter` if it becomes used again; otherwise remove it since the custom highlighter is already present.
- Track Next.js security releases closely because the app uses App Router and React Server Components.
- Run `npm audit` after dependency cleanup and before deployment.

### S-005 - Low - Deployment webhook reads request bodies without an explicit size limit and returns operational details

Status: Fixed in workspace  
Affected path: `src/app/api/webhooks/deploy/route.ts`

Original evidence before remediation:

- `src/app/api/webhooks/deploy/route.ts:82-99` calls `request.json()` or `request.text()` without checking `Content-Length`.
- `src/app/api/webhooks/deploy/route.ts:192-199` returns deployment branch and whether the token is configured.
- `src/app/api/webhooks/deploy/route.ts:250-259` returns deployment log path and process PID.
- `src/app/api/webhooks/deploy/route.ts:263-270` returns raw error messages on start failures.

Risk:

When the webhook is protected, unauthorized users are rejected before body parsing. If the webhook is open, or if the token leaks, large bodies can waste memory before being discarded. Returning internal paths/PIDs and raw errors is not a direct vulnerability, but it exposes operational information useful for troubleshooting by defenders and reconnaissance by attackers.

Recommendation:

- Reject requests with `Content-Length` above a small threshold, for example 1 MB.
- Return a generic `202 Accepted` response with a request ID instead of filesystem paths and PID.
- Keep detailed paths and errors in server logs only.
- Make `GET` either disabled in production or return only a minimal readiness response.

## Non-Findings and Positive Controls

### No server-side upload endpoint found

Searches for `formData`, `multipart`, `File`, `Blob`, upload handlers, stream writes, and public upload directories found no active upload handler in `src/app`. The only filesystem writes are in the deployment worker and tests. Documentation pages mention upload APIs, but those are docs examples, not executable upload routes in this site.

### No executable public upload path found

The `public/` directory contains branding assets, icons, favicon SVG, and static LLM markdown files:

- `public/*.svg`
- `public/icons/*.png`
- `public/llms/*.md`

No public JavaScript upload directory, server-executed file path, or user-controlled static asset writer was found.

### JSON-LD rendering is escaped

`src/components/docs/json-ld.tsx` uses `dangerouslySetInnerHTML`, but it serializes trusted local route/doc data and replaces `<` with `\u003c`, reducing script-breakout risk.

### Code block highlighting escapes HTML metacharacters

`src/lib/code-highlight.mjs` escapes `&`, `<`, and `>` before returning highlighted HTML. This makes its use in `dangerouslySetInnerHTML` lower risk for the current trusted local docs dataset.

### No committed production secrets found

Secret-pattern scanning found placeholders and examples only, such as `w91_live_xxx`, `YOUR_TOKEN`, and environment variable names. No private keys, GitHub tokens, AWS keys, OpenAI keys, or real Whats91 tokens were found in the repository.

### No middleware authorization surface found

No `middleware.ts` was present. The middleware bypass issues discussed in the referenced security report do not directly apply to this codebase today because the site does not rely on Next middleware for authorization.

### No remote image optimizer SSRF configuration found

`next.config.ts` does not define permissive `images.remotePatterns` or remote image allowlists. No SSRF exposure through Next Image remote optimization was found in this codebase.

### `/api` placeholder returns noindex 404

`src/app/api/route.ts` returns a JSON 404 with `X-Robots-Tag: noindex, nofollow`, which is appropriate for the non-documentation API root.

## Threat Model Summary

Primary assets:

- Availability of the documentation site.
- Integrity of deployed documentation content.
- Deployment environment, build host, `.env`, PM2 process, and CloudPanel reverse proxy.
- Public trust in generated docs, code samples, `llms.txt`, and LLM copy guides.

Primary entry points:

- Public documentation pages.
- Static files under `/public`.
- Generated routes: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/search-index.json`, OpenGraph/Twitter images.
- Deployment route: `/api/webhooks/deploy`.
- GitHub repository and npm dependency supply chain.

Primary risks:

- Unauthenticated or weakly authenticated deployment trigger causing denial of service.
- Supply-chain risk during `npm ci` and Next.js build.
- Browser hardening gaps due missing headers.
- Future XSS risk if docs data becomes user-editable or imports untrusted Markdown/HTML.

## Recommended Remediation Plan

### Priority 1

1. Make `DEPLOY_WEBHOOK_TOKEN` mandatory in production and fail closed when missing.
2. Add GitHub `X-Hub-Signature-256` validation using a dedicated `GITHUB_WEBHOOK_SECRET`.
3. Rotate any deploy token that has been exposed outside the server environment.

### Priority 2

1. Add security headers through `next.config.ts` or CloudPanel/Nginx, preferably in code so they are versioned and testable.
2. Add request size checks to the deployment webhook.
3. Stop returning log paths, PIDs, and raw error messages from webhook responses.

### Priority 3

1. Remove unused dependencies: `@mdxeditor/editor`, `next-auth`, `next-intl`, direct `uuid`, and `react-syntax-highlighter` if no longer needed.
2. Regenerate `package-lock.json` and rerun `npm audit`.
3. Remove unused Prisma/database scaffolding if the static documentation site does not need it.

### Priority 4

1. Add tests for production webhook fail-closed behavior.
2. Add tests for security headers.
3. Add a dependency audit check in CI.
4. Re-run this audit after any feature adds forms, uploads, MDX rendering, admin pages, or authenticated docs.

## Validation Commands Run

```bash
rg --files
rg -n "upload|multipart|formData|File\(|Blob|base64|writeFile|copyFile|rmSync|mkdir|createWriteStream|readFile|fs\.|child_process|spawn\(|exec\(|execFile|eval\(|Function\(|dangerouslySetInnerHTML|innerHTML|outerHTML|document\.write|sanitize|DOMPurify|iframe|script" src scripts server.js next.config.ts package.json prisma public tests
rg -n "process\.env|NEXT_PUBLIC|SECRET|TOKEN|PASSWORD|DATABASE_URL|API_KEY|AUTH|private|Bearer|DEPLOY|GITHUB|WEBHOOK" . --glob '!node_modules/**' --glob '!.next/**' --glob '!package-lock.json'
rg -n "(AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|ghp_[0-9A-Za-z_]{36,}|github_pat_[0-9A-Za-z_]+|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]+|-----BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY-----|password\s*=|secret\s*=|token\s*=|api[_-]?key\s*=)" . --glob '!node_modules/**' --glob '!.next/**' --glob '!package-lock.json'
find public -maxdepth 3 -type f -print
find . -maxdepth 3 -type f \( -name '.env*' -o -name '*.pem' -o -name '*.key' -o -name '*.p12' -o -name '*.crt' -o -name '*.sqlite' -o -name '*.db' \) -not -path './node_modules/*' -not -path './.next/*' -print
npm audit --json
npm list next react react-dom react-syntax-highlighter @mdxeditor/editor next-auth next-intl --depth=0
node -p "JSON.stringify({next:require('next/package.json').version, react:require('react/package.json').version, reactDom:require('react-dom/package.json').version, syntax:require('react-syntax-highlighter/package.json').version}, null, 2)"
```

## Final Assessment

The current codebase is low complexity from a web-application attack-surface perspective because it is mostly static documentation. The critical exception is deployment automation, which should be treated as an administrative control plane. Hardening the deploy webhook and adding browser security headers should be prioritized before adding any new interactive or user-generated content features.
