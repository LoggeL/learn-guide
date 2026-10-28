import { permanentRedirect } from 'next/navigation'

export default function MergedMoeTopic({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale === 'de' ? 'de' : 'en'}/ai/llm/feed-forward-networks-moe`)
}
