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
  { label: string; color: string; bgClass: string; icon: React.ElementType }
> = {
  feature: {
    label: 'Feature',
    color: '#00d4a4',
    bgClass: 'bg-[#00d4a4]/10 text-[#00d4a4]',
    icon: Sparkles,
  },
  improvement: {
    label: 'Improvement',
    color: '#3772cf',
    bgClass: 'bg-[#3772cf]/10 text-[#3772cf]',
    icon: Wrench,
  },
  fix: {
    label: 'Fix',
    color: '#c37d0d',
    bgClass: 'bg-[#c37d0d]/10 text-[#c37d0d]',
    icon: Bug,
  },
  breaking: {
    label: 'Breaking',
    color: '#d45656',
    bgClass: 'bg-[#d45656]/10 text-[#d45656]',
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
    <div className="max-w-3xl">
      {/* Page Header */}
      <div className="mb-10">
        <h1
          className="text-[48px] font-semibold leading-tight tracking-tight text-[#0a0a0a]"
          style={{ fontSize: 48, fontWeight: 600 }}
        >
          Changelog
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[#5a5a5c]">
          Latest updates and improvements to the Whats91 platform
        </p>
      </div>

      {/* Filter Pills */}
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#0a0a0a] text-white border border-[#0a0a0a]'
                  : 'bg-white text-[#5a5a5c] border border-[#e5e5e5] hover:border-[#ccc]'
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
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#e5e5e5]" />

        <div className="flex flex-col gap-8">
          {groupedEntries.map((group) => {
            const groupConfig = typeConfig[group.entries[0]?.type ?? 'feature']

            return (
              <div key={`${group.version}-${group.date}`} className="relative flex gap-6">
                {/* Timeline dot */}
                <div className="relative z-10 mt-2 flex-shrink-0">
                  <div
                    className="h-[16px] w-[16px] rounded-full border-[3px] border-white"
                    style={{ backgroundColor: groupConfig.color, boxShadow: `0 0 0 2px ${groupConfig.color}30` }}
                  />
                </div>

                {/* Entry Content */}
                <div className="flex-1 min-w-0 pb-2">
                  {/* Date & Version row */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm text-[#5a5a5c]">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(group.date)}
                    </span>
                    <span className="bg-[#f7f7f7] text-[#5a5a5c] text-xs font-mono rounded-full px-3 py-1">
                      {group.version}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {group.entries.map((entry) => {
                      const config = typeConfig[entry.type]
                      const TypeIcon = config.icon

                      return (
                        <div key={`${group.version}-${group.date}-${entry.title}`}>
                          {/* Type badge */}
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${config.bgClass}`}
                            >
                              <TypeIcon className="h-3 w-3" />
                              {config.label}
                            </span>
                          </div>

                          {/* Title */}
                          <h4
                            className="mb-1.5 text-[22px] font-semibold leading-snug tracking-tight text-[#0a0a0a]"
                            style={{ fontSize: 22, fontWeight: 600 }}
                          >
                            {entry.title}
                          </h4>

                          {/* Description */}
                          <p className="text-[16px] leading-relaxed text-[#5a5a5c]">
                            {entry.description}
                          </p>
                        </div>
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
        <div className="py-16 text-center">
          <p className="text-[#888888] text-sm">No entries found for this filter.</p>
        </div>
      )}
    </div>
  )
}
