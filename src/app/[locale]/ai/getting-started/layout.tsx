import type { Metadata } from 'next'
import { getTopicMetadata, getTopicJsonLd } from '@/lib/seo'
import type { Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return getTopicMetadata('getting-started', params.locale as Locale)
}

export default function Layout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const jsonLd = getTopicJsonLd('getting-started', params.locale as Locale)
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  )
}
