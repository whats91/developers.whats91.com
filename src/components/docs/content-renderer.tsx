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
      className="flex items-center gap-1 text-xs text-[#b3b3b3] hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
      aria-label={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span>Copied!</span>
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
    <div className="rounded-md overflow-hidden my-6 border border-[#1f1f1f]">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-[#1c1c1e] px-4 py-2 border-b border-[#1f1f1f]">
        <span className="text-xs text-[#b3b3b3] font-medium">{langLabel}</span>
        <CopyButton text={code} />
      </div>
      {/* Code content */}
      <pre className="code-block !rounded-none !mt-0 !border-0">
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
        className="flex items-center gap-1.5 text-sm text-[#b3b3b3] hover:text-white transition-colors mb-2"
      >
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <span className="font-medium">{title}</span>
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
    <div className="my-6 border border-[#e5e5e5] dark:border-[#1f1f1f] rounded-md overflow-hidden">
      {/* Endpoint header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#fafafa] dark:bg-[#1c1c1e] border-b border-[#e5e5e5] dark:border-[#1f1f1f]">
        <span
          className={`${methodClass} text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide`}
        >
          {method}
        </span>
        <code className="text-sm font-mono text-[#0a0a0a] dark:text-[#e5e5e5]">
          {endpoint}
        </code>
      </div>

      <div className="p-4 space-y-2">
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
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#e5e5e5] dark:border-[#1f1f1f]">
            <th className="text-left py-2 pr-4 font-semibold text-[#0a0a0a] dark:text-white">
              Parameter
            </th>
            <th className="text-left py-2 pr-4 font-semibold text-[#0a0a0a] dark:text-white">
              Type
            </th>
            <th className="text-left py-2 pr-4 font-semibold text-[#0a0a0a] dark:text-white">
              Required
            </th>
            <th className="text-left py-2 font-semibold text-[#0a0a0a] dark:text-white">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, i) => (
            <tr
              key={param.name}
              className={`border-b border-[#e5e5e5] dark:border-[#1f1f1f] ${
                i % 2 === 0 ? 'bg-transparent' : 'bg-[#fafafa] dark:bg-[#141414]'
              }`}
            >
              <td className="py-2.5 pr-4">
                <code className="text-[13px] font-mono font-medium text-[#0a0a0a] dark:text-[#e5e5e5] bg-[#f7f7f7] dark:bg-[#1c1c1e] px-1.5 py-0.5 rounded border border-[#e5e5e5] dark:border-[#1f1f1f]">
                  {param.name}
                </code>
              </td>
              <td className="py-2.5 pr-4">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f7f7f7] dark:bg-[#1c1c1e] text-[#5a5a5c] dark:text-[#a8a8aa] border border-[#e5e5e5] dark:border-[#1f1f1f]">
                  {param.type}
                </span>
              </td>
              <td className="py-2.5 pr-4">
                {param.required ? (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[rgba(0,212,164,0.1)] text-[#00b48a] dark:text-[#00d4a4]">
                    Required
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded bg-[#f7f7f7] dark:bg-[#1c1c1e] text-[#888888] border border-[#e5e5e5] dark:border-[#1f1f1f]">
                    Optional
                  </span>
                )}
              </td>
              <td className="py-2.5 text-[#5a5a5c] dark:text-[#a8a8aa]">
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
      borderColor: '#3772cf',
      bgColor: 'rgba(55,114,207,0.05)',
      Icon: Info,
      iconColor: '#3772cf',
    },
    warning: {
      borderColor: '#c37d0d',
      bgColor: 'rgba(195,125,13,0.05)',
      Icon: AlertTriangle,
      iconColor: '#c37d0d',
    },
    tip: {
      borderColor: '#00d4a4',
      bgColor: 'rgba(0,212,164,0.05)',
      Icon: Lightbulb,
      iconColor: '#00d4a4',
    },
    danger: {
      borderColor: '#d45656',
      bgColor: 'rgba(212,86,86,0.05)',
      Icon: AlertCircle,
      iconColor: '#d45656',
    },
  }

  const { borderColor, bgColor, Icon, iconColor } = config[variant]

  return (
    <div
      className="my-6 rounded-md p-4 flex gap-3"
      style={{
        borderLeft: `3px solid ${borderColor}`,
        backgroundColor: bgColor,
      }}
    >
      <Icon
        className="h-5 w-5 shrink-0 mt-0.5"
        style={{ color: iconColor }}
      />
      <p className="text-sm text-[#0a0a0a] dark:text-[#e5e5e5] leading-relaxed m-0">
        {text}
      </p>
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
    <div className="overflow-x-auto my-6 border border-[#e5e5e5] dark:border-[#1f1f1f] rounded-md">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[#fafafa] dark:bg-[#1c1c1e] border-b border-[#e5e5e5] dark:border-[#1f1f1f]">
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left py-2.5 px-4 font-semibold text-[#0a0a0a] dark:text-white text-sm"
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
              className="border-b border-[#e5e5e5] dark:border-[#1f1f1f] last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="py-2.5 px-4 text-[#0a0a0a] dark:text-[#e5e5e5]"
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
      border: '#00b48a',
      bg: 'rgba(0,212,164,0.08)',
      text: '#007f68',
    },
    blue: {
      border: '#3772cf',
      bg: 'rgba(55,114,207,0.08)',
      text: '#285ca7',
    },
    amber: {
      border: '#c37d0d',
      bg: 'rgba(195,125,13,0.08)',
      text: '#8f5a08',
    },
    red: {
      border: '#d45656',
      bg: 'rgba(212,86,86,0.08)',
      text: '#a63d3d',
    },
    slate: {
      border: '#5a5a5c',
      bg: 'rgba(90,90,92,0.08)',
      text: '#4f4f51',
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
            className="rounded-md border border-[#e5e5e5] dark:border-[#1f1f1f] bg-white dark:bg-[#101010] p-4 shadow-sm"
            style={{ borderTop: `3px solid ${colors.border}` }}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
                style={{ backgroundColor: colors.bg, color: colors.text }}
                aria-hidden="true"
              >
                <Gauge className="h-4 w-4" />
              </div>
              {card.value && (
                <span className="rounded-md border border-[#e5e5e5] dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#1c1c1e] px-2.5 py-1 text-right font-mono text-[12px] font-semibold text-[#0a0a0a] dark:text-[#e5e5e5]">
                  {card.value}
                </span>
              )}
            </div>
            <h3 className="mb-2 text-[17px] font-semibold leading-snug text-[#0a0a0a] dark:text-white">
              {card.title}
            </h3>
            <p className="m-0 text-[14px] leading-relaxed text-[#5a5a5c] dark:text-[#a8a8aa]">
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

  const listClass = 'my-4 space-y-1.5 pl-5'
  const itemClass = 'text-[16px] leading-relaxed text-[#0a0a0a] dark:text-[#e5e5e5]'

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
          <span className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-[#00d4a4]/10 text-[#00b48a] dark:text-[#00d4a4] text-sm font-semibold">
            {i + 1}
          </span>
          <span className="text-[16px] leading-relaxed text-[#0a0a0a] dark:text-[#e5e5e5] pt-0.5">
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
    1: 'text-[48px] font-semibold leading-[1.1] tracking-tight',
    2: 'text-[30px] font-semibold leading-tight mt-12 mb-4',
    3: 'text-[24px] font-semibold leading-tight mt-10 mb-3',
    4: 'text-[20px] font-semibold leading-tight mt-8 mb-2',
  }

  const Tag = `h${level}` as ElementType

  return (
    <Tag id={headingId} className={`${styles[level] || styles[4]} text-[#0a0a0a] dark:text-white scroll-mt-20`}>
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
        <p className="text-[16px] leading-[1.5] text-[#0a0a0a] dark:text-[#e5e5e5] my-4">
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
      return <hr className="my-8 border-[#e5e5e5] dark:border-[#1f1f1f]" />

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
      className="mt-12 border-t border-[#e5e5e5] pt-8"
      data-related-section-count={relatedSectionIds.length}
    >
      <h2 className="mb-4 text-[24px] font-semibold leading-tight text-[#0a0a0a] dark:text-white">
        {heading}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {relatedSections.map((relatedSection) => {
          const path = getPathForSectionId(relatedSection.id) ?? '/'

          return (
            <a
              key={relatedSection.id}
              href={path}
              className="rounded-md border border-[#e5e5e5] bg-white p-4 transition-colors hover:border-[#00d4a4] hover:bg-[#f7fffc]"
            >
              <h3 className="mb-1 text-[15px] font-semibold text-[#0a0a0a]">
                {relatedLinkLabel(relatedSection)}
              </h3>
              <p className="m-0 line-clamp-2 text-[13px] leading-relaxed text-[#5a5a5c]">
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
      className="mt-10 grid gap-3 border-t border-[#e5e5e5] pt-6 sm:grid-cols-2"
    >
      {previous ? (
        <a
          href={previous.path}
          className="group flex min-h-[76px] items-center gap-3 rounded-md border border-[#e5e5e5] bg-white p-4 text-left transition-colors hover:border-[#00d4a4] hover:bg-[#f7fffc]"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-[#888888] transition-colors group-hover:text-[#00a783]" />
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-[#888888]">
              Previous
            </div>
            <div className="mt-1 text-[15px] font-semibold text-[#0a0a0a]">
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
          className="group flex min-h-[76px] items-center justify-between gap-3 rounded-md border border-[#e5e5e5] bg-white p-4 text-left transition-colors hover:border-[#00d4a4] hover:bg-[#f7fffc]"
        >
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-[0.08em] text-[#888888]">
              Next
            </div>
            <div className="mt-1 text-[15px] font-semibold text-[#0a0a0a]">
              Next: {pageNavigationLabel(next)}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[#888888] transition-colors group-hover:text-[#00a783]" />
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
      className="my-6 rounded-md border border-[#d8eee8] bg-[#f7fffc] p-5"
    >
      <h2 id="doc-summary-heading" className="mb-3 text-[20px] font-semibold leading-tight text-[#0a0a0a]">
        Summary
      </h2>
      <p className="m-0 text-[15px] leading-relaxed text-[#3f4f4a]">
        {summary}
      </p>

      {prerequisites.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-wide text-[#007f68]">
            Prerequisites
          </h3>
          <ul className="m-0 list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-[#3f4f4a]">
            {prerequisites.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {relatedSections.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-[14px] font-semibold uppercase tracking-wide text-[#007f68]">
            Related documentation
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedSections.map((relatedSection) => {
              const path = getPathForSectionId(relatedSection.id) ?? '/'

              return (
                <a
                  key={relatedSection.id}
                  href={path}
                  className="rounded-md border border-[#d8eee8] bg-white px-3 py-1.5 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:border-[#00d4a4] hover:text-[#007f68]"
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
    <section id="faq" className="mt-12 border-t border-[#e5e5e5] pt-8" data-doc-faq>
      <h2 className="mb-4 text-[24px] font-semibold leading-tight text-[#0a0a0a] dark:text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <article key={faq.question} className="rounded-md border border-[#e5e5e5] bg-white p-4">
            <h3 className="mb-2 text-[16px] font-semibold leading-snug text-[#0a0a0a]">
              {faq.question}
            </h3>
            <p className="m-0 text-[14px] leading-relaxed text-[#5a5a5c]">
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
        className="inline-flex whitespace-nowrap items-center gap-2 rounded-md border border-[#d8eee8] bg-white px-3.5 py-2 text-sm font-semibold text-[#0a0a0a] shadow-sm transition-colors hover:border-[#00d4a4] hover:bg-[#f7fffc] disabled:cursor-not-allowed disabled:opacity-70"
        aria-label={`${label}: ${doc.label}`}
        data-llm-copy-path={doc.path}
      >
        {status === 'copied' ? (
          <Check className="h-4 w-4 text-[#00a982]" />
        ) : (
          <Sparkles className="h-4 w-4 text-[#00a982]" />
        )}
        <span>{label}</span>
      </button>
      {!isHeadingPlacement && (
        <p className="mt-2 max-w-[680px] text-[13px] leading-relaxed text-[#5a5a5c]">
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
    <section className="mt-12 border-t border-[#e5e5e5] pt-8">
      <h2 className="mb-4 text-[24px] font-semibold leading-tight text-[#0a0a0a] dark:text-white">
        SDK Examples
      </h2>
      <p className="text-[15px] leading-relaxed text-[#5a5a5c] dark:text-[#a8a8aa]">
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

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSection])

  if (!section) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[#888888] text-lg">Section not found.</p>
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
        <p className="text-[18px] leading-relaxed text-[#5a5a5c] dark:text-[#a8a8aa] mb-8 -mt-2">
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
      <div className="h-24" />
    </div>
  )
}
