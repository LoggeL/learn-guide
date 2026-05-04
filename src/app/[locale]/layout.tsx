import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n'
import { LocaleProvider } from '@/lib/i18n/context'
import { getHomepageJsonLd } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale as Locale
  const dict = getDictionary(isValidLocale(locale) ? locale : 'en')

  return {
    metadataBase: new URL('https://learn.logge.top'),
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: ['AI', 'Machine Learning', 'LLM', 'Temperature', 'Attention', 'Transformer', 'Interactive Learning'],
    authors: [{ name: 'Learn AI' }],
    icons: {
      icon: '/favicon.svg',
    },
    alternates: {
      canonical: `https://learn.logge.top/${locale}`,
      languages: {
        en: 'https://learn.logge.top/en',
        de: 'https://learn.logge.top/de',
      },
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
      url: `https://learn.logge.top/${locale}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      alternateLocale: locale === 'de' ? 'en_US' : 'de_DE',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Learn AI - Interactive Guide to Artificial Intelligence',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: ['/og-image.png'],
    },
  }
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }]
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const locale = params.locale
  
  if (!isValidLocale(locale)) {
    notFound()
  }

  const dictionary = getDictionary(locale)

  const jsonLdItems = getHomepageJsonLd(locale)

  return (
    <html lang={locale} className="dark overflow-x-hidden">
      <body className="bg-background text-text min-h-screen antialiased overflow-x-hidden bg-ambient">
        {jsonLdItems.map((item, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
          />
        ))}
        {/* Ambient dashboard grid */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(148,163,184,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.55)_1px,transparent_1px)] [background-size:56px_56px]" />
          <div className="absolute top-0 left-[18rem] h-px w-[calc(100vw-18rem)] bg-gradient-to-r from-primary/40 via-secondary/20 to-transparent" />
          <div className="absolute top-[-12rem] left-1/3 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10rem] right-[8rem] h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-[110px]" />
        </div>
        
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <Sidebar />
          <main className="main-content min-h-screen overflow-auto relative px-4 py-5 md:px-6 md:py-6 xl:px-7">
            {children}
          </main>
        </LocaleProvider>
        {/* Cloudflare Web Analytics */}
        <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "6c4d6e2bf331427b9c62c4951a8d2346"}' />
      </body>
    </html>
  )
}
