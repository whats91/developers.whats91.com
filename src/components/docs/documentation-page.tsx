'use client'

import { useEffect } from 'react'
import { useDocStore } from '@/lib/doc-store'
import { TopNavbar } from '@/components/docs/top-navbar'
import { Sidebar } from '@/components/docs/sidebar'
import { ContentRenderer } from '@/components/docs/content-renderer'
import { TableOfContents } from '@/components/docs/table-of-contents'
import { SearchDialog } from '@/components/docs/search-dialog'
import ChangelogPage from '@/components/docs/changelog-page'
import { Footer } from '@/components/docs/footer'

interface DocumentationPageProps {
  initialSectionId?: string
  initialCategoryId?: string
}

export function DocumentationPage({
  initialSectionId,
  initialCategoryId,
}: DocumentationPageProps) {
  const activeSection = useDocStore((s) => s.activeSection)
  const activeCategory = useDocStore((s) => s.activeCategory)
  const setActiveSection = useDocStore((s) => s.setActiveSection)
  const setActiveCategory = useDocStore((s) => s.setActiveCategory)

  useEffect(() => {
    if (!initialSectionId || !initialCategoryId) return

    setActiveSection(initialSectionId)
    setActiveCategory(initialCategoryId)
  }, [initialSectionId, initialCategoryId, setActiveSection, setActiveCategory])

  const renderedActiveSection = initialSectionId ?? activeSection
  const renderedActiveCategory = initialCategoryId ?? activeCategory
  const isChangelog = renderedActiveCategory === 'changelog'

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Keyboard users can jump past the header and sidebar */}
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* Top Navigation Bar */}
      <TopNavbar activeCategoryOverride={renderedActiveCategory} />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            key={`desktop-sidebar-${renderedActiveCategory}`}
            activeSectionOverride={renderedActiveSection}
            activeCategoryOverride={renderedActiveCategory}
          />
        </div>

        {/* Mobile Sidebar (rendered with overlay inside Sidebar) */}
        <div className="md:hidden">
          <Sidebar
            key={`mobile-sidebar-${renderedActiveCategory}`}
            activeSectionOverride={renderedActiveSection}
            activeCategoryOverride={renderedActiveCategory}
          />
        </div>

        {/* Center Content + Right TOC */}
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 md:pl-[280px]">
          <div className="flex justify-center">
            {/* Content Area */}
            <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
              {isChangelog ? (
                <ChangelogPage />
              ) : (
                <ContentRenderer sectionId={renderedActiveSection} />
              )}
            </div>

            {/* Right TOC (only on large screens) */}
            <TableOfContents sectionId={renderedActiveSection} />
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Search Dialog (global) */}
      <SearchDialog />
    </div>
  )
}
