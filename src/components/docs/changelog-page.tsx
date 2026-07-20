'use client'

import { useMemo, useState } from 'react'
import { changelogEntries } from '@/lib/doc-data'
import { Sparkles, Wrench, Bug, AlertTriangle, Calendar } from 'lucide-react'

type FilterType = 'all' | 'feature' | 'improvement' | 'fix' | 'breaking'
type ChangelogEntry = (typeof changelogEntries)[number]

type ChangelogGroup = {
  date: string
  version: string
  entries: ChangelogEntry[]
}

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'feature', label: 'Features' },
  { key: 'improvement', label: 'Improvements' },
  { key: 'fix', label: 'Fixes' },
  { key: 'breaking', label: 'Breaking Changes' },
]

const typeConfig: Record<
  string,
  { label: string; dotVar: string; badgeClass: string; icon: React.ElementType }
> = {
  feature: {
    label: 'Feature',
    dotVar: 'var(--brand)',
    badgeClass: 'bg-brand/10 text-brand-strong',
    icon: Sparkles,
  },
  improvement: {
    label: 'Improvement',
    dotVar: 'var(--info)',
    badgeClass: 'bg-info/10 text-info',
    icon: Wrench,
  },
  fix: {
    label: 'Fix',
    dotVar: 'var(--warn)',
    badgeClass: 'bg-warn/10 text-warn',
    icon: Bug,
  },
  breaking: {
    label: 'Breaking',
    dotVar: 'var(--danger)',
    badgeClass: 'bg-danger/10 text-danger',
    icon: AlertTriangle,
  },
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function groupEntriesByRelease(entries: ChangelogEntry[]): ChangelogGroup[] {
  return entries.reduce<ChangelogGroup[]>((groups, entry) => {
    const currentGroup = groups[groups.length - 1]

    if (currentGroup?.date === entry.date && currentGroup.version === entry.version) {
      currentGroup.entries.push(entry)
      return groups
    }

    groups.push({
      date: entry.date,
      version: entry.version,
      entries: [entry],
    })

    return groups
  }, [])
}

export default function ChangelogPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredEntries =
    activeFilter === 'all'
      ? changelogEntries
      : changelogEntries.filter((entry) => entry.type === activeFilter)
  const groupedEntries = useMemo(
    () => groupEntriesByRelease(filteredEntries),
    [filteredEntries]
  )

  return (
    <div className="mx-auto w-full max-w-[760px]">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-[1.9rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.25rem]">
          Changelog
        </h1>
        <p className="mt-3 text-[16.5px] leading-relaxed text-mist">
          Latest updates and improvements to the Whats91 platform
        </p>
      </div>

      {/* Filter Pills */}
      <div className="mb-12 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              aria-pressed={isActive}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border border-hairline bg-card text-mist hover:border-faint/50 hover:text-ink'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute bottom-2 left-[7px] top-2 w-px bg-hairline" aria-hidden="true" />

        <div className="flex flex-col gap-12">
          {groupedEntries.map((group) => {
            const groupConfig = typeConfig[group.entries[0]?.type ?? 'feature']

            return (
              <div key={`${group.version}-${group.date}`} className="relative flex gap-5 sm:gap-7">
                {/* Timeline dot */}
                <div className="relative z-10 mt-1.5 flex-shrink-0">
                  <div
                    className="h-[15px] w-[15px] rounded-full border-[3px] border-background"
                    style={{
                      backgroundColor: groupConfig.dotVar,
                      boxShadow: `0 0 0 1px color-mix(in srgb, ${groupConfig.dotVar} 35%, transparent)`,
                    }}
                  />
                </div>

                {/* Entry Content */}
                <div className="min-w-0 flex-1 pb-2">
                  {/* Date & Version row */}
                  <div className="mb-4 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mist">
                      <Calendar className="h-3.5 w-3.5 text-faint" />
                      {formatDate(group.date)}
                    </span>
                    <span className="rounded-full border border-hairline bg-surface px-2.5 py-0.5 font-mono text-[11.5px] font-medium text-mist">
                      {group.version}
                    </span>
                  </div>

                  <div className="space-y-7">
                    {group.entries.map((entry) => {
                      const config = typeConfig[entry.type]
                      const TypeIcon = config.icon

                      return (
                        <article key={`${group.version}-${group.date}-${entry.title}`}>
                          {/* Type badge */}
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${config.badgeClass}`}
                            >
                              <TypeIcon className="h-3 w-3" />
                              {config.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="mb-1.5 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                            {entry.title}
                          </h4>

                          {/* Description */}
                          <p className="text-[14.5px] leading-[1.75] text-mist">
                            {entry.description}
                          </p>
                        </article>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Empty state */}
      {groupedEntries.length === 0 && (
        <div className="rounded-xl border border-dashed border-hairline py-16 text-center">
          <p className="text-sm text-faint">No entries found for this filter.</p>
        </div>
      )}
    </div>
  )
}
