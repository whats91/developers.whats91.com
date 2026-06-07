'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDocStore } from '@/lib/doc-store'
import { docCategories } from '@/lib/doc-data'
import type { DocCategoryData } from '@/lib/doc-data'
import { getPathForCategoryId, getPathForSectionId, isSinglePageRouteCategory } from '@/lib/doc-routes'
import { brandAssets } from '@/lib/brand-assets'
import {
  ChevronDown,
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
          className="sidebar-overlay fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-full w-[260px] border-r border-[#e5e5e5] bg-[#fafafa]
          pt-4 pb-4 transition-transform duration-200 ease-in-out
          md:z-0 md:translate-x-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header / logo area */}
          <a
            href="/overview"
            className="mb-2 flex items-center gap-2 px-4 py-3"
            aria-label="Whats91 Developer Docs home"
          >
            <img
              src={brandAssets.mark}
              alt=""
              width={32}
              height={32}
              aria-hidden="true"
              className="h-8 w-8 shrink-0"
            />
            <div className="min-w-0">
              <img
                src={brandAssets.wordmark}
                alt={brandAssets.name}
                width={110}
                height={30}
                className="h-5 w-auto max-w-[110px]"
              />
              <span className="mt-0.5 block text-[11px] font-medium leading-none text-[#5a5a5c]">
                Developer Docs
              </span>
            </div>
          </a>

          {/* Scrollable navigation */}
          <nav className="doc-scroll max-h-[calc(100vh-56px)] flex-1 overflow-y-auto px-2">
            {navCategories.map((category, catIndex) => {
              const singlePageCategory = isSinglePageRouteCategory(category.id)
              const CategoryIcon = categoryIconMap[category.icon] ?? BookOpen
              const isCategoryActive = displayedActiveCategory === category.id
              const isExpanded = singlePageCategory ? false : expandedCategory === category.id

              return (
                <div
                  key={category.id}
                  className={catIndex === 0 ? 'mt-6' : 'mt-4'}
                >
                  {/* Category header — clickable to collapse */}
                  <button
                    ref={
                      isCategoryActive && (singlePageCategory || !isExpanded)
                        ? activeMenuItemRef
                        : undefined
                    }
                    onClick={() => handleCategoryClick(category)}
                    className="flex w-full items-center gap-1.5 px-2 py-1.5 text-left"
                    aria-expanded={singlePageCategory ? undefined : isExpanded}
                  >
                    <CategoryIcon
                      className={`h-3.5 w-3.5 ${isCategoryActive ? 'text-[#0a0a0a]' : 'text-[#5a5a5c]'}`}
                    />
                    <span
                      className={`flex-1 text-[11px] font-semibold uppercase tracking-[0.5px] ${isCategoryActive ? 'text-[#0a0a0a]' : 'text-[#5a5a5c]'}`}
                    >
                      {category.label}
                    </span>
                    {!singlePageCategory && (
                      isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-[#5a5a5c]" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-[#5a5a5c]" />
                      )
                    )}
                  </button>

                  {/* Section items */}
                  {!singlePageCategory && isExpanded && (
                    <ul className="mt-0.5 space-y-0.5">
                      {category.sections.map((section) => {
                        const isActive = displayedActiveSection === section.id

                        return (
                          <li key={section.id}>
                            <button
                              ref={isActive ? activeMenuItemRef : undefined}
                              onClick={() => handleNavClick(section.id, category.id)}
                              className={`
                                flex w-full items-center rounded-sm py-1.5 px-3 text-sm transition-colors
                                ${
                                  isActive
                                    ? 'border-l-2 border-[#00d4a4] bg-[#f7f7f7] font-medium text-[#0a0a0a]'
                                    : 'border-l-2 border-transparent text-[#5a5a5c] hover:bg-[#f0f0f0]'
                                }
                              `}
                            >
                              {section.title}
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
        </div>
      </aside>
    </>
  )
}
