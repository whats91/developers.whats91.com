'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, Command } from 'lucide-react'
import { useDocStore } from '@/lib/doc-store'
import { getPathForSectionId } from '@/lib/doc-routes'
import { brandAssets } from '@/lib/brand-assets'

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
  const isActiveLink = (category: string) => displayedActiveCategory === category

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-white border-b border-[#e5e5e5]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 max-w-[1440px] mx-auto">
        {/* ── Left side: Logo + Developers label ── */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/overview"
            className="flex items-center"
            aria-label="Whats91 Developers home"
          >
            <img
              src={brandAssets.wordmark}
              alt={brandAssets.name}
              width={104}
              height={28}
              className="h-7 w-auto"
            />
          </a>

          {/* Hairline separator */}
          <div className="h-4 w-px bg-[#e5e5e5]" />

          <span
            className="text-sm font-normal text-[#5a5a5c] select-none"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Developers
          </span>
        </div>

        {/* ── Center: Navigation links (hidden on mobile) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.category)
            return (
              <button
                key={link.category}
                onClick={() => handleNavClick(link.category, link.section)}
                className={`
                  relative px-3 py-4 text-sm font-medium transition-colors
                  ${active ? 'text-[#0a0a0a]' : 'text-[#5a5a5c] hover:text-[#0a0a0a]'}
                `}
              >
                {link.label}
                {/* Active underline indicator */}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0a0a0a] rounded-full" />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── Right side: Search + Buttons (hidden on mobile) ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Search pill */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 h-9 px-3 bg-[#f7f7f7] border border-[#e5e5e5] rounded-md text-sm text-[#5a5a5c] hover:border-[#d0d0d0] hover:bg-[#f0f0f0] transition-colors"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="flex items-center gap-0.5 ml-2 text-xs text-[#999] font-mono">
              <Command className="h-3 w-3" />
              <span>K</span>
            </kbd>
          </button>

          <a
            href="https://app.whats91.com/login"
            className="text-sm font-medium text-[#5a5a5c] hover:text-[#0a0a0a] transition-colors px-2 py-1.5"
          >
            Sign In
          </a>

          <a
            href="https://app.whats91.com/dashboard/customer/developer/api-tokens"
            className="bg-[#00d4a4] text-[#0a0a0a] rounded-full px-5 py-2 text-sm font-medium hover:bg-[#00bf94] transition-colors"
          >
            Get API Keys
          </a>
        </div>

        {/* ── Mobile: Hamburger menu button ── */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-[#f7f7f7] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 text-[#0a0a0a]" />
          ) : (
            <Menu className="h-5 w-5 text-[#0a0a0a]" />
          )}
        </button>
      </div>

      {/* ── Mobile menu dropdown ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e5e5e5] bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(link.category)
              return (
                <button
                  key={link.category}
                  onClick={() => handleNavClick(link.category, link.section)}
                  className={`
                    flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left
                    ${active ? 'text-[#0a0a0a] bg-[#f7f7f7]' : 'text-[#5a5a5c] hover:text-[#0a0a0a] hover:bg-[#f7f7f7]'}
                  `}
                >
                  {link.label}
                </button>
              )
            })}

            <div className="h-px bg-[#e5e5e5] my-2" />

            {/* Mobile search button */}
            <button
              onClick={() => {
                setSearchOpen(true)
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-[#5a5a5c] hover:text-[#0a0a0a] hover:bg-[#f7f7f7] transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
              <kbd className="ml-auto flex items-center gap-0.5 text-xs text-[#999] font-mono">
                <Command className="h-3 w-3" />
                <span>K</span>
              </kbd>
            </button>

            <div className="h-px bg-[#e5e5e5] my-2" />

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://app.whats91.com/login"
                className="text-sm font-medium text-[#5a5a5c] hover:text-[#0a0a0a] transition-colors px-3 py-2 text-left"
              >
                Sign In
              </a>
              <a
                href="https://app.whats91.com/dashboard/customer/developer/api-tokens"
                className="bg-[#00d4a4] text-[#0a0a0a] rounded-full px-5 py-2 text-center text-sm font-medium hover:bg-[#00bf94] transition-colors w-full"
              >
                Get API Keys
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
