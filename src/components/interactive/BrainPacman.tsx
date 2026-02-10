'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Document {
  id: number
  x: number
  y: number
  eaten: boolean
}

function generateDocs(): Document[] {
  const docs: Document[] = []
  const count = 12
  for (let i = 0; i < count; i++) {
    docs.push({
      id: i,
      x: 5 + (i * 90) / (count - 1),
      y: 50,
      eaten: false,
    })
  }
  return docs
}

/**
 * Build a CSS clip-path using path() for a smooth Pac-Man wedge mouth.
 * The mouth opens on the right side of a circle.
 * @param openRatio 0 (closed) to 1 (fully open)
 * @param size size in px of the element
 */
function buildMouthClipPath(openRatio: number, size: number): string {
  const r = size / 2
  const cx = r
  const cy = r
  const maxAngle = 42 // degrees half-angle when fully open
  const angle = openRatio * maxAngle
  const rad = (angle * Math.PI) / 180

  if (angle < 1) {
    return `circle(${r}px at ${cx}px ${cy}px)`
  }

  // Points where the mouth edges meet the circle
  const topX = cx + r * Math.cos(rad)
  const topY = cy - r * Math.sin(rad)
  const botX = cx + r * Math.cos(rad)
  const botY = cy + r * Math.sin(rad)

  // Arc from top mouth edge, counter-clockwise around the back, to bottom mouth edge
  // large-arc-flag=1, sweep-flag=0 (counter-clockwise)
  return `path('M ${cx} ${cy} L ${topX} ${topY} A ${r} ${r} 0 1 0 ${botX} ${botY} Z')`
}

function BrainPacmanOverlay({ onComplete }: { onComplete: () => void }) {
  const [brainX, setBrainX] = useState(-8)
  const [docs, setDocs] = useState(generateDocs)
  const [mouthOpen, setMouthOpen] = useState(0)
  const frameRef = useRef<number>()
  const startTime = useRef(Date.now())

  const brainSize = 64

  useEffect(() => {
    const duration = 4500
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const currentX = -8 + progress * 116

      // Satisfying chomp: use sin wave with power curve for snap-shut feel
      const chompCycle = (elapsed * 0.008) % (Math.PI * 2)
      const rawChomp = Math.sin(chompCycle)
      const chomp = rawChomp > 0 ? Math.pow(rawChomp, 0.5) : 0

      setBrainX(currentX)
      setMouthOpen(chomp)

      setDocs(prev =>
        prev.map(doc =>
          !doc.eaten && Math.abs(currentX - doc.x) < 4
            ? { ...doc, eaten: true }
            : doc
        )
      )

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [onComplete])

  const clipPath = buildMouthClipPath(mouthOpen, brainSize)

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Documents */}
      {docs.map(doc => (
        <div
          key={doc.id}
          className="absolute transition-all duration-200"
          style={{
            left: `${doc.x}%`,
            top: `${doc.y}%`,
            opacity: doc.eaten ? 0 : 1,
            transform: `translate(-50%, -50%) ${doc.eaten ? 'scale(0) rotate(180deg)' : 'scale(1)'}`,
            fontSize: '1.8rem',
          }}
        >
          📄
        </div>
      ))}

      {/* Brain Pac-Man */}
      <div
        className="absolute"
        style={{
          left: `${brainX}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${brainSize}px`,
          height: `${brainSize}px`,
          filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.5))',
        }}
      >
        {/* Brain emoji with clip-path mouth */}
        <div
          style={{
            width: `${brainSize}px`,
            height: `${brainSize}px`,
            fontSize: `${brainSize - 8}px`,
            lineHeight: `${brainSize}px`,
            textAlign: 'center',
            clipPath,
            transition: 'clip-path 0.03s linear',
          }}
        >
          🧠
        </div>

        {/* Eye */}
        <div
          style={{
            position: 'absolute',
            top: '18%',
            right: '16%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'white',
            border: '1.5px solid #1e1e2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: '#1e1e2e',
              marginLeft: '1px',
              marginTop: '-1px',
            }}
          />
        </div>

        {/* Sparkle trail */}
        {docs.some(d => d.eaten) && (
          <div
            className="absolute -left-6 top-1/2 -translate-y-1/2 flex gap-1"
            style={{ fontSize: '0.6rem', opacity: 0.6 }}
          >
            {['✨', '💫', '⚡'].map((e, i) => (
              <span
                key={i}
                className="animate-ping"
                style={{ animationDelay: `${i * 100}ms`, animationDuration: '0.8s' }}
              >
                {e}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export function useBrainPacman() {
  const [active, setActive] = useState(false)

  const handleTriggerClick = useCallback(() => {
    if (!active) setActive(true)
  }, [active])

  const overlay = active ? (
    <BrainPacmanOverlay onComplete={() => setActive(false)} />
  ) : null

  return { overlay, handleTriggerClick }
}

export default BrainPacmanOverlay
