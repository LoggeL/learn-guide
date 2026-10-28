import { permanentRedirect } from 'next/navigation'

// Merged into the vision article (part 3: tool-assisted inspection).
export default function MergedVisionTopic({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale === 'de' ? 'de' : 'en'}/ai/llm/vision#tool-inspection`)
}
