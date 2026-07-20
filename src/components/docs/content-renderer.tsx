'use client'

import { Fragment, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import type { ElementType } from 'react'
import { useDocStore } from '@/lib/doc-store'
import {
  getRelatedSectionsForSection,
  getSdkExamplesForSection,
  getSectionFaqs,
  getSectionPrerequisites,
  getSectionSummary,
  getCategoryForSection,
  getSectionById,
  isApiSection,
  type ContentBlock,
  type CodeBlock as CodeBlockType,
  type ApiParameter,
  type DocSectionData,
} from '@/lib/doc-data'
import { getAdjacentDocRoutes, getPathForSectionId } from '@/lib/doc-routes'
import { highlightCode } from '@/lib/code-highlight.mjs'
import { getLlmCopyDocForCategory, getLlmCopyDocForSection, type LlmCopyDoc } from '@/lib/llm-copy-docs'
import { Copy, Check, Info, AlertTriangle, Lightbulb, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Gauge, Sparkles } from 'lucide-react'

// ---------------------------------------------------------------------------
// Pre-compute heading IDs for a section's content (same logic as tocData)
// ---------------------------------------------------------------------------
function computeHeadingIds(content: ContentBlock[]): Map<number, string> {
  const map = new Map<number, string>()
  let counter = 0

  content.forEach((block, index) => {
    if (block.type === 'heading' && block.level && block.text) {
      counter++
      const slug = block.text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      map.set(index, `${slug}-${counter}`)
    }
  })

  return map
}

// ---------------------------------------------------------------------------
// Copy Button
// ---------------------------------------------------------------------------
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#8b949e] transition-colors hover:bg-white/10 hover:text-white"
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-[#7ee0b4]" />
          <span className="text-[#7ee0b4]">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Code Block
// ---------------------------------------------------------------------------
function CodeBlock({ language, code, label }: { language: string; code: string; label?: string }) {
  const langLabel = label || language

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-code-border shadow-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-code-border bg-code-header py-1.5 pl-4 pr-2">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#8b949e]">
          {langLabel}
        </span>
        <CopyButton text={code} />
      </div>
      {/* Code content */}
      <pre className="code-block !mt-0 !rounded-none !border-0">
        <code
          dangerouslySetInnerHTML={{
            __html: highlightCode(code, language),
          }}
        />
      </pre>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Collapsible Code Block (for API request/response)
// ---------------------------------------------------------------------------
function CollapsibleCodeBlock({
  blocks,
  title,
  defaultOpen = false,
}: {
  blocks: CodeBlockType[]
  title: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  if (!blocks || blocks.length === 0) return null

  return (
    <div className="my-3">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mb-2 flex items-center gap-1.5 text-sm font-medium text-mist transition-colors hover:text-ink"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span>{title}</span>
      </button>
      {open && (
        <div className="space-y-3">
          {blocks.map((block, i) => (
            <CodeBlock
              key={i}
              language={block.language}
              code={block.code}
              label={block.label}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// API Endpoint Card
// ---------------------------------------------------------------------------
function ApiEndpointCard({ block }: { block: ContentBlock }) {
  const method = block.method || 'GET'
  const endpoint = block.endpoint || ''
  const request = block.request
  const response = block.response
  const parameters = block.parameters

  const methodClass =
    method === 'GET'
      ? 'method-get'
      : method === 'POST'
        ? 'method-post'
        : method === 'PUT'
          ? 'method-put'
          : 'method-delete'

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-hairline bg-card shadow-sm">
      {/* Endpoint header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-hairline bg-surface/60 px-4 py-3">
        <span
          className={`${methodClass} rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide`}
        >
          {method}
        </span>
        <code className="!border-0 !bg-transparent !p-0 font-mono text-[13.5px] font-medium text-ink">
          {endpoint}
        </code>
      </div>

      <div className="space-y-2 p-4 sm:p-5">
        {/* Parameters */}
        {parameters && parameters.length > 0 && (
          <ParamTable params={parameters} />
        )}

        {/* Request */}
        {request && request.length > 0 && (
          <CollapsibleCodeBlock blocks={request} title="Request" defaultOpen={true} />
        )}

        {/* Response */}
        {response && response.length > 0 && (
          <CollapsibleCodeBlock blocks={response} title="Response" defaultOpen={!!response} />
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Parameter Table
// ---------------------------------------------------------------------------
function ParamTable({ params }: { params: ApiParameter[] }) {
  return (
    <div className="doc-scroll my-4 overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline bg-surface/70">
            <th className="py-2.5 pl-4 pr-4 text-left text-[13px] font-semibold text-ink">
              Parameter
            </th>
            <th className="py-2.5 pr-4 text-left text-[13px] font-semibold text-ink">
              Type
            </th>
            <th className="py-2.5 pr-4 text-left text-[13px] font-semibold text-ink">
              Required
            </th>
            <th className="py-2.5 pr-4 text-left text-[13px] font-semibold text-ink">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr
              key={param.name}
              className="border-b border-hairline-soft last:border-0"
            >
              <td className="py-3 pl-4 pr-4 align-top">
                <code className="whitespace-nowrap text-[12.5px] font-medium">
                  {param.name}
                </code>
              </td>
              <td className="py-3 pr-4 align-top">
                <span className="whitespace-nowrap font-mono text-xs text-mist">
                  {param.type}
                </span>
              </td>
              <td className="py-3 pr-4 align-top">
                {param.required ? (
                  <span className="whitespace-nowrap rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand-strong">
                    Required
                  </span>
                ) : (
                  <span className="whitespace-nowrap rounded-full bg-surface px-2 py-0.5 text-xs text-faint">
                    Optional
                  </span>
                )}
              </td>
              <td className="min-w-[200px] py-3 pr-4 align-top text-[13.5px] leading-relaxed text-mist">
                {param.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Callout
// ---------------------------------------------------------------------------
function Callout({ block }: { block: ContentBlock }) {
  const variant = block.variant || 'info'
  const text = block.text || ''

  const config = {
    info: {
      container: 'border-info/30 bg-info/[0.06]',
      icon: 'text-info',
      title: 'Note',
      Icon: Info,
    },
    warning: {
      container: 'border-warn/30 bg-warn/[0.06]',
      icon: 'text-warn',
      title: 'Warning',
      Icon: AlertTriangle,
    },
    tip: {
      container: 'border-brand/30 bg-brand/[0.06]',
      icon: 'text-brand-strong',
      title: 'Tip',
      Icon: Lightbulb,
    },
    danger: {
      container: 'border-danger/30 bg-danger/[0.06]',
      icon: 'text-danger',
      title: 'Important',
      Icon: AlertCircle,
    },
  }

  const { container, icon, title, Icon } = config[variant]

  return (
    <div className={`my-6 flex gap-3 rounded-xl border p-4 ${container}`}>
      <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="min-w-0">
        <p className={`m-0 mb-0.5 text-[13px] font-semibold ${icon}`}>{title}</p>
        <p className="m-0 text-sm leading-relaxed text-foreground/90">{text}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------
function DataTable({ block }: { block: ContentBlock }) {
  const headers = block.headers || []
  const rows = block.rows || []

  return (
    <div className="doc-scroll my-6 overflow-x-auto rounded-xl border border-hairline">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline bg-surface/70">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2.5 text-left text-[13px] font-semibold text-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-hairline-soft transition-colors last:border-0 hover:bg-surface/40"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 align-top text-[13.5px] leading-relaxed text-foreground/90"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Card Grid
// ---------------------------------------------------------------------------
function CardGrid({ block }: { block: ContentBlock }) {
  const cards = block.cards || []

  if (cards.length === 0) return null

  const toneConfig = {
    green: {
      chip: 'bg-brand/10 text-brand-strong',
      accent: 'var(--brand)',
    },
    blue: {
      chip: 'bg-info/10 text-info',
      accent: 'var(--info)',
    },
    amber: {
      chip: 'bg-warn/10 text-warn',
      accent: 'var(--warn)',
    },
    red: {
      chip: 'bg-danger/10 text-danger',
      accent: 'var(--danger)',
    },
    slate: {
      chip: 'bg-surface text-mist',
      accent: 'var(--faint)',
    },
  }

  return (
    <div data-doc-card-grid className="my-6 grid gap-4 sm:grid-cols-2">
      {cards.map((card) => {
        const tone = card.tone || 'slate'
        const colors = toneConfig[tone]

        return (
          <article
            key={card.title}
            data-doc-card
            className="relative overflow-hidden rounded-xl border border-hairline bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{ backgroundColor: colors.accent }}
              aria-hidden="true"
            />
            <div className="mb-3 flex items-start justify-between gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colors.chip}`}
                aria-hidden="true"
              >
                <Gauge className="h-4 w-4" />
              </div>
              {card.value && (
                <span className="rounded-lg border border-hairline bg-surface px-2.5 py-1 text-right font-mono text-[12px] font-semibold text-ink">
                  {card.value}
                </span>
              )}
            </div>
            <h3 className="mb-1.5 text-[16px] font-semibold leading-snug text-ink">
              {card.title}
            </h3>
            <p className="m-0 text-[13.5px] leading-relaxed text-mist">
              {card.description}
            </p>
          </article>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------
function DocList({ block }: { block: ContentBlock }) {
  const items = block.items || []
  const ordered = (block as { ordered?: boolean }).ordered

  const listClass = 'my-4 space-y-2 pl-5'
  const itemClass = 'text-[15px] leading-[1.75] text-foreground/90 marker:text-faint'

  if (ordered) {
    return (
      <ol className={`${listClass} list-decimal`}>
        {items.map((item, i) => (
          <li key={i} className={itemClass}>
            {item}
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ul className={`${listClass} list-disc`}>
      {items.map((item, i) => (
        <li key={i} className={itemClass}>
          {item}
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Steps (numbered step list)
// ---------------------------------------------------------------------------
function StepsList({ block }: { block: ContentBlock }) {
  const items = block.items || []

  return (
    <ol className="my-6 space-y-4">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand-strong">
            {i + 1}
          </span>
          <span className="pt-0.5 text-[15px] leading-[1.75] text-foreground/90">
            {item}
          </span>
        </li>
      ))}
    </ol>
  )
}

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------
function Heading({ block, headingId }: { block: ContentBlock; headingId: string }) {
  const level = block.level || 2
  const text = block.text || ''

  const styles: Record<number, string> = {
    1: 'text-[1.9rem] sm:text-[2.25rem] font-semibold leading-[1.15] tracking-[-0.02em]',
    2: 'text-[1.4rem] sm:text-[1.5rem] font-semibold leading-snug tracking-[-0.015em] mt-12 mb-4 border-t border-hairline-soft pt-10 first:mt-0 first:border-0 first:pt-0',
    3: 'text-[1.15rem] sm:text-[1.2rem] font-semibold leading-snug tracking-[-0.01em] mt-10 mb-3',
    4: 'text-[1rem] font-semibold leading-snug mt-8 mb-2',
  }

  const Tag = `h${level}` as ElementType

  return (
    <Tag id={headingId} className={`${styles[level] || styles[4]} scroll-mt-24 text-ink`}>
      {text}
    </Tag>
  )
}

// ---------------------------------------------------------------------------
// Content Block Renderer
// ---------------------------------------------------------------------------
function ContentBlockRenderer({
  block,
  blockIndex,
  headingIdMap,
}: {
  block: ContentBlock
  blockIndex: number
  headingIdMap: Map<number, string>
}) {
  switch (block.type) {
    case 'heading':
      return <Heading block={block} headingId={headingIdMap.get(blockIndex) || ''} />

    case 'paragraph':
      return (
        <p className="my-4 text-[15px] leading-[1.8] text-foreground/90">
          {block.text}
        </p>
      )

    case 'code':
      return (
        <CodeBlock
          language={block.language || 'text'}
          code={block.code || ''}
          label={block.label}
        />
      )

    case 'api':
      return <ApiEndpointCard block={block} />

    case 'callout':
      return <Callout block={block} />

    case 'table':
      return <DataTable block={block} />

    case 'cards':
      return <CardGrid block={block} />

    case 'list':
      return <DocList block={block} />

    case 'divider':
      return <hr className="my-10 border-hairline" />

    default:
      return null
  }
}

function RelatedApis({ section }: { section: DocSectionData }) {
  const relatedSections = getRelatedSectionsForSection(section.id)
  const relatedSectionIds = relatedSections.map((relatedSection) => relatedSection.id)
  const heading = isApiSection(section) ? 'Related APIs' : 'Related Documentation'

  if (relatedSections.length === 0) return null

  return (
    <section
      className="mt-14 border-t border-hairline pt-10"
      data-related-section-count={relatedSectionIds.length}
    >
      <h2 className="mb-5 text-[1.4rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {relatedSections.map((relatedSection) => {
          const path = getPathForSectionId(relatedSection.id) ?? '/'

          return (
            <a
              key={relatedSection.id}
              href={path}
              className="group rounded-xl border border-hairline bg-card p-4 transition-all hover:border-brand/50 hover:shadow-sm"
            >
              <h3 className="mb-1 flex items-center gap-1.5 text-[14.5px] font-semibold text-ink transition-colors group-hover:text-brand-strong">
                {relatedLinkLabel(relatedSection)}
                <ChevronRight className="h-3.5 w-3.5 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-brand-strong" />
              </h3>
              <p className="m-0 line-clamp-2 text-[13px] leading-relaxed text-mist">
                {relatedSection.description}
              </p>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function relatedLinkLabel(section: DocSectionData): string {
  const category = getCategoryForSection(section.id)
  const isCategoryBase = category?.sections[0]?.id === section.id

  if (isCategoryBase && category.id !== 'getting-started') {
    return category.label
  }

  return section.title
}

const pageNavigationLabelOverrides: Record<string, string> = {
  'messaging-overview': 'Overview',
  'messaging-template-send': 'Send Template',
}

function pageNavigationLabel(item: { sectionId: string; title: string }): string {
  return pageNavigationLabelOverrides[item.sectionId] ?? item.title
}

function PageNavigation({ section }: { section: DocSectionData }) {
  const { previous, next } = getAdjacentDocRoutes(section.id)

  if (!previous && !next) return null

  return (
    <nav
      aria-label="Documentation page navigation"
      className="mt-12 grid gap-3 border-t border-hairline pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <a
          href={previous.path}
          className="group flex min-h-[76px] items-center gap-3 rounded-xl border border-hairline bg-card p-4 text-left transition-all hover:border-brand/50 hover:shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-faint transition-all group-hover:-translate-x-0.5 group-hover:text-brand-strong" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              Previous
            </div>
            <div className="mt-1 truncate text-[14.5px] font-semibold text-ink transition-colors group-hover:text-brand-strong">
              Previous: {pageNavigationLabel(previous)}
            </div>
          </div>
        </a>
      ) : (
        <div className="hidden sm:block" aria-hidden="true" />
      )}

      {next ? (
        <a
          href={next.path}
          className="group flex min-h-[76px] items-center justify-between gap-3 rounded-xl border border-hairline bg-card p-4 text-right transition-all hover:border-brand/50 hover:shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              Next
            </div>
            <div className="mt-1 truncate text-[14.5px] font-semibold text-ink transition-colors group-hover:text-brand-strong">
              Next: {pageNavigationLabel(next)}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-faint transition-all group-hover:translate-x-0.5 group-hover:text-brand-strong" />
        </a>
      ) : null}
    </nav>
  )
}

function SummaryBlock({ section }: { section: DocSectionData }) {
  const summary = getSectionSummary(section)
  const prerequisites = getSectionPrerequisites(section)
  const relatedSections = getRelatedSectionsForSection(section.id, 4)

  return (
    <section
      aria-labelledby="doc-summary-heading"
      data-doc-summary
      className="my-8 rounded-xl border border-brand/20 bg-brand/[0.04] p-5 sm:p-6"
    >
      <h2
        id="doc-summary-heading"
        className="mb-2.5 flex items-center gap-2 text-[15px] font-semibold leading-tight text-ink"
      >
        <Sparkles className="h-4 w-4 text-brand-strong" aria-hidden="true" />
        Summary
      </h2>
      <p className="m-0 text-[14.5px] leading-relaxed text-foreground/85">
        {summary}
      </p>

      {prerequisites.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-strong">
            Prerequisites
          </h3>
          <ul className="m-0 list-disc space-y-1 pl-5 text-[13.5px] leading-relaxed text-foreground/85 marker:text-brand/60">
            {prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {relatedSections.length > 0 && (
        <div className="mt-5">
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-strong">
            Related documentation
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedSections.map((relatedSection) => {
              const path = getPathForSectionId(relatedSection.id) ?? '/'

              return (
                <a
                  key={relatedSection.id}
                  href={path}
                  className="rounded-full border border-hairline bg-card px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors hover:border-brand/50 hover:text-brand-strong"
                >
                  {relatedLinkLabel(relatedSection)}
                </a>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}

function FaqSection({ section }: { section: DocSectionData }) {
  const faqs = getSectionFaqs(section)

  if (faqs.length === 0) return null

  return (
    <section id="faq" className="mt-14 border-t border-hairline pt-10" data-doc-faq>
      <h2 className="mb-5 text-[1.4rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-hairline-soft overflow-hidden rounded-xl border border-hairline bg-card">
        {faqs.map((faq) => (
          <article key={faq.question} className="p-4 sm:p-5">
            <h3 className="mb-1.5 text-[14.5px] font-semibold leading-snug text-ink">
              {faq.question}
            </h3>
            <p className="m-0 text-[13.5px] leading-relaxed text-mist">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

type CopyForLlmStatus = 'idle' | 'copying' | 'copied' | 'failed'

function copyTextWithTextarea(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    document.execCommand('copy')
    return true
  } finally {
    document.body.removeChild(textarea)
  }
}

function CopyForLlmButton({
  doc,
  placement = 'block',
}: {
  doc: LlmCopyDoc
  placement?: 'block' | 'heading'
}) {
  const [status, setStatus] = useState<CopyForLlmStatus>('idle')
  const isHeadingPlacement = placement === 'heading'

  const handleCopy = useCallback(async () => {
    setStatus('copying')

    try {
      const response = await fetch(doc.path)
      if (!response.ok) throw new Error(`Unable to load ${doc.path}`)

      const markdown = await response.text()

      try {
        await navigator.clipboard.writeText(markdown)
      } catch {
        const copied = copyTextWithTextarea(markdown)
        if (!copied) throw new Error('Clipboard fallback failed')
      }

      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2200)
    } catch {
      setStatus('failed')
      window.setTimeout(() => setStatus('idle'), 2600)
    }
  }, [doc.path])

  const label =
    status === 'copying'
      ? 'Copying...'
      : status === 'copied'
        ? 'Copied'
        : status === 'failed'
          ? 'Copy failed'
          : 'Copy for LLM'

  return (
    <div className={isHeadingPlacement ? 'mt-1 shrink-0 sm:mt-2' : 'mb-8'}>
      <button
        type="button"
        onClick={handleCopy}
        disabled={status === 'copying'}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-hairline bg-card px-3.5 py-2 text-[13px] font-semibold text-ink shadow-sm transition-colors hover:border-brand/50 hover:bg-brand/[0.05] disabled:cursor-not-allowed disabled:opacity-70"
        aria-label={`${label}: ${doc.label}`}
        data-llm-copy-path={doc.path}
      >
        {status === 'copied' ? (
          <Check className="h-4 w-4 text-brand-strong" />
        ) : (
          <Sparkles className="h-4 w-4 text-brand-strong" />
        )}
        <span>{label}</span>
      </button>
      {!isHeadingPlacement && (
        <p className="mt-2 max-w-[680px] text-[13px] leading-relaxed text-mist">
          Copies the {doc.label} markdown so an LLM can generate or debug Messaging API code.
        </p>
      )}
    </div>
  )
}

function SdkExamples({ section }: { section: DocSectionData }) {
  const sdkExamples = getSdkExamplesForSection(section)

  if (sdkExamples.length === 0) return null

  return (
    <section className="mt-14 border-t border-hairline pt-10">
      <h2 className="mb-3 text-[1.4rem] font-semibold leading-snug tracking-[-0.015em] text-ink">
        SDK Examples
      </h2>
      <p className="text-[14.5px] leading-relaxed text-mist">
        Use these examples as starting points for server-side implementations.
      </p>
      <div className="space-y-4">
        {sdkExamples.map((example) => (
          <CodeBlock
            key={example.label ?? example.language}
            language={example.language}
            code={example.code}
            label={example.label}
          />
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main Content Renderer
// ---------------------------------------------------------------------------
interface ContentRendererProps {
  sectionId?: string
}

export function ContentRenderer({ sectionId }: ContentRendererProps) {
  const storeActiveSection = useDocStore((s) => s.activeSection)
  const contentRef = useRef<HTMLDivElement>(null)

  const activeSection = sectionId ?? storeActiveSection
  const section = getSectionById(activeSection)

  // Pre-compute heading IDs using useMemo (same logic as tocData)
  const headingIdMap = useMemo(() => {
    if (!section) return new Map<number, string>()
    return computeHeadingIds(section.content)
  }, [section])

  const summaryAfterIndex = useMemo(() => {
    if (!section) return -1
    return section.content.findIndex((block) => block.type === 'heading' && (block.level ?? 2) === 1)
  }, [section])

  // Jump to top when section changes (instant, so it doesn't fight smooth anchors)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [activeSection])

  if (!section) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-faint">Section not found.</p>
      </div>
    )
  }

  const llmCopyDoc =
    getLlmCopyDocForSection(section.id) ??
    getLlmCopyDocForCategory(section.category)

  return (
    <div ref={contentRef} id="doc-content" className="mx-auto w-full max-w-[960px]">
      {/* Description / subtitle */}
      {section.description && (
        <p className="-mt-2 mb-8 text-[16.5px] leading-relaxed text-mist">
          {section.description}
        </p>
      )}

      {/* Content blocks */}
      <div className="space-y-0">
        {section.content.map((block, i) => {
          const shouldInsertSummary = i === summaryAfterIndex
          const shouldShowLlmActionInHeading =
            shouldInsertSummary && llmCopyDoc && block.type === 'heading' && (block.level ?? 2) === 1

          return (
            <Fragment key={i}>
              {shouldShowLlmActionInHeading ? (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <ContentBlockRenderer block={block} blockIndex={i} headingIdMap={headingIdMap} />
                  <CopyForLlmButton doc={llmCopyDoc} placement="heading" />
                </div>
              ) : (
                <ContentBlockRenderer block={block} blockIndex={i} headingIdMap={headingIdMap} />
              )}
              {shouldInsertSummary && (
                <SummaryBlock section={section} />
              )}
            </Fragment>
          )
        })}
      </div>

      {isApiSection(section) && <SdkExamples section={section} />}
      <FaqSection section={section} />
      <RelatedApis section={section} />
      <PageNavigation section={section} />

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  )
}
