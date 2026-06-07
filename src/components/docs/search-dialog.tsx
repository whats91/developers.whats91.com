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
import { Search, FileText, Hash, ArrowRight, Command } from 'lucide-react'

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
    <div className="bg-white" onKeyDown={handleKeyDown}>
      {/* Search Input */}
      <div className="flex items-center border-b border-[#e5e5e5] px-4">
        <Search className="size-4 shrink-0 text-[#888888]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-0 focus:ring-0 focus:outline-none h-12 text-sm placeholder:text-[#888888] bg-transparent px-3"
        />
      </div>

      {/* Results List */}
      <div className="max-h-[400px] overflow-y-auto">
        {debouncedQuery.trim() && results.length === 0 && (
          <div className="py-8 text-center text-sm text-[#888888]">
            No results found for &ldquo;{debouncedQuery}&rdquo;
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.categoryId}>
            <div className="text-xs uppercase tracking-wide text-[#888888] px-3 py-2 font-semibold">
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
                  className={`w-full px-3 py-2 rounded-md cursor-pointer flex items-start gap-3 mx-1 text-left transition-colors ${
                    isSelected
                      ? 'bg-[#f7f7f7] border-l-2 border-[#00d4a4]'
                      : 'hover:bg-[#f7f7f7]'
                  }`}
                >
                  <Hash className="size-4 shrink-0 mt-0.5 text-[#888888]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1c1c1e] truncate">
                        {result.sectionTitle}
                      </span>
                      <span className="text-[10px] text-[#888888] bg-[#f0f0f0] px-1.5 py-0.5 rounded shrink-0">
                        {group.categoryLabel}
                      </span>
                    </div>
                    {result.match !== result.sectionTitle && (
                      <p className="text-xs text-[#5a5a5c] mt-0.5 line-clamp-2 leading-relaxed">
                        {highlightMatch(result.match, debouncedQuery)}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="size-3.5 shrink-0 mt-1 text-[#888888] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              )
            })}
          </div>
        ))}

        {/* Quick links when no query */}
        {!debouncedQuery.trim() && (
          <div className="px-3 py-4">
            <p className="text-xs uppercase tracking-wide text-[#888888] mb-2 px-1 font-semibold">
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
                className="w-full px-3 py-2 rounded-md cursor-pointer hover:bg-[#f7f7f7] flex items-center gap-3 text-left transition-colors"
              >
                <FileText className="size-4 text-[#888888]" />
                <span className="text-sm text-[#1c1c1e]">{cat.label}</span>
                <span className="ml-auto text-xs text-[#888888]">
                  {cat.sections.length} sections
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="border-t border-[#e5e5e5] px-4 py-2.5 flex justify-between items-center text-xs text-[#888888]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center size-5 rounded bg-[#f0f0f0] border border-[#e5e5e5] text-[10px] font-medium">
              ↑↓
            </kbd>
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded bg-[#f0f0f0] border border-[#e5e5e5] text-[10px] font-medium">
              ↵
            </kbd>
            <span>Open</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="inline-flex items-center justify-center size-5 rounded bg-[#f0f0f0] border border-[#e5e5e5] text-[10px] font-medium">
              Esc
            </kbd>
            <span>Close</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded bg-[#f0f0f0] border border-[#e5e5e5] text-[10px] font-medium">
            {typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent) ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded bg-[#f0f0f0] border border-[#e5e5e5] text-[10px] font-medium">
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
        className="max-w-[640px] rounded-lg shadow-2xl p-0 gap-0 overflow-hidden border border-[#e5e5e5] bg-white"
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
