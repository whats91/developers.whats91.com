'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useDocStore } from '@/lib/doc-store'
import { tocData } from '@/lib/doc-data'
import { AlignLeft } from 'lucide-react'

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
    // Headings carry scroll-mt offsets, so a plain smooth scroll lands correctly
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Don't render if no headings
  if (headings.length === 0) return null

  return (
    <nav
      className="hidden w-[240px] shrink-0 xl:block"
      aria-label="Table of contents"
    >
      <div
        className="doc-scroll sticky top-14 overflow-y-auto overscroll-contain py-12 pl-2 pr-6"
        style={{ maxHeight: 'calc(100vh - 3.5rem)' }}
      >
        <p className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
          <AlignLeft className="h-3.5 w-3.5" aria-hidden="true" />
          On this page
        </p>
        <ul className="space-y-0.5 border-l border-hairline pl-4">
          {headings.map((item) => {
            const isActive = activeHeading === item.id
            const paddingLeft =
              item.level === 1
                ? 'pl-0'
                : item.level === 2
                  ? 'pl-0'
                  : item.level === 3
                    ? 'pl-3'
                    : 'pl-6'

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    block w-full py-1 text-left text-[13px] leading-snug transition-colors duration-150
                    ${paddingLeft}
                    ${
                      isActive
                        ? 'toc-active-indicator font-medium text-brand-strong'
                        : 'text-mist hover:text-ink'
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
