'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, Command, ArrowUpRight } from 'lucide-react'
import { useDocStore } from '@/lib/doc-store'
import { getPathForSectionId } from '@/lib/doc-routes'
import { brandAssets } from '@/lib/brand-assets'
import { ThemeToggle } from '@/components/docs/theme-toggle'

const NAV_LINKS = [
  { label: 'Documentation', category: 'getting-started', section: 'overview' },
  { label: 'Changelog', category: 'changelog', section: 'changelog' },
] as const

interface TopNavbarProps {
  activeCategoryOverride?: string
}

export function TopNavbar({ activeCategoryOverride }: TopNavbarProps) {
  const router = useRouter()
  const {
    activeCategory,
    setActiveCategory,
    setActiveSection,
    searchOpen,
    setSearchOpen,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useDocStore()

  const handleNavClick = useCallback(
    (category: string, section: string) => {
      setActiveCategory(category)
      setActiveSection(section)
      setMobileMenuOpen(false)
      router.push(getPathForSectionId(section) ?? '/')
    },
    [router, setActiveCategory, setActiveSection, setMobileMenuOpen]
  )

  // ⌘K / Ctrl+K keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen, setSearchOpen])

  const displayedActiveCategory = activeCategoryOverride ?? activeCategory
  const isActiveLink = (category: string) =>
    category === 'changelog'
      ? displayedActiveCategory === 'changelog'
      : displayedActiveCategory !== 'changelog'

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-hairline bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="flex h-full items-center gap-3 px-4 lg:px-6">
        {/* ── Mobile: menu button ── */}
        <button
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-mist transition-colors hover:bg-surface hover:text-ink md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* ── Left: Logo + Developers label ── */}
        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <a
            href="/overview"
            className="flex items-center gap-2.5"
            aria-label="Whats91 Developers home"
          >
            <img
              src={brandAssets.wordmark}
              alt={brandAssets.name}
              width={104}
              height={28}
              className="h-6 w-auto sm:h-7"
            />
          </a>

          <div className="hidden h-4 w-px bg-hairline sm:block" aria-hidden="true" />

          <span className="hidden select-none rounded-md bg-surface px-2 py-0.5 text-[12px] font-medium tracking-wide text-mist sm:block">
            Developers
          </span>
        </div>

        {/* ── Center: primary nav (desktop) ── */}
        <nav className="ml-4 hidden h-full items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.category)
            return (
              <button
                key={link.category}
                onClick={() => handleNavClick(link.category, link.section)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex h-full items-center px-3 text-sm font-medium transition-colors ${
                  active ? 'text-ink' : 'text-mist hover:text-ink'
                }`}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-brand"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Right side ── */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Search pill (desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden h-9 w-56 items-center gap-2 rounded-lg border border-hairline bg-surface/60 px-3 text-sm text-mist transition-colors hover:border-faint/50 hover:bg-surface md:flex lg:w-64"
            aria-label="Search documentation"
          >
            <Search className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 text-left">Search docs...</span>
            <kbd className="flex items-center gap-0.5 rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px] text-faint">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </kbd>
          </button>

          {/* Search icon (mobile) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-mist transition-colors hover:bg-surface hover:text-ink md:hidden"
            aria-label="Search documentation"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          {/* Theme switch */}
          <ThemeToggle />

          <div className="mx-1 hidden h-4 w-px bg-hairline md:block" aria-hidden="true" />

          <a
            href="https://app.whats91.com/login"
            className="hidden px-2 py-1.5 text-sm font-medium text-mist transition-colors hover:text-ink md:block"
          >
            Sign In
          </a>

          <a
            href="https://app.whats91.com/dashboard/customer/developer/api-tokens"
            className="group hidden h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 md:flex"
          >
            Get API Keys
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </a>
        </div>
      </div>
    </header>
  )
}
