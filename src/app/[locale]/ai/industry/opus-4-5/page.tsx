import { redirect } from 'next/navigation'

export default function Opus45RedirectPage({
  params,
}: {
  params: { locale: string }
}) {
  redirect(`/${params.locale}/ai/industry/logges-favourite-model`)
}
