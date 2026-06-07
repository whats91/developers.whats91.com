import { create } from 'zustand'

export interface DocSection {
  id: string
  title: string
  slug: string
  category?: string
  icon?: string
}

export interface DocCategory {
  id: string
  label: string
  slug: string
  sections: DocSection[]
}

interface DocStore {
  activeSection: string
  activeCategory: string
  sidebarOpen: boolean
  searchOpen: boolean
  searchQuery: string
  mobileMenuOpen: boolean

  setActiveSection: (section: string) => void
  setActiveCategory: (category: string) => void
  setSidebarOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setMobileMenuOpen: (open: boolean) => void
}

export const useDocStore = create<DocStore>((set) => ({
  activeSection: 'overview',
  activeCategory: 'getting-started',
  sidebarOpen: true,
  searchOpen: false,
  searchQuery: '',
  mobileMenuOpen: false,

  setActiveSection: (section) => set({ activeSection: section }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}))
