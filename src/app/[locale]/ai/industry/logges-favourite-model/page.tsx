import { permanentRedirect } from 'next/navigation'

export default function FavouriteModelsPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale === 'de' ? 'de' : 'en'
  permanentRedirect(`/${locale}/ai/industry/tier-list`)
}
