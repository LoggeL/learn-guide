'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

interface CacheHitMissAnimationProps {
  t: Record<string, string>
}

const TOTAL_TOKENS = 1200
const CACHED_TOKENS = 1000
const NEW_TOKENS = TOTAL_TOKENS - CACHED_TOKENS

// Simulated costs per token
const COST_PER_TOKEN = 0.000003 // $3.00 per MTok
const CACHED_COST_PER_TOKEN = 0.0000003 // 90% savings on cached

// Animation durations in ms
const MISS_DURATION = 4000
const HIT_CACHE_LOAD_DURATION = 400
const HIT_NEW_TOKENS_DURATION = 1100
const TICK_INTERVAL = 50

export function CacheHitMissAnimation({ t }: CacheHitMissAnimationProps) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')

  // Miss state
  const [missTokens, setMissTokens] = useState(0)
  const [missTime, setMissTime] = useState(0)

  // Hit state
  const [hitCachedTokens, setHitCachedTokens] = useState(0)
  const [hitNewTokens, setHitNewTokens] = useState(0)
  const [hitTime, setHitTime] = useState(0)
  const [hitPhase, setHitPhase] = useState<'idle' | 'loading-cache' | 'processing-new' | 'done'>('idle')

  const missIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hitCacheIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hitNewIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const cleanup = useCallback(() => {
    if (missIntervalRef.current) clearInterval(missIntervalRef.current)
    if (hitCacheIntervalRef.current) clearInterval(hitCacheIntervalRef.current)
    if (hitNewIntervalRef.current) clearInterval(hitNewIntervalRef.current)
    missIntervalRef.current = null
    hitCacheIntervalRef.current = null
    hitNewIntervalRef.current = null
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setPhase('idle')
    setMissTokens(0)
    setMissTime(0)
    setHitCachedTokens(0)
    setHitNewTokens(0)
    setHitTime(0)
    setHitPhase('idle')
  }, [cleanup])

  const startAnimation = useCallback(() => {
    reset()
    setPhase('running')

    // --- Cache Miss: process all tokens over MISS_DURATION ---
    const missTokensPerTick = TOTAL_TOKENS / (MISS_DURATION / TICK_INTERVAL)
    const missTimePerTick = 850 / (MISS_DURATION / TICK_INTERVAL) // simulated 850ms total
    let missElapsed = 0

    missIntervalRef.current = setInterval(() => {
      missElapsed += TICK_INTERVAL
      const progress = Math.min(missElapsed / MISS_DURATION, 1)
      setMissTokens(Math.round(progress * TOTAL_TOKENS))
      setMissTime(Math.round(progress * 850))

      if (progress >= 1) {
        if (missIntervalRef.current) clearInterval(missIntervalRef.current)
        missIntervalRef.current = null
      }
    }, TICK_INTERVAL)

    // --- Cache Hit: fast cache load, then process new tokens ---
    setHitPhase('loading-cache')
    const cacheTokensPerTick = CACHED_TOKENS / (HIT_CACHE_LOAD_DURATION / TICK_INTERVAL)
    let hitCacheElapsed = 0

    hitCacheIntervalRef.current = setInterval(() => {
      hitCacheElapsed += TICK_INTERVAL
      const progress = Math.min(hitCacheElapsed / HIT_CACHE_LOAD_DURATION, 1)
      setHitCachedTokens(Math.round(progress * CACHED_TOKENS))
      setHitTime(Math.round(progress * 50)) // cache load takes ~50ms simulated

      if (progress >= 1) {
        if (hitCacheIntervalRef.current) clearInterval(hitCacheIntervalRef.current)
        hitCacheIntervalRef.current = null
        setHitPhase('processing-new')

        // Now process new tokens
        let hitNewElapsed = 0
        hitNewIntervalRef.current = setInterval(() => {
          hitNewElapsed += TICK_INTERVAL
          const newProgress = Math.min(hitNewElapsed / HIT_NEW_TOKENS_DURATION, 1)
          setHitNewTokens(Math.round(newProgress * NEW_TOKENS))
          setHitTime(50 + Math.round(newProgress * 95)) // new tokens take ~95ms simulated

          if (newProgress >= 1) {
            if (hitNewIntervalRef.current) clearInterval(hitNewIntervalRef.current)
            hitNewIntervalRef.current = null
            setHitPhase('done')
          }
        }, TICK_INTERVAL)
      }
    }, TICK_INTERVAL)

    // Mark done after miss completes (it's the longer one)
    setTimeout(() => {
      setPhase('done')
    }, MISS_DURATION + 200)
  }, [reset, cleanup])

  // Cleanup on unmount
  useEffect(() => {
    return cleanup
  }, [cleanup])

  const missProgress = (missTokens / TOTAL_TOKENS) * 100
  const hitCacheProgress = (hitCachedTokens / CACHED_TOKENS) * 100
  const hitNewProgress = (hitNewTokens / NEW_TOKENS) * 100
  const hitTotalProgress = ((hitCachedTokens + hitNewTokens) / TOTAL_TOKENS) * 100

  const missCost = (missTokens * COST_PER_TOKEN).toFixed(4)
  const hitCost = (hitCachedTokens * CACHED_COST_PER_TOKEN + hitNewTokens * COST_PER_TOKEN).toFixed(4)

  return (
    <div className="space-y-6">
      {/* Prompt Display */}
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <div className="text-xs text-muted uppercase tracking-wider mb-3 font-heading">
          {t.animTitle}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-[10px] uppercase text-green-400 font-medium mb-1">
              {t.animCachedPrefix}
            </div>
            <div className="text-sm text-green-300 font-mono">
              {t.animSystemPrompt}
            </div>
          </div>
          <div className="text-muted text-lg">+</div>
          <div className="px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-[10px] uppercase text-cyan-400 font-medium mb-1">
              {t.animNewTokens}
            </div>
            <div className="text-sm text-cyan-300 font-mono">
              {t.animUserQuery}
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: Miss vs Hit */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Cache Miss */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <h3 className="font-heading font-semibold text-red-400">
              {t.animCacheMiss}
            </h3>
          </div>

          {/* Progress bar */}
          <div>
            <div className="h-3 rounded-full bg-surface-elevated overflow-hidden border border-border">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${missProgress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
            <div className="text-xs text-muted mt-2">
              {phase !== 'idle'
                ? t.animProcessingAll
                    .replace('{total}', TOTAL_TOKENS.toLocaleString())
                : '\u00A0'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animTokensProcessed}</div>
              <div className="text-lg font-bold font-mono text-red-400">
                {missTokens.toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animTimeElapsed}</div>
              <div className="text-lg font-bold font-mono text-orange-400">
                {missTime}ms
              </div>
            </div>
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animCost}</div>
              <div className="text-lg font-bold font-mono text-red-400">
                ${missCost}
              </div>
            </div>
          </div>
        </div>

        {/* Cache Hit */}
        <div className="p-5 rounded-2xl bg-surface border border-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <h3 className="font-heading font-semibold text-green-400">
              {t.animCacheHit}
            </h3>
          </div>

          {/* Progress bar (two segments) */}
          <div>
            <div className="h-3 rounded-full bg-surface-elevated overflow-hidden border border-border flex">
              <motion.div
                className="h-full bg-green-500"
                style={{ borderRadius: hitNewTokens > 0 ? '9999px 0 0 9999px' : '9999px' }}
                initial={{ width: 0 }}
                animate={{ width: `${(hitCachedTokens / TOTAL_TOKENS) * 100}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
              <motion.div
                className="h-full bg-cyan-500"
                style={{ borderRadius: '0 9999px 9999px 0' }}
                initial={{ width: 0 }}
                animate={{ width: `${(hitNewTokens / TOTAL_TOKENS) * 100}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
            <div className="text-xs text-muted mt-2">
              {hitPhase === 'loading-cache' && t.animLoadedCached
                .replace('{cached}', hitCachedTokens.toLocaleString())
                .replace('{total}', CACHED_TOKENS.toLocaleString())}
              {hitPhase === 'processing-new' && t.animProcessingNew
                .replace('{new}', hitNewTokens.toLocaleString())
                .replace('{total}', NEW_TOKENS.toLocaleString())}
              {hitPhase === 'done' && t.animLoadedCached
                .replace('{cached}', CACHED_TOKENS.toLocaleString())
                .replace('{total}', CACHED_TOKENS.toLocaleString())
                + ' ' + t.animProcessingNew
                .replace('{new}', NEW_TOKENS.toLocaleString())
                .replace('{total}', NEW_TOKENS.toLocaleString())}
              {hitPhase === 'idle' && '\u00A0'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animTokensProcessed}</div>
              <div className="text-lg font-bold font-mono text-green-400">
                {(hitCachedTokens + hitNewTokens).toLocaleString()}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animTimeElapsed}</div>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {hitTime}ms
              </div>
            </div>
            <div className="p-2 rounded-lg bg-surface-elevated text-center">
              <div className="text-[10px] text-muted uppercase">{t.animCost}</div>
              <div className="text-lg font-bold font-mono text-green-400">
                ${hitCost}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Play / Replay button */}
      <div className="flex justify-center">
        <button
          onClick={phase === 'done' ? () => { reset(); setTimeout(startAnimation, 50) } : startAnimation}
          disabled={phase === 'running'}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all
            ${phase === 'running'
              ? 'bg-surface-elevated border border-border text-muted cursor-not-allowed'
              : 'bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 hover:border-violet-500/60'
            }
          `}
        >
          {phase === 'done' ? (
            <>
              <RotateCcw className="w-4 h-4" />
              {t.animReplay}
            </>
          ) : phase === 'running' ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full"
              />
              {t.animProcessingAll.replace('{total}', TOTAL_TOKENS.toLocaleString())}
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {t.animPlay}
            </>
          )}
        </button>
      </div>

      {/* Summary after done */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center"
          >
            <div className="text-sm text-green-400 font-medium">
              {t.animDesc}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-muted">
              <div>
                <span className="text-green-400 font-bold text-lg">
                  {Math.round((1 - 145 / 850) * 100)}%
                </span>
                <br />
                {t.animTimeElapsed}
              </div>
              <div>
                <span className="text-green-400 font-bold text-lg">
                  {Math.round((1 - parseFloat(hitCost) / parseFloat(missCost)) * 100)}%
                </span>
                <br />
                {t.animCost}
              </div>
              <div>
                <span className="text-green-400 font-bold text-lg">
                  {CACHED_TOKENS.toLocaleString()}
                </span>
                <br />
                {t.animCachedPrefix}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
