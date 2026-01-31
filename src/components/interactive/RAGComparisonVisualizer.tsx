'use client'

import { ArrowRight, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function RAGComparisonVisualizer() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional RAG */}
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <ArrowRight size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-text">{t.rag.traditionalRag}</h3>
              <p className="text-xs text-muted">{t.rag.traditionalTagline}</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar1}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar2}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>{t.rag.traditionalChar3}</span>
            </li>
          </ul>
        </div>

        {/* Agentic RAG */}
        <div className="rounded-2xl border p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <RotateCcw size={20} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-bold font-heading text-text">{t.rag.agenticRag}</h3>
              <p className="text-xs text-muted">{t.rag.agenticTagline}</p>
            </div>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar1}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar2}</span>
            </li>
            <li className="flex gap-2 items-start text-muted">
              <span className="text-purple-400 mt-0.5">•</span>
              <span>{t.rag.agenticChar3}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl bg-surface border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-elevated">
              <th className="text-left p-4 font-semibold text-text">{t.rag.compAspect}</th>
              <th className="text-left p-4 font-semibold text-blue-400">{t.rag.traditionalRag}</th>
              <th className="text-left p-4 font-semibold text-purple-400">{t.rag.agenticRag}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowControl}</td>
              <td className="p-4 text-text">{t.rag.compControlTraditional}</td>
              <td className="p-4 text-text">{t.rag.compControlAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowRetrieval}</td>
              <td className="p-4 text-text">{t.rag.compRetrievalTraditional}</td>
              <td className="p-4 text-text">{t.rag.compRetrievalAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowQuery}</td>
              <td className="p-4 text-text">{t.rag.compQueryTraditional}</td>
              <td className="p-4 text-text">{t.rag.compQueryAgentic}</td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowLatency}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">{t.rag.compLatencyTraditional}</span>
              </td>
              <td className="p-4">
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs">{t.rag.compLatencyAgentic}</span>
              </td>
            </tr>
            <tr>
              <td className="p-4 text-muted">{t.rag.compRowBestFor}</td>
              <td className="p-4 text-text">{t.rag.compBestForTraditional}</td>
              <td className="p-4 text-text">{t.rag.compBestForAgentic}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
