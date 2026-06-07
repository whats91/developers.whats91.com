'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDocStore } from '@/lib/doc-store'
import { tocData } from '@/lib/doc-data'

interface TableOfContentsProps {
  sectionId?: string
}

export function TableOfContents({ sectionId }: TableOfContentsProps) {
  const storeActiveSection = useDocStore((s) => s.activeSection)
  const activeSection = sectionId ?? storeActiveSection

  // Compute headings from active section
  const headings = useMemo(() => tocData(activeSection), [activeSection])

  // Heading IDs set for quick lookup
  const headingIds = useMemo(() => new Set(headings.map((h) => h.id)), [headings])

  // Default to first heading when section changes
  const defaultHeading = useMemo(() => {
    if (headings.length > 0) return headings[0].id
    return ''
  }, [headings])

  // Track observed active heading from IntersectionObserver
  const [observedHeading, setObservedHeading] = useState<string>('')

  // Derived: use observed if valid, otherwise fall back to default
  const activeHeading = observedHeading && headingIds.has(observedHeading)
    ? observedHeading
    : defaultHeading

  // Track which heading is currently in view via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setObservedHeading(entry.target.id)
          }
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    )

    // Observe all heading elements
    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }

    return () => {
      observer.disconnect()
    }
  }, [headings])

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Offset for fixed header
      setTimeout(() => {
        window.scrollBy(0, -80)
      }, 100)
    }
  }, [])

  // Don't render if no headings
  if (headings.length === 0) return null

  return (
    <nav
      className="hidden lg:block w-[200px] shrink-0"
      aria-label="Table of contents"
    >
      <div
        className="sticky top-14 border-l border-[#e5e5e5] dark:border-[#1f1f1f] p-4 overflow-y-auto doc-scroll"
        style={{ maxHeight: 'calc(100vh - 56px)' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#5a5a5c] dark:text-[#a8a8aa] mb-3">
          On this page
        </p>
        <ul className="space-y-1.5">
          {headings.map((item) => {
            const isActive = activeHeading === item.id
            const paddingLeft =
              item.level === 1
                ? 'pl-0'
                : item.level === 2
                  ? 'pl-3'
                  : item.level === 3
                    ? 'pl-6'
                    : 'pl-9'

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    block w-full text-left text-sm leading-snug py-0.5 transition-colors duration-150
                    ${paddingLeft}
                    ${
                      isActive
                        ? 'text-[#0a0a0a] dark:text-white font-medium toc-active-indicator'
                        : 'text-[#5a5a5c] dark:text-[#a8a8aa] hover:text-[#0a0a0a] dark:hover:text-white'
                    }
                  `}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {item.title}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
