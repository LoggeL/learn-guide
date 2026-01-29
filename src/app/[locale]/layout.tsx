import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '../globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { getDictionary, isValidLocale, type Locale } from '@/lib/i18n'
import { LocaleProvider } from '@/lib/i18n/context'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale as Locale
  const dict = getDictionary(isValidLocale(locale) ? locale : 'en')
  
  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
    keywords: ['AI', 'Machine Learning', 'LLM', 'Temperature', 'Attention', 'Transformer', 'Interactive Learning'],
    authors: [{ name: 'Learn AI' }],
    icons: {
      icon: '/favicon.svg',
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      type: 'website',
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

  return (
    <html lang={locale} className="dark">
      <body className="bg-background text-text min-h-screen antialiased overflow-x-hidden">
        {/* Ambient background gradient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
        </div>
        
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <Sidebar />
          <main className="main-content p-6 md:p-10 overflow-auto min-h-screen relative">
            {children}
          </main>
        </LocaleProvider>
      </body>
    </html>
  )
}
