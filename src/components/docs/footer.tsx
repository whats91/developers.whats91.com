'use client'

import { brandAssets } from '@/lib/brand-assets'

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'API Dashboard', href: 'https://app.whats91.com/dashboard/customer/developer/api-tokens' },
      { label: 'Pricing', href: 'https://whats91.com/pricing' },
      { label: 'Changelog', href: '/changelog' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/' },
      { label: 'Blog', href: 'https://whats91.com/blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'https://whats91.com/about' },
      { label: 'Contact', href: 'https://whats91.com/contact' },
      { label: 'Careers', href: 'https://whats91.com/careers' },
      { label: 'Partners', href: 'https://whats91.com/partners' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: 'https://whats91.com/privacy' },
      { label: 'Terms of Service', href: 'https://whats91.com/terms' },
      { label: 'Refund Policy', href: 'https://whats91.com/refund' },
      { label: 'Compliance', href: 'https://whats91.com/compliance' },
      { label: 'Cookies', href: 'https://whats91.com/cookies' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline bg-panel">
      <div className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5 lg:gap-x-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a
              href="/overview"
              className="mb-4 inline-flex items-center"
              aria-label="Whats91 home"
            >
              <img
                src={brandAssets.wordmark}
                alt={brandAssets.name}
                width={112}
                height={31}
                className="h-7 w-auto"
              />
            </a>
            <p className="max-w-[220px] text-[13.5px] leading-relaxed text-mist">
              WhatsApp Business API platform for modern messaging at scale.
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[13.5px] text-mist transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-hairline-soft pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-faint">
            &copy; {new Date().getFullYear()} Whats91. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs text-faint">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-brand"
              aria-hidden="true"
            />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
