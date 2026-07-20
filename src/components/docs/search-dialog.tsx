'use client'

import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDocStore } from '@/lib/doc-store'
import { docCategories } from '@/lib/doc-data'
import { getPathForSectionId } from '@/lib/doc-routes'
import { rankSearchIndexEntries } from '@/lib/search-ranking.mjs'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Search, FileText, Hash, ArrowRight, Command, CornerDownLeft } from 'lucide-react'

// ---------------------------------------------------------------------------
// Group results by category for display
// ---------------------------------------------------------------------------
interface SearchResult {
  sectionId: string
  sectionTitle: string
  category: string
  categoryLabel: string
  canonicalPath: string
  match: string
  matchType?: string
  score?: number
}

interface SearchIndexEntry {
  sectionId: string
  sectionTitle: string
  category: string
  categoryLabel: string
  canonicalPath: string
  description: string
  content: string
}

interface GroupedResults {
  categoryId: string
  categoryLabel: string
  results: SearchResult[]
}

function groupByCategory(results: SearchResult[]): GroupedResults[] {
  const map = new Map<string, GroupedResults>()

  for (const r of results) {
    if (!map.has(r.category)) {
      const cat = docCategories.find((c) => c.id === r.category)
      map.set(r.category, {
        categoryId: r.category,
        categoryLabel: cat?.label ?? r.category,
        results: [],
      })
    }
    map.get(r.category)!.results.push(r)
  }

  // Preserve ranked result order so title matches stay above content matches.
  return Array.from(map.values())
}

// ---------------------------------------------------------------------------
// Highlight matching text within a string
// ---------------------------------------------------------------------------
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return text

  return (
    <>
      {text.slice(0, index)}
      <span className="search-highlight">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  )
}

// ---------------------------------------------------------------------------
// Inner dialog content
// ---------------------------------------------------------------------------
function SearchDialogContent() {
  const router = useRouter()
  const { setSearchOpen, setActiveSection, setActiveCategory } = useDocStore()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [searchIndex, setSearchIndex] = useState<SearchIndexEntry[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSearchIndex() {
      try {
        const response = await fetch('/search-index.json')
        if (!response.ok) return
        const entries = (await response.json()) as SearchIndexEntry[]
        if (!cancelled) setSearchIndex(entries)
      } catch {
        if (!cancelled) setSearchIndex([])
      }
    }

    loadSearchIndex()

    return () => {
      cancelled = true
    }
  }, [])

  // Debounce the search input (300ms)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query)
      setSelectedIndex(0)
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [query])

  // Compute search results
  const results = useMemo<SearchResult[]>(() => {
    if (!debouncedQuery.trim()) return []
    return rankSearchIndexEntries(searchIndex, debouncedQuery)
  }, [debouncedQuery, searchIndex])

  const grouped = groupByCategory(results)

  // Build a flat list for keyboard navigation
  const flatResults = useMemo(() => {
    const flat: SearchResult[] = []
    for (const group of grouped) {
      for (const r of group.results) {
        flat.push(r)
      }
    }
    return flat
  }, [grouped])

  // Handle result selection
  const handleSelect = useCallback(
    (result: SearchResult) => {
      setActiveCategory(result.category)
      setActiveSection(result.sectionId)
      setSearchOpen(false)
      router.push(result.canonicalPath || getPathForSectionId(result.sectionId) || '/')
    },
    [router, setActiveCategory, setActiveSection, setSearchOpen]
  )

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && flatResults.length > 0) {
        e.preventDefault()
        handleSelect(flatResults[selectedIndex])
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setSearchOpen(false)
      }
    },
    [flatResults, selectedIndex, handleSelect, setSearchOpen]
  )

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  let globalIndex = -1

  return (
    <div className="bg-popover" onKeyDown={handleKeyDown}>
      {/* Search Input */}
      <div className="flex items-center border-b border-hairline px-4">
        <Search className="size-4 shrink-0 text-faint" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-13 flex-1 border-0 bg-transparent px-3 text-[15px] text-ink placeholder:text-faint focus:outline-none focus:ring-0"
        />
        <kbd className="hidden rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">
          ESC
        </kbd>
      </div>

      {/* Results List */}
      <div className="doc-scroll max-h-[420px] overflow-y-auto overscroll-contain p-1.5">
        {debouncedQuery.trim() && results.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-mist">
              No results found for &ldquo;{debouncedQuery}&rdquo;
            </p>
            <p className="mt-1 text-xs text-faint">
              Try a different keyword or browse the sidebar.
            </p>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.categoryId}>
            <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              {group.categoryLabel}
            </div>
            {group.results.map((result) => {
              globalIndex++
              const currentIndex = globalIndex
              const isSelected = currentIndex === selectedIndex
              return (
                <button
                  key={`${result.sectionId}-${result.match}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                  className={`group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    isSelected ? 'bg-brand/10' : 'hover:bg-surface'
                  }`}
                >
                  <Hash
                    className={`mt-0.5 size-4 shrink-0 ${
                      isSelected ? 'text-brand-strong' : 'text-faint'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`truncate text-sm font-medium ${
                          isSelected ? 'text-brand-strong' : 'text-ink'
                        }`}
                      >
                        {result.sectionTitle}
                      </span>
                    </div>
                    {result.match !== result.sectionTitle && (
                      <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-mist">
                        {highlightMatch(result.match, debouncedQuery)}
                      </p>
                    )}
                  </div>
                  <ArrowRight
                    className={`mt-1 size-3.5 shrink-0 transition-opacity ${
                      isSelected ? 'text-brand-strong opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        ))}

        {/* Quick links when no query */}
        {!debouncedQuery.trim() && (
          <div className="px-1.5 py-2.5">
            <p className="mb-1 px-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
              Quick Navigation
            </p>
            {docCategories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  const sectionId = cat.sections[0]?.id ?? ''
                  setActiveCategory(cat.id)
                  setActiveSection(sectionId)
                  setSearchOpen(false)
                  router.push(getPathForSectionId(sectionId) ?? '/')
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-hairline bg-surface">
                  <FileText className="size-3.5 text-mist" />
                </span>
                <span className="text-sm font-medium text-ink">{cat.label}</span>
                <span className="ml-auto text-xs text-faint">
                  {cat.sections.length} sections
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="flex items-center justify-between border-t border-hairline px-4 py-2.5 text-xs text-faint">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex size-5 items-center justify-center rounded border border-hairline bg-surface text-[10px] font-medium">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-hairline bg-surface px-1 text-[10px] font-medium">
              <CornerDownLeft className="h-2.5 w-2.5" />
            </kbd>
            <span>Open</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <kbd className="inline-flex h-5 items-center justify-center rounded border border-hairline bg-surface px-1 text-[10px] font-medium">
              Esc
            </kbd>
            <span>Close</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-hairline bg-surface px-1 text-[10px] font-medium">
            {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? (
              <Command className="h-2.5 w-2.5" />
            ) : (
              'Ctrl'
            )}
          </kbd>
          <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-hairline bg-surface px-1 text-[10px] font-medium">
            K
          </kbd>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// SearchDialog Component — wrapper that handles open/close + keyboard shortcut
// ---------------------------------------------------------------------------
export function SearchDialog() {
  const { searchOpen, setSearchOpen } = useDocStore()

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, setSearchOpen])

  return (
    <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] max-w-[640px] translate-y-0 gap-0 overflow-hidden rounded-xl border border-hairline bg-popover p-0 shadow-2xl sm:max-w-[640px]"
        onInteractOutside={(e) => {
          e.preventDefault()
          setSearchOpen(false)
        }}
      >
        <DialogTitle className="sr-only">Search Documentation</DialogTitle>
        <DialogDescription className="sr-only">Search through Whats91 developer documentation</DialogDescription>
        <SearchDialogContent key={searchOpen ? 'open' : 'closed'} />
      </DialogContent>
    </Dialog>
  )
}
