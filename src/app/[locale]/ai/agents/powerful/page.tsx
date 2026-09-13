import { permanentRedirect } from 'next/navigation'

export default function MergedAgentTopic({ params }: { params: { locale: string } }) {
  permanentRedirect(`/${params.locale === 'de' ? 'de' : 'en'}/ai/agents/orchestration`)
}
