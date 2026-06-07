import { docCategories, getSectionById } from '@/lib/doc-data'

type RoutedCategoryConfig = {
  canonicalPath: string
  legacyPaths?: string[]
  singlePage?: boolean
  firstSectionAtBase?: boolean
}

const routedCategories: Record<string, RoutedCategoryConfig> = {
  'getting-started': { canonicalPath: '/overview', firstSectionAtBase: true },
  messaging: { canonicalPath: '/messaging', firstSectionAtBase: true },
  'messaging-meta': {
    canonicalPath: '/messaging/meta-compatibility',
    legacyPaths: ['/messaging-meta'],
    firstSectionAtBase: true,
  },
  template: { canonicalPath: '/templates', legacyPaths: ['/template'] },
  webhook: { canonicalPath: '/webhooks', legacyPaths: ['/webhook'] },
  reports: { canonicalPath: '/reports' },
  'message-billing': { canonicalPath: '/message-billing' },
  chatbot: { canonicalPath: '/chatbots', legacyPaths: ['/chatbot'] },
  'contact-book': { canonicalPath: '/contact-books', legacyPaths: ['/contact-book'] },
  blacklist: { canonicalPath: '/blacklist' },
  conversations: { canonicalPath: '/conversations' },
  changelog: { canonicalPath: '/changelog', singlePage: true },
}

const sectionPathOverrides: Record<string, string> = {
  overview: '/overview',
  'quick-start': '/quickstart',
  authentication: '/authentication',
  'api-keys': '/api-keys',
  'rate-limits': '/rate-limits',
}

export type ResolvedDocRoute = {
  category: (typeof docCategories)[number]
  section: NonNullable<ReturnType<typeof getSectionById>>
  routeSection: { id: string; title: string; slug: string }
  path: string
  canonicalPath: string
  categoryPath: string
}

export type AdjacentDocRoute = {
  sectionId: string
  title: string
  path: string
}

export function resolveRoutedDoc(categorySlug: string, sectionSlug?: string) {
  const routeConfig = routedCategories[categorySlug]
  if (!routeConfig) return null

  const category = docCategories.find((cat) => cat.slug === categorySlug)
  if (!category) return null

  const routeSection = sectionSlug
    ? category.sections.find((section) => section.slug === sectionSlug)
    : category.sections[0]

  if (!routeSection) return null

  const section = getSectionById(routeSection.id)
  if (!section) return null

  return {
    category,
    section,
    routeSection,
    path: sectionSlug ? getSectionPath(category, routeSection) : routeConfig.canonicalPath,
    canonicalPath: sectionSlug ? getSectionPath(category, routeSection) : routeConfig.canonicalPath,
    categoryPath: routeConfig.canonicalPath,
  } satisfies ResolvedDocRoute
}

export function getPathForSectionId(sectionId: string): string | null {
  for (const category of docCategories) {
    const routeConfig = routedCategories[category.slug]
    if (!routeConfig) continue

    const section = category.sections.find((item) => item.id === sectionId)
    if (section) return getSectionPath(category, section)
  }

  return null
}

export function getAdjacentDocRoutes(sectionId: string): {
  previous: AdjacentDocRoute | null
  next: AdjacentDocRoute | null
} {
  const category = docCategories.find((item) =>
    item.sections.some((section) => section.id === sectionId)
  )

  if (!category) return { previous: null, next: null }

  const orderedSections = category.sections.map((section) => ({
    sectionId: section.id,
    title: section.title,
    path: getPathForSectionId(section.id) ?? '/',
  }))

  const currentIndex = orderedSections.findIndex((section) => section.sectionId === sectionId)
  if (currentIndex === -1) return { previous: null, next: null }

  return {
    previous: orderedSections[currentIndex - 1] ?? null,
    next: orderedSections[currentIndex + 1] ?? null,
  }
}

export function getPathForCategoryId(categoryId: string): string | null {
  const category = docCategories.find((cat) => cat.id === categoryId)
  if (!category) return null

  const routeConfig = routedCategories[category.slug]
  if (!routeConfig) return null

  return routeConfig.canonicalPath
}

export function isSinglePageRouteCategory(categoryId: string): boolean {
  const category = docCategories.find((cat) => cat.id === categoryId)
  if (!category) return false

  return Boolean(routedCategories[category.slug]?.singlePage)
}

export function getStaticParamsForCategory(categorySlug: string) {
  const category = docCategories.find((cat) => cat.slug === categorySlug)
  if (!category || !routedCategories[category.slug]) return []
  const routeConfig = routedCategories[category.slug]
  if (routeConfig.singlePage) return []

  return category.sections
    .filter((section) => getSectionPath(category, section) !== routeConfig.canonicalPath)
    .map((section) => ({
      section: section.slug,
    }))
}

function getSectionPath(
  category: (typeof docCategories)[number],
  section: { id: string; slug: string }
): string {
  const override = sectionPathOverrides[section.id]
  if (override) return override

  const routeConfig = routedCategories[category.slug]
  if (!routeConfig) return '/'
  if (routeConfig.singlePage) return routeConfig.canonicalPath

  const firstSection = category.sections[0]
  if (routeConfig.firstSectionAtBase && firstSection?.id === section.id) {
    return routeConfig.canonicalPath
  }

  return `${routeConfig.canonicalPath}/${section.slug}`
}

export function getIndexableDocRoutes() {
  const routes = new Map<string, ResolvedDocRoute>()

  for (const category of docCategories) {
    const routeConfig = routedCategories[category.slug]
    if (!routeConfig) continue

    const firstRoute = resolveRoutedDoc(category.slug)
    if (firstRoute) routes.set(routeConfig.canonicalPath, firstRoute)

    if (routeConfig.singlePage) continue

    for (const routeSection of category.sections) {
      const section = getSectionById(routeSection.id)
      if (!section) continue

      const path = getSectionPath(category, routeSection)
      routes.set(path, {
        category,
        section,
        routeSection,
        path,
        canonicalPath: path,
        categoryPath: routeConfig.canonicalPath,
      })
    }
  }

  return Array.from(routes.values())
}

export function getLegacyRedirects() {
  const redirects: { source: string; destination: string }[] = [
    { source: '/', destination: '/overview' },
  ]

  for (const category of docCategories) {
    const routeConfig = routedCategories[category.slug]
    if (!routeConfig?.legacyPaths?.length) continue

    for (const legacyPath of routeConfig.legacyPaths) {
      redirects.push({
        source: legacyPath,
        destination: routeConfig.canonicalPath,
      })

      if (routeConfig.singlePage) continue

      for (const section of category.sections) {
        redirects.push({
          source: `${legacyPath}/${section.slug}`,
          destination: getSectionPath(category, section),
        })
      }
    }
  }

  return redirects
}
