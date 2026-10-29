'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

type LicenseKey = 'apache' | 'mit' | 'llama4' | 'gemma'
type ScenarioKey = 'bigPlatform' | 'euMultimodal' | 'ownName' | 'revocation'
type Verdict = 'ok' | 'condition' | 'blocked'

const LICENSES: { key: LicenseKey; name: string; url: string; osi: boolean; models?: string }[] = [
  {
    key: 'apache',
    name: 'Apache-2.0',
    url: 'https://www.apache.org/licenses/LICENSE-2.0',
    osi: true,
    models: 'Gemma 4, Qwen3.6, Mistral Small 4, gpt-oss, Apertus',
  },
  { key: 'mit', name: 'MIT', url: 'https://opensource.org/license/mit', osi: true, models: 'DeepSeek V4' },
  {
    key: 'llama4',
    name: 'Llama 4 Community License',
    url: 'https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE',
    osi: false,
    models: 'Llama 4 Scout, Llama 4 Maverick',
  },
  { key: 'gemma', name: 'Gemma Terms of Use', url: 'https://ai.google.dev/gemma/terms', osi: false },
]

const SCENARIOS: ScenarioKey[] = ['bigPlatform', 'euMultimodal', 'ownName', 'revocation']

// Verdicts follow the license texts linked above (as of 2026-10-28).
const VERDICTS: Record<ScenarioKey, Record<LicenseKey, Verdict>> = {
  bigPlatform: { apache: 'ok', mit: 'ok', llama4: 'blocked', gemma: 'ok' },
  euMultimodal: { apache: 'ok', mit: 'ok', llama4: 'blocked', gemma: 'ok' },
  ownName: { apache: 'ok', mit: 'ok', llama4: 'condition', gemma: 'condition' },
  revocation: { apache: 'ok', mit: 'ok', llama4: 'condition', gemma: 'condition' },
}

const VERDICT_STYLE: Record<Verdict, { cls: string; Icon: typeof CheckCircle2 }> = {
  ok: { cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400', Icon: CheckCircle2 },
  condition: { cls: 'border-amber-400/30 bg-amber-400/10 text-amber-300', Icon: AlertTriangle },
  blocked: { cls: 'border-red-500/30 bg-red-500/10 text-red-400', Icon: XCircle },
}

export function OpenLicenseChecker() {
  const { t } = useTranslation()
  const o = t.openSource
  const [scenario, setScenario] = useState<ScenarioKey>('euMultimodal')

  const verdictLabel: Record<Verdict, string> = {
    ok: o.verdictOk,
    condition: o.verdictCondition,
    blocked: o.verdictBlocked,
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{o.scenarioLabel}</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SCENARIOS.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === scenario}
              onClick={() => setScenario(s)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                s === scenario
                  ? 'border-primary/50 bg-primary/10 text-text'
                  : 'border-border bg-surface/40 text-muted hover:text-text'
              }`}
            >
              {o.scenarios[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {LICENSES.map((lic) => {
          const verdict = VERDICTS[scenario][lic.key]
          const { cls, Icon } = VERDICT_STYLE[verdict]
          return (
            <motion.article
              key={lic.key}
              layout
              className="flex flex-col gap-3 rounded-xl border border-border bg-background/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <a
                  href={lic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-text underline decoration-border underline-offset-4 hover:text-primary-light"
                >
                  {lic.name}
                </a>
                <span className="shrink-0 rounded-md border border-border px-2 py-0.5 text-[11px] text-muted">
                  {o.colOsi}: {lic.osi ? o.yes : o.no}
                </span>
              </div>
              <dl className="space-y-1 text-xs text-muted">
                <div>
                  <dt className="inline font-semibold text-text">{o.colModels}: </dt>
                  <dd className="inline">{lic.models ?? o.licenseModels.gemma}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-text">{o.colDuties}: </dt>
                  <dd className="inline">{o.licDuties[lic.key]}</dd>
                </div>
              </dl>
              <motion.div
                key={`${scenario}-${lic.key}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`mt-auto rounded-lg border p-3 text-sm ${cls}`}
              >
                <div className="mb-1 flex items-center gap-1.5 font-semibold">
                  <Icon size={16} />
                  {verdictLabel[verdict]}
                </div>
                <p className="text-muted">{o.verdicts[scenario][lic.key]}</p>
              </motion.div>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
