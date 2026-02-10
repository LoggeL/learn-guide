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
      x: 5 + (i * 90) / (count - 1), // evenly spaced across 5%-95%
      y: 50, // straight horizontal line
      eaten: false,
    })
  }
  return docs
}

function BrainPacmanOverlay({ onComplete }: { onComplete: () => void }) {
  const [brainX, setBrainX] = useState(-8)
  const [docs, setDocs] = useState(generateDocs)
  const [mouthDeg, setMouthDeg] = useState(0)
  const frameRef = useRef<number>()
  const startTime = useRef(Date.now())

  useEffect(() => {
    const duration = 4500
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const currentX = -8 + progress * 116

      // Smooth chomp: oscillate mouth angle
      const chomp = Math.abs(Math.sin(elapsed * 0.012)) * 35

      setBrainX(currentX)
      setMouthDeg(chomp)

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

  // Build clip-path for pac-man mouth
  const mouthRad = (mouthDeg * Math.PI) / 180
  const topY = 50 - Math.sin(mouthRad) * 50
  const topX = 50 + Math.cos(mouthRad) * 50
  const botY = 50 + Math.sin(mouthRad) * 50
  const botX = 50 + Math.cos(mouthRad) * 50
  const clipPath = `polygon(${topX}% ${topY}%, 50% 50%, ${botX}% ${botY}%, 100% 75%, 100% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 25%)`

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
          fontSize: '3rem',
          filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.5))',
        }}
      >
        <div style={{ clipPath, transition: 'clip-path 0.05s linear' }}>
          🧠
        </div>
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
