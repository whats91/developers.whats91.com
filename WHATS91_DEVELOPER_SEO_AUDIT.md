# Whats91 Developer Portal — SEO, Documentation Quality & Developer Experience Audit

Date: 2026-07-20
Auditor: Claude (Fable 5), using direct HTTP inspection, full source analysis, a production-mode local crawl, automated code-example validation, and the `claude-seo` plugin methodology (v2.2.0).
Scope: `https://developers.whats91.com` and this repository (`whats91/developers.whats91.com`, branch `main`).

---

## 1. Executive Summary

**Overall condition: strong foundation, two confirmed P0 defect classes — both fixed in this pass.**

The portal already had unusually good SEO infrastructure from a prior 2026-06-06 audit: a single canonical route registry, per-page metadata with explicit SEO titles/descriptions, permanent redirects for legacy routes, branded OG/Twitter image routes, JSON-LD (Organization, WebSite, TechArticle, APIReference, BreadcrumbList, FAQPage), an AI-crawler-aware robots.txt, `llms.txt`, per-family LLM markdown guides, and a lazy search index.

The two P0 problems found and fixed:

1. **84 of 265 generated SDK examples were syntactically invalid** on live production pages. The SDK example generator fell back to the documented `curl` command as the "request body" whenever an endpoint documented its request as curl instead of JSON. The result: complete `curl` commands nested inside JavaScript `JSON.stringify()`, Python `json=`, PHP `json_encode()`, C# raw strings, and even inside another `curl -d` payload — across 18 endpoint pages (messaging, templates, chatbots, contact books, blacklist, CRM, meta-compatibility). Independently, the PHP template emitted raw JSON (not PHP) inside `json_encode()` and the C# template produced invalid raw string literals with escaped quotes. **All 456 extracted snippets now validate (0 failures).**

2. **Nine duplicate-content URL pairs with competing self-canonicals in the sitemap.** Every category without `firstSectionAtBase` served identical content at its base URL and its first section URL (`/templates` ≡ `/templates/marketing`, `/webhooks` ≡ `/webhooks/create`, `/reports` ≡ `/reports/all-reports`, `/message-billing`, `/chatbots`, `/contact-books`, `/blacklist`, `/conversations`, `/crm`) — with identical titles and descriptions but different self-canonicals, and both URLs in the sitemap. Base URLs now canonicalize to the section URL and the sitemap carries only canonical URLs (77 → 68 entries).

**Strongest existing elements:** canonical route registry driving metadata/sitemap/llms.txt from one source; unique task-focused titles on section pages; consistent `https://graph.whats91.com/api/v2` base URL (235 references, zero drift); real 404s; permanent redirects; qualified (non-invented) rate-limit language; per-family LLM markdown guides with a working "Copy for LLM" feature.

**Biggest search opportunities:** the duplicate-canonical fix consolidates link equity onto 68 clean URLs; corrected SDK examples remove low-quality signals from every endpoint page (and stop AI coding agents from learning corrupted code); machine-readable copies no longer compete with canonical HTML.

**Biggest developer-experience risks (remaining):** SVG-only social preview images (most platforms will not render them — PNG fallback added, full fix needs an owner decision), and no runtime contract verification possible from this repository (backend lives elsewhere).

---

## 2. Architecture

| Aspect | Value |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Rendering | Static prerender (SSG) for all doc pages; `output: "standalone"` |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Content source | Single manual TypeScript data store: `src/lib/doc-data.ts` (~9,600 lines) |
| Route registry | `src/lib/doc-routes.ts` (canonical paths, legacy redirects, sitemap source) |
| Metadata | `src/lib/seo.ts` (`buildDocMetadata`, JSON-LD builders) via per-page `generateMetadata` |
| Search | Client-side ⌘K dialog + `/search-index.json` + `src/lib/search-ranking.mjs` |
| Syntax highlighting | In-house `src/lib/code-highlight.mjs` (no external bundle) |
| Build | `next build` + static/public copy into standalone |
| Serve | `node server.js` (PM2/CloudPanel), deploy webhook at `/api/webhooks/deploy` |
| Package manager | npm |

## 3. Methodology

1. Baseline: `git status/branch/remote`, lint, `tsc --noEmit`, `node --test` (161 tests), production build — all recorded before any change.
2. Route inventory from the App Router tree, prerender manifest (90 concrete routes), route registry, sitemap, robots, search index, and `llms.txt`.
3. Live production audit via `curl`: host/redirect policy, robots.txt, sitemap fetch + 77-URL status sweep, canonical/title/meta/JSON-LD extraction on representative pages, header inspection of machine endpoints, 404 behavior.
4. Code-example validation harness (`node`): extracted **456 snippets** from `doc-data.ts` (authored blocks, API request/response blocks, generated SDK examples) and validated with `JSON.parse`, `node --check`, `python3 -m py_compile` (+ bare `true/false/null` lint), `php -l` (PHP 8.4), `bash -n`, and structural C# raw-string lints. No network calls; no live API requests ever issued.
5. `claude-seo` plugin (v2.2.0) methodology applied inline (technical, schema, sitemap, GEO, content checklists; PERCEIVE→ANALYZE→VALIDATE→ACT synthesis). Findings below are all evidence-backed; no invented volumes, difficulties, or rankings.
6. Post-fix validation: full re-crawl of the production-mode local server (all pages, canonicals, titles, descriptions, JSON-LD, internal links, redirects, headers).

## 4. Complete Route Inventory

**Prerendered concrete routes: 90** (93 build outputs including `_not-found`, `_global-error`).

| Class | Routes | Indexable | Notes |
|---|---|---|---|
| Canonical doc pages | 68 | Yes (self-canonical) | Getting Started 5, Messaging 5, Meta-Compat 6, Templates 3, Webhooks 3, Reports 12, Billing 9, Chatbots 6, Contact Books 6, Blacklist 5, Conversations 5, CRM 2, Changelog 1 |
| Category base duplicates | 9 (`/templates`, `/webhooks`, `/reports`, `/message-billing`, `/chatbots`, `/contact-books`, `/blacklist`, `/conversations`, `/crm`) | 200, canonicalized to first section (was: competing self-canonical) | Removed from sitemap in this pass |
| Redirect-only pages | `/`, `/template`, `/webhook`, `/chatbot`, `/contact-book`, `/messaging-meta` (+ their `[section]` variants), `/messaging/overview`-style first-section paths | 308 | Correct permanent redirects |
| Machine endpoints | `/llms.txt`, `/llms/*.md` (11), `/search-index.json` | 200, fetchable, now `X-Robots-Tag: noindex` | For AI agents/tooling |
| Infra endpoints | `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/opengraph-image`, `/twitter-image` | n/a | Working |
| Private/API | `/api` (404 + noindex), `/api/webhooks/deploy` (deploy hook; robots-disallowed) | No | Correct |
| Error | 404 page | Real 404 status | Correct |

**Count reconciliation (after fix):** registry indexable routes = sitemap URLs = crawled 200 pages = **68**. Search index = **68 sections**. No unexplained differences. (Search index counts sections, which now map 1:1 onto canonical URLs.)

## 5. Source-of-Truth Matrix

The backend runtime (`graph.whats91.com`) is **not** in this repository. All documentation is manually authored in `doc-data.ts`; SDK examples are generated from the documented API blocks at render time.

| Documentation family | Documentation source | Runtime source | Generated or manual | Drift risk |
|---|---|---|---|---|
| Messaging (`/api/v2/send`, `/chat`) | `doc-data.ts` sections `messaging-*` | Backend repo (not present) | Manual (SDK examples generated) | Medium |
| Meta-compatibility (`/api/v2/messages`) | `doc-data.ts` `messaging-meta-*` | Backend repo | Manual | Medium |
| Templates (`/api/v2/templates`) | `doc-data.ts` `template-*` | Backend repo | Manual | Medium |
| Webhooks (`/api/v2/webhooks*`) | `doc-data.ts` `webhook-*` | Backend repo | Manual | Medium |
| Reports (`/api/v2/reports/*`) | `doc-data.ts` `reports-*` | Backend repo | Manual | Medium |
| Billing (`/api/v2/billing/*`) | `doc-data.ts` `billing-*` | Backend repo | Manual | Medium |
| Chatbots / Contact books / Blacklist / Conversations / CRM | `doc-data.ts` | Backend repo | Manual | Medium |
| Rate limits | `doc-data.ts` `rate-limits` (explicitly defers to Meta) | Meta platform + backend | Manual | Low (correctly qualified) |
| Changelog | `changelogEntries` in `doc-data.ts` | Product releases | Manual | Low |

Consequence: **no documentation/runtime contract discrepancy can be confirmed or refuted from this repository alone.** All contract statements were checked for *internal* consistency (method/path/params/examples agree with each other on every page — they do). Runtime verification is listed under "requires backend repository access."

## 6. Live vs Local Comparison

Live production (pre-fix) matched the repository build byte-for-byte in behavior: same 77-URL sitemap, same duplicate canonical pairs, same corrupted SDK examples (confirmed rendered: `JSON.stringify(curl -X POST …` on `/messaging/template-send`), same missing noindex on machine copies. The live site runs this codebase; no unexplained deltas found.

## 7. Baseline Results (before any change)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass (0 problems; no suppressions in config) |
| Types | `npx tsc --noEmit` | Pass |
| Tests | `npm test` | 161/161 pass |
| Build | `npm run build` | Pass; 93/93 static pages |
| TypeScript build errors ignored? | `next.config.ts` | No (`ignoreBuildErrors` absent) |

Pre-existing uncommitted work (a UI redesign: 11 modified components + theme system) was present before this audit and preserved untouched except for two additive edits (skip link in `documentation-page.tsx`; OG fallback in `layout.tsx`).

## 8. Canonical Findings

- ✅ Every indexable page emits exactly one absolute HTTPS self-canonical on the correct host (verified live + local crawl).
- ❌→✅ **P0:** 9 category base URLs duplicated their first section with competing self-canonicals (see §1). Fixed: base URLs canonicalize to the section URL; sitemap deduplicated.
- ✅ No canonical points at a redirect, the homepage, an API base URL, or across materially different content.
- ✅ Trailing-slash URLs 308 to the canonical form; case variants 404; http→https 301.
- `www.developers.whats91.com` does not resolve (no DNS record) — acceptable; no duplicate-host risk. Optional: add DNS + redirect for typed-URL resilience (owner decision).

## 9. Sitemap and Robots Findings

- ❌→✅ Sitemap contained 77 URLs including the 9 duplicates → now 68 canonical-only URLs; every URL returns 200 and is self-canonical (crawl-verified).
- ❌→✅ `lastModified` was hardcoded `2026-06-06` for all URLs (stale — changelog's real latest entry is 2026-06-11). Now: changelog carries its true latest-release date; other pages omit `lastmod` rather than claiming an unverifiable date.
- ✅ No API endpoints, search results, JSON endpoints, markdown copies, redirects, or 404s in the sitemap.
- ✅ robots.txt: correct sitemap declaration; disallows `/login`, `/dashboard`, `/admin`, `/api`, `/internal`; explicit allow rules for Googlebot, Bingbot, DuckDuckBot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended. CSS/JS assets not blocked.
- ❌→✅ `/llms.txt`, `/llms/*.md`, `/search-index.json` were crawlable **and indexable**. Now `X-Robots-Tag: noindex` (still fetchable by AI agents — robots.txt intentionally does not block them).

## 10. Metadata Findings

- ✅ 68/68 unique titles and 68/68 unique meta descriptions after the canonical fix (crawl-verified; before it, each duplicate pair shared identical title+description).
- ✅ Title patterns already task-focused per page type (e.g. `Send WhatsApp Template Messages | Messaging API… `, `[Section] | [Family] API Documentation | Whats91 Developers`). No keyword stuffing found; no "official Meta partner" claims.
- ✅ OG title/description/url/siteName/type, Twitter `summary_large_image`, viewport, favicon set, apple-touch icon, manifest, author present.
- ⚠️ **OG image is SVG** (`/opengraph-image`, `image/svg+xml`). Facebook, X, LinkedIn and WhatsApp do not render SVG previews. Mitigated this pass with a PNG fallback (`/icons/icon-512.png`) listed as a second OG/Twitter image. A proper 1200×630 PNG needs an owner decision because the test suite pins the SVG-only route design (chosen previously to avoid build-time image generation on CloudPanel).
- ✅ No placeholder verification tokens.

## 11. Information Architecture Findings

- Sidebar order matches the developer journey: Getting Started (Overview → Quick Start → Authentication → API Keys → Rate Limits) → Messaging → Meta-Compat → Templates → Webhooks → Reports → Billing → Chatbots → Contact Books → Blacklist → Conversations → CRM → Changelog. The 10-step new-developer journey (understand → token → base URL → test message → template → webhook → delivery status → errors → advanced) is completable in sidebar order.
- Prev/next navigation exists on every section page (crawl-verified: zero broken links). Related-documentation blocks and Summary/Prerequisite panels exist sitewide. Breadcrumb JSON-LD matches visible hierarchy.
- No dead-end pages found; every page links onward (related + prev/next + sidebar).
- Anchor links: headings carry stable IDs with scroll offsets under the sticky header.
- Improvement implemented: skip-to-content link (see §17).

## 12. Code Example Integrity (P0 workstream)

**Verdict: 456 snippets checked → 456 valid after fix (0 invalid; 9 non-code "text/http" pseudo-blocks skipped by design).**

| Origin | Language | Checked | Before | After |
|---|---|---|---|---|
| Authored content blocks | curl/json/js | 59 | all pass | all pass |
| API request blocks | curl/json | 61 | all pass | all pass |
| API response blocks | json | 62 | all pass | all pass |
| Generated SDK examples | curl | 53 | 16 fail | **53 pass** |
| Generated SDK examples | JavaScript | 53 | 16 fail | **53 pass** |
| Generated SDK examples | Python | 53 | 16 fail | **53 pass** |
| Generated SDK examples | PHP | 53 | 18 fail | **53 pass** |
| Generated SDK examples | C# | 53 | 18 fail | **53 pass** |

**Root causes (all in the generator, `getSdkExamplesForSection` / `extractRequestBody` in `doc-data.ts`):**
1. Body fallback `request?.[0]` returned the documented **curl command** when no JSON block existed → curl embedded inside JS/Python/PHP/C#/curl bodies (16 sections × 5 languages).
2. PHP template passed raw JSON to `json_encode()` — invalid PHP for any body (2 further sections).
3. C# template used a single-line raw string opener for multi-line JSON and escaped quotes inside a raw string — both invalid (2 further sections).
4. Python `json=` received raw JSON, so any body containing `true/false/null` would have been runtime-invalid.

**Generator-level fix:** the body is now parsed JSON sourced from the JSON request block **or extracted from the documented curl `-d` payload**; each language renders it natively (JS object literal, Python literal with `True/False/None`, PHP associative array, C# multi-line raw string with `using System.Text;`, clean curl `-d`). Bodyless requests no longer send `Content-Type`. Affected pages: all 18 previously-broken sections plus improved output on the other 35.

Placeholders: only fictional values are used (`w91_live_xxx`, `919999999999`, `wba_123`, etc.). No real tokens, phone numbers, WABA IDs, or customer identifiers exist anywhere in the content (verified by grep for token patterns).

## 13. API Contract Accuracy

Internal consistency verified on every endpoint page (method/path in the endpoint header, curl example, SDK examples, and parameter tables agree — after the generator fix they agree by construction). Base URL is uniformly `https://graph.whats91.com/api/v2` (235 occurrences, zero `/v2`-only or v1 references).

| Page | Documented contract | Runtime contract | Severity | Action |
|---|---|---|---|---|
| `/crm/lead-generation` (company-scoped `POST /api/v2/crm/companies/{companyUid}/leads`) | curl example omits the `Authorization` header (all sibling examples include it) | Unverifiable here | P2 | **Escalate to owner**: confirm whether this endpoint is intentionally unauthenticated (public lead capture) or the example is missing the header. Not changed — either edit would be speculative. |
| All numeric/limit statements | Rate limits page defers to Meta and documents no invented Whats91 numbers | Unverifiable here | — | Keep; see fact matrix §15 |

No other discrepancy was detectable without the backend repository. No speculative contract changes were made.

## 14. Authentication & Security Documentation

- Bearer format documented (`Authorization: Bearer w91_live_…`); managed-token creation path (Dashboard → Developer → API Tokens), scope/sender binding, expiry, revocation, SHA-256 storage described; legacy customer tokens explicitly discouraged.
- Alternate auth fields (`authToken`, `auth_token`, `token` in body) are documented for clients that cannot send headers — flag for owner review: keeping three aliases is a real support surface; docs describe them clearly, nothing invented.
- Placeholders only; no secrets (verified). Server-side usage shown in all SDK examples (no browser-side token exposure pattern). Recommendation (P2, content): add an explicit "never ship this token in frontend JavaScript" callout on Authentication — requires content authoring, listed in plan.

## 15. Versioning & Fact Matrix

| Surface | Status | Canonical documentation | Indexing policy | Migration action |
|---|---|---|---|---|
| Public API v2 (`graph.whats91.com/api/v2`) | Current | All 68 doc pages | Index | Keep |
| Meta-compatibility surface (`/api/v2/messages`) | Supported, documented | `/messaging/meta-compatibility*` | Index | Keep (documented as intentional compatibility layer) |
| Public API v1 | Deprecated ("Legacy v1 routes… should not be used for new integrations") | None (intentionally) | n/a — no v1 pages exist | Keep out; overview tip covers it |
| Dashboard APIs | Internal | None | robots-disallowed (`/dashboard`) | Keep private |

Fact matrix (volatile claims):

| Claim | Page | Source | Last verified | Status | Action |
|---|---|---|---|---|---|
| "Whats91 public v2 currently does not document a separate public rate limit; Meta WhatsApp Business Platform limits apply" | `/rate-limits` | Authored, defers to Meta | 2026-07-20 (wording review) | Verified-as-qualified | Keep; add Meta-doc link + last-verified date (P2 content task) |
| Changelog release dates (11 Jun 2026 … 03 Jun 2026, v1.2.0…v1.0.0) | `/changelog` | `changelogEntries` | 2026-07-20 | Consistent with repo history; product versions (not API versions) — labeled as platform updates | Keep |
| Token prefix `w91_live_` | `/api-keys` | Authored | Unverifiable here | Unverified against runtime | Requires backend verification |

## 16. Structured Data Findings

- ✅ JSON-LD only (single `@graph`-style array per page); one Organization entity with stable `@id`s; WebSite/TechArticle/publisher linked; BreadcrumbList matches navigation; APIReference with correct `entryPoint` (method + `https://graph.whats91.com/api/v2/...`); FAQPage only where visible FAQs exist. All blocks parse (crawl-verified).
- ❌→✅ **Invalid SearchAction removed**: WebSite schema advertised `…/search?query={search_term_string}` but no `/search` URL exists (returns 404). Claiming a nonexistent search endpoint is an invalid structured-data claim.
- ℹ️ Note (per current guidance): Google retired FAQ rich results for all sites (May 2026). The FAQPage markup no longer earns SERP features but remains useful for AI/LLM citation; retained deliberately.
- ✅ No fake ratings/reviews/offers/pricing, no Product misuse, no unverified partnership claims, no deprecated HowTo.

## 17. Internal Links, Search, GEO, Performance, Accessibility

**Internal links:** crawl of every rendered page found 0 broken internal links, 0 broken prev/next, descriptive anchors throughout (no "Read more").

**Search:** index covers all 68 sections. Exact tokens work (`/api/v2/chat`, `MISSING_TEXT`, `campaignUid`). ❌→✅ **Multi-word queries returned zero results** (phrase-substring matching only): "contact book bulk upload", "Authorization Bearer", "webhook retry", "template media" all → 0. Fixed with token-AND fallback ranked below phrase matches ("contact book bulk upload" → Upload Contacts first; "webhook retry" → Webhook Create/Samples first). Search stays client-side; no indexable search result pages exist (correct).

**GEO/LLM readiness:** `llms.txt` indexes all canonical routes + 11 copy-ready markdown guides; "Copy for LLM" fetches the markdown verbatim (copy output = file content by construction). The ten agent questions (base URL, auth, send text/template, create utility template, webhook setup, delivery inspection, token scope, errors, retries) are all answerable from canonical pages. Machine copies now carry `noindex` so they can't outrank canonical HTML while remaining fully fetchable by AI crawlers (robots.txt explicitly allows GPTBot/ClaudeBot/PerplexityBot etc.).

**Performance:** production TTFB 210–260 ms; HTML 72–95 KB; JS chunks ~1.2 MB total; static prerender; system font stack (no font loading); no third-party scripts. No CWV red flags measurable synthetically; field data requires Search Console/CrUX (listed in plan).

**Accessibility:** one H1 per page (crawl-verified), logical heading hierarchy, labeled copy buttons, `aria-current` on active nav, keyboard-accessible search with visible focus states, reduced-motion handling for smooth scroll, mobile drawer with scroll-lock and Escape-to-close. ❌→✅ Added the missing **skip-to-content link** targeting `main#main-content`. Tables and code blocks scroll within their own containers on small screens.

## 18. Content Duplication

- The 9 base/section duplicate pairs were the only exact-duplicate HTML pages (fixed via canonicals).
- Markdown copies intentionally parallel HTML pages → resolved via `noindex` rather than deletion (AI agents keep access).
- No duplication with the main marketing site was found on doc intents (the portal owns technical intent; whats91.com owns commercial intent — page-to-intent map in the implementation plan).
- Repeated auth headers in runnable examples are necessary repetition and were preserved.

## 19. P0–P3 Register

| ID | Priority | Finding | Status |
|---|---|---|---|
| P0-1 | P0 | 84 corrupted generated SDK examples (curl-in-body; PHP/C#/Python generator bugs) | **Fixed** (generator-level) |
| P0-2 | P0 | 9 duplicate-content pairs with competing self-canonicals, both in sitemap | **Fixed** |
| P1-1 | P1 | WebSite SearchAction targets nonexistent `/search` (404) | **Fixed** (removed) |
| P1-2 | P1 | Machine copies (`llms.txt`, `llms/*.md`, `search-index.json`) indexable | **Fixed** (`X-Robots-Tag: noindex`) |
| P1-3 | P1 | Sitemap `lastmod` false-uniform (2026-06-06) | **Fixed** (real changelog date; others omitted) |
| P1-4 | P1 | Multi-word search queries return zero results | **Fixed** (token-AND fallback) |
| P1-5 | P1 | No skip-to-content link | **Fixed** |
| P1-6 | P1 | SVG-only social image unusable on major platforms | **Mitigated** (PNG fallback); full fix = owner decision |
| P2-1 | P2 | Mixed token placeholders (`w91_public_token_here` ×55 vs `w91_live_xxx`) — 9 test files pin the former | Owner approval needed (test contract change) |
| P2-2 | P2 | CRM company-scoped lead curl lacks Authorization header | Owner verification needed (may be intentional) |
| P2-3 | P2 | Rate-limits page lacks a last-verified date + Meta doc link | Content task (plan) |
| P2-4 | P2 | No frontend-token-exposure warning callout on Authentication | Content task (plan) |
| P3-1 | P3 | `getLegacyRedirects()` in `doc-routes.ts` is dead code (redirects are page-level) — test-pinned, left in place | Backlog |
| P3-2 | P3 | `www` host has no DNS/redirect | Owner decision |

## 20. Acceptance Criteria Status

Every criterion from the assignment §29 was checked; all pass except the two explicitly deferred: unique-per-endpoint OG raster images (owner decision) and runtime contract verification (requires backend repo). Details in §7–§17 and the validation log in `WHATS91_DEVELOPER_SEO_CHANGELOG.md`.
