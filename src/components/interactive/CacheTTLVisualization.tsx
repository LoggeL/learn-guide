'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw } from 'lucide-react'

interface CacheTTLVisualizationProps {
  t: Record<string, string>
}

// Timeline: 0 to 15 minutes
const TIMELINE_MAX = 15
const TTL_WINDOW = 5

interface TimelineEvent {
  time: number
  type: 'create' | 'hit' | 'miss' | 'expire'
  label: string
}

// Events definition (times in minutes)
const REQUEST_TIMES = [0, 1, 2, 3, 4, 8, 9, 14]

// Calculate TTL state at each event
function computeEvents(t: Record<string, string>): TimelineEvent[] {
  const events: TimelineEvent[] = []
  let cacheExpiresAt = -1 // no cache initially

  for (const time of REQUEST_TIMES) {
    if (cacheExpiresAt < 0) {
      // No cache exists, create one
      events.push({ time, type: 'create', label: t.ttlCacheCreated })
      cacheExpiresAt = time + TTL_WINDOW
    } else if (time < cacheExpiresAt) {
      // Cache hit - refresh TTL
      events.push({ time, type: 'hit', label: t.ttlHitRefresh })
      cacheExpiresAt = time + TTL_WINDOW
    } else {
      // Cache expired - this is a miss, new cache created
      events.push({ time, type: 'miss', label: t.ttlCacheExpired })
      // After miss, a new cache is created
      cacheExpiresAt = time + TTL_WINDOW
    }
  }

  return events
}

// Calculate TTL segments (green bars)
function computeTTLSegments(events: TimelineEvent[]): Array<{ start: number; end: number }> {
  const segments: Array<{ start: number; end: number }> = []
  let currentStart = -1
  let currentEnd = -1

  for (const event of events) {
    if (event.type === 'create' || event.type === 'miss') {
      // If there was a previous segment, close it
      if (currentStart >= 0) {
        segments.push({ start: currentStart, end: Math.min(currentEnd, TIMELINE_MAX) })
      }
      currentStart = event.time
      currentEnd = event.time + TTL_WINDOW
    } else if (event.type === 'hit') {
      // Extend the current segment
      currentEnd = event.time + TTL_WINDOW
    }
  }
  // Close final segment
  if (currentStart >= 0) {
    segments.push({ start: currentStart, end: Math.min(currentEnd, TIMELINE_MAX) })
  }

  return segments
}

const ANIMATION_DURATION = 8000 // 8 seconds total for the timeline progression
const TICK_INTERVAL = 50

export function CacheTTLVisualization({ t }: CacheTTLVisualizationProps) {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [currentTime, setCurrentTime] = useState(0) // in minutes (0 to 15)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const events = computeEvents(t)
  const ttlSegments = computeTTLSegments(events)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    cleanup()
    setPhase('idle')
    setCurrentTime(0)
  }, [cleanup])

  const start = useCallback(() => {
    reset()
    // Small delay to let reset propagate
    setTimeout(() => {
      setPhase('running')
      const minutesPerTick = TIMELINE_MAX / (ANIMATION_DURATION / TICK_INTERVAL)

      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + minutesPerTick
          if (next >= TIMELINE_MAX) {
            cleanup()
            setPhase('done')
            return TIMELINE_MAX
          }
          return next
        })
      }, TICK_INTERVAL)
    }, 50)
  }, [reset, cleanup])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  // Calculate which events have been reached
  const visibleEvents = events.filter((e) => e.time <= currentTime)

  // Determine cache state at currentTime
  let cacheAlive = false
  let cacheExpiresAt = -1
  for (const event of visibleEvents) {
    if (event.type === 'create' || event.type === 'hit') {
      cacheExpiresAt = event.time + TTL_WINDOW
      cacheAlive = currentTime < cacheExpiresAt
    } else if (event.type === 'miss') {
      cacheExpiresAt = event.time + TTL_WINDOW
      cacheAlive = currentTime < cacheExpiresAt
    }
  }

  const timeToPercent = (time: number) => (time / TIMELINE_MAX) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs text-muted uppercase tracking-wider font-heading mb-1">
          {t.ttlTitle}
        </div>
        <p className="text-sm text-muted">{t.ttlDesc}</p>
      </div>

      {/* Current time display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">{t.ttlTimeMinutes}:</span>
          <span className="text-2xl font-bold font-mono text-text">
            {currentTime.toFixed(1)}
          </span>
          <span className="text-sm text-muted">/ {TIMELINE_MAX}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              cacheAlive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span
            className={`text-sm font-medium ${
              cacheAlive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {cacheAlive ? t.ttlCacheAlive : t.ttlCacheExpiredLabel}
          </span>
        </div>
      </div>

      {/* Timeline visualization */}
      <div className="relative p-6 rounded-2xl bg-surface border border-border">
        {/* Minute markers */}
        <div className="relative h-4 mb-2">
          {Array.from({ length: TIMELINE_MAX + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute text-[9px] text-muted font-mono transform -translate-x-1/2"
              style={{ left: `${timeToPercent(i)}%` }}
            >
              {i}
            </div>
          ))}
        </div>

        {/* Main timeline bar */}
        <div className="relative h-12 bg-surface-elevated rounded-xl border border-border overflow-hidden">
          {/* TTL segments (green bars) */}
          {ttlSegments.map((seg, i) => {
            const segStart = timeToPercent(seg.start)
            const segEnd = timeToPercent(Math.min(seg.end, currentTime))
            const segWidth = Math.max(segEnd - segStart, 0)

            // Only render if the segment has started
            if (seg.start > currentTime) return null

            return (
              <motion.div
                key={`seg-${i}`}
                className="absolute top-0 h-full bg-green-500/20 border-y border-green-500/30"
                initial={{ width: 0 }}
                animate={{
                  left: `${segStart}%`,
                  width: `${segWidth}%`,
                }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            )
          })}

          {/* Expiry zones (red after TTL ends) */}
          {ttlSegments.map((seg, i) => {
            if (seg.end > currentTime) return null
            const nextSegStart = i < ttlSegments.length - 1 ? ttlSegments[i + 1].start : TIMELINE_MAX
            const gapEnd = Math.min(nextSegStart, currentTime)
            if (gapEnd <= seg.end) return null

            return (
              <motion.div
                key={`expire-${i}`}
                className="absolute top-0 h-full bg-red-500/10 border-y border-red-500/20"
                style={{
                  left: `${timeToPercent(seg.end)}%`,
                  width: `${timeToPercent(gapEnd) - timeToPercent(seg.end)}%`,
                }}
              />
            )
          })}

          {/* Playhead */}
          {phase !== 'idle' && (
            <motion.div
              className="absolute top-0 h-full w-0.5 bg-violet-400 z-20"
              style={{ left: `${timeToPercent(currentTime)}%` }}
            />
          )}

          {/* Event dots */}
          {events.map((event, i) => {
            const visible = event.time <= currentTime
            if (!visible && phase !== 'done') return null

            const dotColor =
              event.type === 'create'
                ? 'bg-cyan-400 border-cyan-300'
                : event.type === 'hit'
                ? 'bg-green-400 border-green-300'
                : 'bg-red-400 border-red-300'

            return (
              <AnimatePresence key={`dot-${i}`}>
                {(visible || phase === 'done') && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: visible ? 1 : 0.3 }}
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full ${dotColor} border-2 z-10 cursor-default`}
                    style={{ left: `calc(${timeToPercent(event.time)}% - 8px)` }}
                    title={`t=${event.time}m: ${event.label}`}
                  />
                )}
              </AnimatePresence>
            )
          })}
        </div>

        {/* Tick marks */}
        <div className="relative h-2 mt-1">
          {Array.from({ length: TIMELINE_MAX + 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-2 bg-border"
              style={{ left: `${timeToPercent(i)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Event log */}
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <div className="text-xs text-muted uppercase tracking-wider mb-3 font-heading">
          {t.ttlTitle}
        </div>
        <div className="space-y-2 max-h-48 overflow-auto">
          <AnimatePresence>
            {visibleEvents.map((event, i) => {
              const iconColor =
                event.type === 'create'
                  ? 'bg-cyan-500'
                  : event.type === 'hit'
                  ? 'bg-green-500'
                  : 'bg-red-500'
              const textColor =
                event.type === 'create'
                  ? 'text-cyan-400'
                  : event.type === 'hit'
                  ? 'text-green-400'
                  : 'text-red-400'

              return (
                <motion.div
                  key={`log-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className={`w-2 h-2 rounded-full ${iconColor} shrink-0`} />
                  <span className="text-muted font-mono text-xs w-12 shrink-0">
                    t={event.time}m
                  </span>
                  <span className={`${textColor} font-medium`}>{event.label}</span>
                  {event.type !== 'miss' && (
                    <span className="text-xs text-muted ml-auto hidden sm:inline">
                      TTL &rarr; {event.time + TTL_WINDOW}m
                    </span>
                  )}
                  {event.type === 'miss' && (
                    <span className="text-xs text-muted ml-auto hidden sm:inline">
                      {t.ttlNewCache} &rarr; TTL {event.time + TTL_WINDOW}m
                    </span>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          {visibleEvents.length === 0 && (
            <div className="text-sm text-muted text-center py-4">
              {t.ttlPlay}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-300" />
          {t.ttlCacheCreated}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 border border-green-300" />
          {t.ttlHitRefresh}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400 border border-red-300" />
          {t.ttlCacheExpired}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-3 rounded-sm bg-green-500/20 border border-green-500/30" />
          {t.ttlCacheAlive}
        </span>
      </div>

      {/* Play / Reset button */}
      <div className="flex justify-center">
        <button
          onClick={phase === 'done' ? () => { reset(); setTimeout(start, 50) } : phase === 'idle' ? start : reset}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all
            ${phase === 'running'
              ? 'bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30'
              : 'bg-violet-500/20 border border-violet-500/40 text-violet-300 hover:bg-violet-500/30 hover:border-violet-500/60'
            }
          `}
        >
          {phase === 'done' ? (
            <>
              <RotateCcw className="w-4 h-4" />
              {t.ttlReset}
            </>
          ) : phase === 'running' ? (
            <>
              <RotateCcw className="w-4 h-4" />
              {t.ttlReset}
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              {t.ttlPlay}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
