# Whats91 Developer Portal — SEO/DX Change Log (2026-07-20 audit pass)

Every change below was validated with: `npm run lint` (pass), `npx tsc --noEmit` (pass), `npm test` (161/161 pass), `npm run build` (93/93 pages), a full crawl of the production-mode standalone server (68 sitemap URLs → all 200, one self-canonical each, 68 unique titles + descriptions, all JSON-LD parsing, 0 broken internal/prev-next links), and a 456-snippet code-example validation harness (0 failures). Nothing was committed, pushed, deployed, or restarted.

---

## 1. `src/lib/doc-data.ts` — SDK example generator repair (P0)

- **Previous behaviour:** `extractRequestBody()` fell back to the first request block of any language; for the 16 POST/PUT sections documented with curl-only requests, the entire curl command became the "body", producing `curl` nested inside `JSON.stringify()` (JS), `json=` (Python), `json_encode()` (PHP), a C# raw string, and a second `curl -d`. Independently: the PHP template injected raw JSON into `json_encode()` (invalid PHP whenever a body existed), the C# template opened a single-line raw string for multi-line JSON and escaped quotes inside it (both invalid C#), and Python received raw JSON (`true/false/null` are not Python literals). Net effect: 84 of 265 generated SDK snippets on 18 live endpoint pages were invalid.
- **New behaviour:** the body is parsed JSON taken from the JSON request block, else extracted from the documented curl `-d`/`--data`/`--data-raw` payload (validated with `JSON.parse`); when no parseable body exists the example sends none. Each language renders the parsed body natively: JS object literal inside `JSON.stringify`, Python literal via `toPythonLiteral` (`True`/`False`/`None`), PHP associative array via `toPhpLiteral`, C# multi-line raw string literal (content on its own lines, no escaping) with `using System.Text;`, and clean pretty-printed JSON in curl. Bodyless requests no longer send a `Content-Type` header.
- **Reason:** invalid examples on every affected endpoint page break copy-paste integration, harm content quality signals, and teach AI coding agents corrupted code.
- **Impact:** SEO (content quality) + DX (runnable examples) on 53 endpoint pages.
- **Risk:** Low — generator-only; authored content untouched; verified by per-language syntax validation of all 456 snippets and rendered-DOM inspection.
- **Rollback:** revert this file's `getSdkExamplesForSection`/`extractRequestBody` region.

## 2. `src/lib/doc-routes.ts` — canonical deduplication (P0)

- **Previous behaviour:** `resolveRoutedDoc(category)` (no section) returned `canonicalPath` = the category base path, while the first section's own URL returned its section path. Nine categories without `firstSectionAtBase` therefore served identical content at two URLs, each claiming itself canonical, and `getIndexableDocRoutes()` emitted both into the sitemap (77 URLs).
- **New behaviour:** `canonicalPath` is always the section's path (`getSectionPath`), so `/templates` declares `/templates/marketing` canonical (and so on for webhooks, reports, message-billing, chatbots, contact-books, blacklist, conversations, crm); `getIndexableDocRoutes()` keys the base route by its canonical path, deduplicating the sitemap to 68 canonical-only URLs. Categories with `firstSectionAtBase` (overview, messaging, meta-compatibility) and the single-page changelog are unchanged.
- **Reason:** duplicate content with competing self-canonicals splits ranking signals and bloats the sitemap.
- **Impact:** consolidates equity onto one URL per document; sitemap now contains only canonical, indexable pages.
- **Risk:** Low — no URL removed or redirected; base URLs still return 200. Breadcrumb/OG URLs follow the canonical automatically.
- **Rollback:** restore `canonicalPath: sectionSlug ? … : routeConfig.canonicalPath` and `routes.set(routeConfig.canonicalPath, firstRoute)`.

## 3. `src/lib/seo.ts` — SearchAction removal + social image fallback (P1)

- **Previous behaviour:** WebSite JSON-LD advertised a `SearchAction` targeting `https://developers.whats91.com/search?query={search_term_string}`; that URL returns 404 (search is an in-page dialog). OG/Twitter metadata listed only SVG images, which Facebook/X/LinkedIn/WhatsApp cannot render.
- **New behaviour:** SearchAction removed (with an explanatory comment). A PNG fallback (`/icons/icon-512.png`, 512×512) is listed after the branded SVG in both OG and Twitter image arrays so SVG-incapable platforms still get a preview.
- **Reason:** structured data must not claim nonexistent functionality; link previews should not silently fail on major platforms.
- **Risk:** Low — schema removal only deletes an invalid claim; the fallback is additive.
- **Rollback:** restore the `potentialAction` block; drop the second image entries.

## 4. `src/app/layout.tsx` — social image fallback on root metadata (P1)

- **Previous/new behaviour & reason:** same as the fallback part of change 3, applied to the site-default metadata. (File also carries pre-existing, unrelated uncommitted redesign work — only the `images` arrays were touched.)
- **Rollback:** remove the two `icon-512.png` entries.

## 5. `next.config.ts` — noindex for machine-readable copies (P1)

- **Previous behaviour:** `/llms.txt`, `/llms/*.md` (11 guides), and `/search-index.json` were served 200 with no robots directives — indexable duplicates of canonical HTML.
- **New behaviour:** these paths send `X-Robots-Tag: noindex`. They remain fully fetchable (robots.txt deliberately still allows crawling so AI agents keep access).
- **Reason:** machine copies must not compete with canonical pages in search results.
- **Risk:** Low — headers only; no content or route change.
- **Rollback:** delete the three header entries.

## 6. `src/app/sitemap.ts` — truthful lastmod (P1)

- **Previous behaviour:** every URL carried `lastModified: new Date('2026-06-06')` — already contradicted by changelog entries dated 2026-06-11.
- **New behaviour:** the changelog URL carries the date of the newest `changelogEntries` item (derived, not hardcoded); other URLs omit `lastmod` rather than assert an unverifiable date. `changeFrequency`/`priority` unchanged.
- **Reason:** wrong lastmod is worse than none; search engines discount unreliable dates.
- **Risk:** Low.
- **Rollback:** restore the fixed-date map.

## 7. `src/lib/search-ranking.mjs` — multi-token search (P1)

- **Previous behaviour:** ranking required the whole query as one substring; real developer queries ("contact book bulk upload", "Authorization Bearer", "webhook retry", "template media") returned zero results.
- **New behaviour:** when the exact phrase misses, entries containing **every** query token (across title/category/description/content) match, scored below phrase matches and boosted by title/category token hits. Single-word behaviour and existing ranking tests unchanged (161/161 pass).
- **Reason:** zero-result multi-word search is a direct DX failure.
- **Risk:** Low — additive fallback branch.
- **Rollback:** remove the `queryTokens` fallback block.

## 8. `src/components/docs/documentation-page.tsx` — skip link (P1, accessibility)

- **Previous behaviour:** no skip navigation; keyboard/screen-reader users had to traverse the header and full sidebar on every page.
- **New behaviour:** a visually-hidden-until-focused "Skip to content" link targets `main#main-content` (`tabIndex={-1}` for focus handoff). (File also carries pre-existing redesign work; this edit is additive.)
- **Reason:** WCAG 2.4.1 bypass blocks.
- **Risk:** Low.
- **Rollback:** remove the anchor and the `id`/`tabIndex` on `main`.

---

## Validation record (exact commands, final state)

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Passed |
| Types | `npx tsc --noEmit` | Passed |
| Unit/content tests | `npm test` | Passed — 161/161 |
| Production build | `npm run build` | Passed — 93/93 pages |
| Production server | `node server.js` (standalone, port 4319) | Served |
| Full route/canonical/metadata/JSON-LD/link crawl | `crawl.py` against local prod server | Passed — 0 issues (68 URLs; unique titles/descriptions; 0 broken links; JSON-LD parses; base pages canonicalize correctly; machine endpoints noindexed; redirects 308; unknown URL → 404) |
| Code examples | `validate-examples.mjs` | Passed — 456 snippets, 0 failures (curl/JSON/JS/Python/PHP validated with real parsers; C# via structural lints — no compiler available) |
| Rendered verification | Browser DOM inspection of `/messaging/template-send` on local prod build | Passed — 0 corrupted blocks; correct Node.js example rendered |
| Integration tests / docs-link validators | — | Not available as separate suites (covered by the node:test suite + crawl above) |
| Live-API example execution | — | Not executed (deliberately; no live messages, no real credentials) |

Classification of every assignment §27 item: 1–7, 9–19 **Passed** (as mapped above); 8 **Passed** (standalone server); 20–21 mobile/desktop smoke **Passed** (browser pane, both themes); 22 accessibility smoke **Passed** (crawl h1 check + skip link + keyboard dialog); 23 performance comparison **Passed with note** (prod TTFB 210–260 ms baseline; local build equivalent; no field data — requires CrUX/GSC); 24 diff review **Passed** (only the 8 files above + 3 docs; pre-existing redesign preserved).
