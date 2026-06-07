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
    <footer className="border-t border-[#e5e5e5] bg-white mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
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
            <p className="text-sm text-[#5a5a5c] leading-relaxed max-w-[220px]">
              WhatsApp Business API platform for modern messaging at scale.
            </p>
            <p className="mt-4 text-xs text-[#888888]">
              &copy; {new Date().getFullYear()} Whats91
            </p>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#0a0a0a] mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#5a5a5c] hover:text-[#0a0a0a] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
