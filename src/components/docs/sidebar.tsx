'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDocStore } from '@/lib/doc-store'
import { docCategories } from '@/lib/doc-data'
import type { DocCategoryData } from '@/lib/doc-data'
import { getPathForCategoryId, getPathForSectionId, isSinglePageRouteCategory } from '@/lib/doc-routes'
import { brandAssets } from '@/lib/brand-assets'
import {
  ChevronRight,
  MessageSquare,
  Zap,
  Code2,
  BookOpen,
  Clock,
  Rocket,
  GitCommitHorizontal,
  FileText,
  Webhook,
  BarChart3,
  CreditCard,
  Bot,
  BookUser,
  Ban,
  MessageCircle,
  UsersRound,
  ArrowUpRight,
} from 'lucide-react'

// Alias to match the expected import name from the spec
const navCategories: DocCategoryData[] = docCategories

// Icon mapping for category icons
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  MessageSquare,
  Code2,
  BookOpen,
  GitCommitHorizontal,
  FileText,
  Webhook,
  BarChart3,
  CreditCard,
  Bot,
  BookUser,
  Ban,
  MessageCircle,
  UsersRound,
  Zap,
  Clock,
}

interface SidebarProps {
  activeSectionOverride?: string
  activeCategoryOverride?: string
}

export function Sidebar({
  activeSectionOverride,
  activeCategoryOverride,
}: SidebarProps) {
  const router = useRouter()
  const {
    activeSection,
    activeCategory,
    mobileMenuOpen,
    setActiveSection,
    setActiveCategory,
    setMobileMenuOpen,
  } = useDocStore()

  const displayedActiveSection = activeSectionOverride ?? activeSection
  const displayedActiveCategory = activeCategoryOverride ?? activeCategory

  // Keep one expandable main menu open at a time.
  const [expandedCategory, setExpandedCategory] = useState<string | null>(
    isSinglePageRouteCategory(displayedActiveCategory) ? null : displayedActiveCategory
  )
  const activeMenuItemRef = useRef<HTMLButtonElement | null>(null)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory((currentCategoryId) =>
      currentCategoryId === categoryId ? null : categoryId
    )
  }

  useEffect(() => {
    const activeMenuItem = activeMenuItemRef.current
    if (!activeMenuItem) return

    activeMenuItem.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }, [displayedActiveCategory, displayedActiveSection])

  // Lock body scroll and close on Escape while the mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen, setMobileMenuOpen])

  const handleCategoryClick = (category: DocCategoryData) => {
    const singlePageCategory = isSinglePageRouteCategory(category.id)

    if (!singlePageCategory) {
      toggleCategory(category.id)
      return
    }

    setExpandedCategory(null)
    const firstSection = category.sections[0]
    if (firstSection) setActiveSection(firstSection.id)
    setActiveCategory(category.id)
    setMobileMenuOpen(false)
    router.push(getPathForCategoryId(category.id) ?? '/')
  }

  const handleNavClick = (sectionId: string, categoryId: string) => {
    setActiveSection(sectionId)
    setActiveCategory(categoryId)
    setExpandedCategory(categoryId)
    // Close mobile menu on nav item click
    setMobileMenuOpen(false)
    router.push(getPathForSectionId(sectionId) ?? '/')
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay fixed inset-0 top-14 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-14 z-40 flex h-[calc(100dvh-3.5rem)] w-[300px] flex-col
          border-r border-hairline bg-panel transition-transform duration-200 ease-out
          md:z-30 md:w-[280px] md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'}
        `}
        aria-label="Documentation navigation"
      >
        {/* Mobile drawer brand row */}
        <a
          href="/overview"
          className="flex items-center gap-2.5 border-b border-hairline-soft px-5 py-3.5 md:hidden"
          aria-label="Whats91 Developer Docs home"
        >
          <img
            src={brandAssets.mark}
            alt=""
            width={26}
            height={26}
            aria-hidden="true"
            className="h-[26px] w-[26px] shrink-0"
          />
          <span className="text-[13px] font-semibold text-ink">Developer Docs</span>
        </a>

        {/* Scrollable navigation */}
        <nav className="doc-scroll flex-1 overflow-y-auto overscroll-contain px-3 pb-6 pt-4">
          {navCategories.map((category, catIndex) => {
            const singlePageCategory = isSinglePageRouteCategory(category.id)
            const CategoryIcon = categoryIconMap[category.icon] ?? BookOpen
            const isCategoryActive = displayedActiveCategory === category.id
            const isExpanded = singlePageCategory ? false : expandedCategory === category.id

            return (
              <div key={category.id} className={catIndex === 0 ? '' : 'mt-1'}>
                {/* Category header — clickable to collapse */}
                <button
                  ref={
                    isCategoryActive && (singlePageCategory || !isExpanded)
                      ? activeMenuItemRef
                      : undefined
                  }
                  onClick={() => handleCategoryClick(category)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    isCategoryActive && !isExpanded
                      ? 'bg-brand/10 text-brand-strong'
                      : 'text-ink hover:bg-surface'
                  }`}
                  aria-expanded={singlePageCategory ? undefined : isExpanded}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isCategoryActive
                        ? 'border-brand/30 bg-brand/10 text-brand-strong'
                        : 'border-hairline bg-background text-mist group-hover:text-ink'
                    }`}
                    aria-hidden="true"
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                  </span>
                  <span
                    className={`flex-1 truncate text-[13px] font-semibold tracking-[-0.01em] ${
                      isCategoryActive && !isExpanded ? 'text-brand-strong' : 'text-ink'
                    }`}
                  >
                    {category.label}
                  </span>
                  {!singlePageCategory && (
                    <ChevronRight
                      className={`h-3.5 w-3.5 shrink-0 text-faint transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Section items */}
                {!singlePageCategory && isExpanded && (
                  <ul className="nav-rail nav-group-enter mb-2 ml-[21px] mt-1 space-y-px pl-3">
                    {category.sections.map((section) => {
                      const isActive = displayedActiveSection === section.id

                      return (
                        <li key={section.id}>
                          <button
                            ref={isActive ? activeMenuItemRef : undefined}
                            onClick={() => handleNavClick(section.id, category.id)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`relative flex w-full items-center rounded-md px-2.5 py-[7px] text-left text-[13px] leading-snug transition-colors ${
                              isActive
                                ? 'bg-brand/10 font-medium text-brand-strong'
                                : 'text-mist hover:bg-surface hover:text-ink'
                            }`}
                          >
                            {isActive && (
                              <span
                                className="absolute -left-[13px] bottom-1 top-1 w-[2px] rounded-full bg-brand"
                                aria-hidden="true"
                              />
                            )}
                            <span className="truncate">{section.title}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>

        {/* Mobile drawer footer actions */}
        <div className="flex flex-col gap-2 border-t border-hairline-soft p-4 md:hidden">
          <a
            href="https://app.whats91.com/dashboard/customer/developer/api-tokens"
            className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get API Keys
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </a>
          <a
            href="https://app.whats91.com/login"
            className="flex h-10 items-center justify-center rounded-lg border border-hairline text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            Sign In
          </a>
        </div>
      </aside>
    </>
  )
}
