# Whats91 Developer Portal — SEO & DX Implementation Plan

Date: 2026-07-20. Companion to `WHATS91_DEVELOPER_SEO_AUDIT.md` (findings/evidence) and `WHATS91_DEVELOPER_SEO_CHANGELOG.md` (changes made in this pass).

---

## 1. Immediate fixes (completed in this pass, awaiting review + deploy)

| # | Change | Files |
|---|---|---|
| 1 | SDK example generator repaired (curl-in-body corruption, PHP/Python/C# language bugs) | `src/lib/doc-data.ts` |
| 2 | Category base URLs canonicalize to first-section URL; sitemap deduplicated (77→68) | `src/lib/doc-routes.ts` |
| 3 | Invalid WebSite SearchAction removed | `src/lib/seo.ts` |
| 4 | `X-Robots-Tag: noindex` on `/llms.txt`, `/llms/*`, `/search-index.json` | `next.config.ts` |
| 5 | Accurate sitemap `lastmod` (changelog only, from real release data) | `src/app/sitemap.ts` |
| 6 | Multi-token search matching | `src/lib/search-ranking.mjs` |
| 7 | Skip-to-content link + focusable `main` | `src/components/docs/documentation-page.tsx` |
| 8 | PNG fallback social image after branded SVG | `src/lib/seo.ts`, `src/app/layout.tsx` |

**Deployment prerequisites:** review diff → commit (not done per constraints) → existing deploy flow (`/api/webhooks/deploy` → `scripts/deploy.js`). After deploy: request re-crawl of the 9 formerly-duplicate base URLs in Search Console; resubmit sitemap.

## 2. 30-day plan

1. **Owner decisions** (see §12) — placeholder unification, OG raster image, CRM auth header, `www` DNS.
2. **Snippet validation in CI**: adapt the audit's validation harness (456 snippets; JSON/JS/Python/PHP/shell/C# checks) into `tests/code-examples.test.mjs` so generator or content regressions fail `npm test`. The harness already exists (scratchpad `validate-examples.mjs`); porting is mechanical.
3. **Authentication hardening content**: add a "Keep tokens server-side" callout (never embed `w91_live_…` in frontend JS), token rotation guidance, and error responses for invalid/expired tokens.
4. **Rate-limits freshness**: add link to Meta's current messaging-limits documentation + a "Last verified" date line sourced from a constant, updated on review.
5. Search Console: verify property, submit the 68-URL sitemap, monitor the duplicate-pair consolidation.

## 3. 60-day plan

1. **Endpoint page standard rollout** (audit §14 of assignment): each API page already has H1/summary/prereqs/auth/method/params/examples/errors/related/prev-next; add per-page "Common error responses" tables where missing (several report pages document success shapes only).
2. **Changelog cross-links**: link changelog entries to the affected doc pages and vice versa (e.g., template analytics entries ↔ `/reports/template-analytics`).
3. **Breadcrumb UI**: visible breadcrumbs matching the existing BreadcrumbList JSON-LD (currently schema-only).
4. **OG raster images for pillar pages** (if approved): 1200×630 PNGs for `/overview`, `/messaging`, `/templates/marketing`, `/webhooks/create`, `/reports/all-reports`, generated offline and committed as static assets (respects the "no build-time image generation" constraint).

## 4. 90-day plan

1. **Runtime contract verification loop** with the backend repository: export request validators/serializers (or an OpenAPI spec) from `graph.whats91.com` and diff against `doc-data.ts` API blocks each release; publish `/openapi.json` if the owner wants a machine-readable contract.
2. **Search Console-driven iteration**: fix titles/descriptions on pages with high impressions + low CTR; identify missing query families.
3. **INP/CWV field data** via CrUX once traffic volume permits; act only on field data, not synthetic assumptions.
4. Consider `TechArticle.dateModified` per page once a real per-page modification source exists (e.g., git-log-driven).

## 5. Page-to-intent map (primary task intent per page family)

| Page(s) | Primary developer intent |
|---|---|
| `/overview` | whats91 api documentation / whatsapp business api documentation (brand + category entry) |
| `/quickstart` | whats91 api quick start / send first whatsapp api message |
| `/authentication` | whats91 bearer token / whatsapp api authentication |
| `/api-keys` | whats91 api key / create whatsapp api token |
| `/rate-limits` | whatsapp api rate limits |
| `/messaging` (→ `/messaging` canonical) | send whatsapp message api |
| `/messaging/template-send` | send whatsapp template api |
| `/messaging/chat-text` | whatsapp text message api |
| `/messaging/chat-media` | whatsapp media message api |
| `/messaging/chat-interactive` | whatsapp interactive button api / list message api |
| `/messaging/meta-compatibility*` | whatsapp cloud api compatible endpoint |
| `/templates/marketing`, `/utility`, `/authentication` | whatsapp template creation api (per category) |
| `/webhooks/create`, `/samples`, `/examples` | whatsapp webhook documentation / delivery status webhook |
| `/reports/*` | whatsapp delivery status api, campaign report api, delivery analytics |
| `/message-billing/*` | whatsapp api message billing / conversation pricing report |
| `/chatbots/*` | whatsapp chatbot api |
| `/contact-books/*` | whatsapp contact book api / bulk upload contacts |
| `/blacklist/*` | whatsapp blacklist / opt-out api |
| `/conversations/*` | whatsapp conversation api |
| `/crm/*` | whatsapp crm lead api |
| `/changelog` | whats91 api changelog |

No search volumes/difficulties are claimed — these are task-intent assignments only, one primary intent per page, no cross-page cannibalization.

## 6. Documentation clusters & internal-link plan

Clusters (pillar → children) already match the sidebar; the link rules to enforce as content evolves:
- Every child links: its pillar, `/authentication`, an error-handling anchor, the next operation in its workflow, and the relevant webhook/report page.
- Getting-started pillar: `/overview` → quickstart → authentication → rate-limits (+ errors anchor).
- Messaging: `/messaging` → template-send → chat-text → chat-media → chat-interactive → meta-compatibility; cross-links to `/templates/marketing`, `/reports/message-status`, `/webhooks/create` (already present via related blocks).
- Webhooks: create → samples → examples; cross to `/reports/message-status` and messaging sends.
- Reports: all-reports pillar → status/history/campaign family → analytics family; cross to billing.
- Keep descriptive anchors (current state already complies).

## 7. Version strategy

- v2 is the only public documented surface; keep the "v1 deprecated" tip on `/overview` and never publish v1 pages.
- Meta-compatibility (`/api/v2/messages`) stays documented as a compatibility surface with its own section — do not canonicalize it to native messaging pages (materially different contract).
- If v3 ever ships: new URL space (`/v3/...` docs), explicit version badges, migration guide, no cross-version canonicals.

## 8. Code-example validation strategy

- Source of truth for bodies: the JSON request block, else the curl `-d` payload (now parsed, not string-pasted).
- CI gate (30-day item): run the harness on every PR; fail on any parse/compile error or bare `true/false/null` in Python.
- Rule for authors: every new POST/PUT endpoint section should include an explicit `json` request block; curl-only is acceptable but the `-d` payload must be valid JSON (the generator and CI both depend on it).
- C#: no compiler in CI environment — structural lints (raw-string pairing, escapes, usings); optionally add `dotnet build` validation if a runner with the SDK is available.

## 9. Measurement plan

- Search Console: index coverage of the 68 canonical URLs; disappearance of the 9 base URLs from indexed duplicates; CTR/impressions per family monthly.
- Leading indicators (no re-audit needed): sitemap URL count stays 68; `site:developers.whats91.com` shows no `/llms/` results; zero corrupted-snippet reports.
- CI: 161+ tests green including future snippet-validation suite.

## 10. Dependencies

- Backend repository (or OpenAPI export) for contract verification.
- Search Console + analytics access for measurement.
- Deploy pipeline (existing webhook) for shipping this pass.

## 11. Risks

- Canonical consolidation temporarily reshuffles which URL Google shows for 9 families (expected, beneficial; monitor 2–4 weeks).
- `noindex` on markdown copies: if any external site deep-links `/llms/*.md` for rankings (unlikely), those pages drop out of search — intended.
- Generator rewrite alters rendered SDK text sitewide — mitigated by 456-snippet validation + full crawl + tests.

## 12. Owner decisions required

1. **OG raster image**: replace SVG-only social images with committed 1200×630 PNGs (requires relaxing the test that pins the SVG-only design)? Current mitigation: PNG logo fallback.
2. **Token placeholder unification**: standardize authored examples on the documented `w91_live_…` format (9 test files pin `w91_public_token_here`).
3. **CRM company-scoped lead endpoint**: is the missing `Authorization` header in its curl example intentional (public capture endpoint) or an omission?
4. **`www` subdomain**: add DNS + 301 to apex, or leave unresolvable.
5. **Auth body aliases** (`authToken`/`auth_token`/`token`): keep documenting all three, or steer to header-only?
