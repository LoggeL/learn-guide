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

function BrainPacmanOverlay({ onComplete }: { onComplete: () => void }) {
  const [brainX, setBrainX] = useState(-8)
  const [docs, setDocs] = useState(generateDocs)
  const [mouthOpen, setMouthOpen] = useState(0) // 0-1 range
  const frameRef = useRef<number>()
  const startTime = useRef(Date.now())

  useEffect(() => {
    const duration = 4500
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const currentX = -8 + progress * 116

      // Satisfying chomp: fast open, snap shut with easing
      // Use a saw-tooth-ish wave that opens fast and closes with a snap
      const chompCycle = (elapsed * 0.008) % (Math.PI * 2)
      const rawChomp = Math.sin(chompCycle)
      // Make it snap shut faster: use power curve
      const chomp = rawChomp > 0 ? Math.pow(rawChomp, 0.6) : 0

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

  // SVG arc-based clip path for smooth wedge mouth
  // Mouth opens on the right side, wedge angle from center
  const maxAngle = 45 // max half-angle in degrees
  const angle = mouthOpen * maxAngle
  const angleRad = (angle * Math.PI) / 180
  const radius = 50
  const cx = 50
  const cy = 50

  // Points on the circle edge for the mouth opening
  const topX = cx + radius * Math.cos(angleRad)
  const topY = cy - radius * Math.sin(angleRad)
  const botX = cx + radius * Math.cos(angleRad)
  const botY = cy + radius * Math.sin(angleRad)

  // SVG clip-path: full circle minus a wedge on the right
  // Draw: arc from top mouth edge, around the back, to bottom mouth edge, then lines to center
  const largeArc = 1 // always the large arc (going around the back)
  const clipId = 'brain-pacman-clip'

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Documents in a straight line */}
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
          width: '64px',
          height: '64px',
          filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.5))',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="64"
          height="64"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <defs>
            <clipPath id={clipId}>
              {angle < 0.5 ? (
                // Mouth basically closed — full circle
                <circle cx={cx} cy={cy} r={radius} />
              ) : (
                // Wedge cut-out: arc from top to bottom (going around back), then lines to center
                <path
                  d={`M ${cx} ${cy} L ${topX} ${topY} A ${radius} ${radius} 0 ${largeArc} 0 ${botX} ${botY} Z`}
                />
              )}
            </clipPath>
          </defs>

          {/* Brain emoji rendered as text, clipped */}
          <g clipPath={`url(#${clipId})`}>
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="72"
              style={{ userSelect: 'none' }}
            >
              🧠
            </text>
          </g>

          {/* Eye dot */}
          <circle
            cx="58"
            cy="30"
            r="4"
            fill="white"
            stroke="#1e1e2e"
            strokeWidth="1.5"
          />
          <circle cx="59" cy="29" r="1.8" fill="#1e1e2e" />
        </svg>

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
