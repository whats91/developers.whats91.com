'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { brandAssets } from '@/lib/brand-assets'

export function NotFoundPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-white text-[#0a0a0a]">
      <div className="mx-auto flex min-h-screen w-full max-w-[960px] flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b border-[#e5e5e5] pb-5">
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
            <span className="h-4 w-px bg-[#e5e5e5]" aria-hidden="true" />
            <span className="text-sm font-medium text-[#5a5a5c]">
              Developers
            </span>
          </Link>
        </header>

        <section className="flex flex-1 items-center py-16">
          <div className="max-w-[620px]">
            <p className="mb-4 inline-flex rounded-md border border-[#e5e5e5] bg-[#f7f7f7] px-3 py-1 text-sm font-semibold text-[#5a5a5c]">
              404
            </p>
            <h1 className="text-4xl font-semibold tracking-normal text-[#0a0a0a] sm:text-5xl">
              Page not found
            </h1>
            <p className="mt-5 max-w-[560px] text-base leading-7 text-[#5a5a5c]">
              The page may have moved, the URL may be incorrect, or the documentation section may no longer exist.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[#d0d0d0] bg-white px-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#f7f7f7]"
              >
                <ArrowLeft className="h-4 w-4" />
                Go back
              </button>
              <Link
                href="/overview"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-[#00d4a4] px-4 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#00bf94]"
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
