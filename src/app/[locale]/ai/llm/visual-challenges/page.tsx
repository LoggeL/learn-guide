import { permanentRedirect } from 'next/navigation'

// Merged into the vision article (part 2: failure modes).
export default function MergedVisionTopic({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale === 'de' ? 'de' : 'en'}/ai/llm/vision#failures`)
}
