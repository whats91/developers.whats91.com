'use client'

import Link from 'next/link'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { brandAssets } from '@/lib/brand-assets'

export function NotFoundPage() {
  const router = useRouter()

  return (
    <main className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-[960px] flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between border-b border-hairline pb-5">
          <Link
            href="/overview"
            className="inline-flex items-center gap-3"
            aria-label="Whats91 Developers home"
          >
            <img
              src={brandAssets.wordmark}
              alt={brandAssets.name}
              width={112}
              height={31}
              className="h-7 w-auto"
            />
            <span className="h-4 w-px bg-hairline" aria-hidden="true" />
            <span className="rounded-md bg-surface px-2 py-0.5 text-[12px] font-medium tracking-wide text-mist">
              Developers
            </span>
          </Link>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="max-w-[620px]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-1 font-mono text-[13px] font-semibold text-mist">
              <Search className="h-3.5 w-3.5 text-faint" aria-hidden="true" />
              404
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.02em] text-ink sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-7 text-mist">
              The page may have moved, the URL may be incorrect, or the documentation section may no longer exist.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-hairline bg-card px-4 text-sm font-medium text-ink transition-colors hover:bg-surface"
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </button>
              <Link
                href="/overview"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Home className="h-4 w-4" />
                Go home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
