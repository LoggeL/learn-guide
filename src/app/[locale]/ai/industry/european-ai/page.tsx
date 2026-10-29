import { permanentRedirect } from 'next/navigation'

// Merged into "Open Models & Digital Sovereignty" (industry/open-source).
export default function MergedEuropeanAiTopic({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale === 'de' ? 'de' : 'en'}/ai/industry/open-source#european-players`)
}
