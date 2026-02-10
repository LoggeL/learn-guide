'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

interface Document {
  id: number
  x: number // percentage across screen
  y: number // percentage down screen
  eaten: boolean
}

function generateDocs(): Document[] {
  const docs: Document[] = []
  for (let i = 0; i < 12; i++) {
    docs.push({
      id: i,
      x: 8 + i * 7.5,
      y: 45 + Math.sin(i * 0.8) * 15,
      eaten: false,
    })
  }
  return docs
}

function BrainPacmanOverlay({ onComplete }: { onComplete: () => void }) {
  const [brainX, setBrainX] = useState(-8)
  const [docs, setDocs] = useState(generateDocs)
  const [mouthOpen, setMouthOpen] = useState(true)
  const frameRef = useRef<number>()
  const startTime = useRef(Date.now())

  useEffect(() => {
    // Chomp animation
    const chompInterval = setInterval(() => setMouthOpen(v => !v), 150)
    return () => clearInterval(chompInterval)
  }, [])

  useEffect(() => {
    const duration = 4000 // ms to cross screen
    const animate = () => {
      const elapsed = Date.now() - startTime.current
      const progress = elapsed / duration
      const currentX = -8 + progress * 116 // from -8% to 108%

      setBrainX(currentX)

      // Check for eating
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
            transform: doc.eaten ? 'scale(0) rotate(180deg)' : 'scale(1) rotate(0deg)',
            fontSize: '2rem',
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
          top: '45%',
          transform: 'translate(-50%, -50%)',
          fontSize: '3.5rem',
          filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.5))',
        }}
      >
        {/* Pac-Man mouth effect via clip-path */}
        <div
          style={{
            clipPath: mouthOpen
              ? 'polygon(100% 0%, 100% 100%, 50% 50%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 50% 65%, 50% 35%)'
              : 'polygon(100% 0%, 100% 100%, 50% 50%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 50% 52%, 50% 48%)',
            transition: 'clip-path 0.15s ease',
          }}
        >
          🧠
        </div>
        {/* Particles behind when eating */}
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
  const [clickCount, setClickCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const handleTriggerClick = useCallback(() => {
    setClickCount(prev => {
      const next = prev + 1
      // Reset after 2 seconds of no clicks
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setClickCount(0), 2000)
      if (next >= 5) {
        setActive(true)
        return 0
      }
      return next
    })
  }, [])

  const overlay = active ? (
    <BrainPacmanOverlay onComplete={() => setActive(false)} />
  ) : null

  return { overlay, handleTriggerClick, clickCount }
}

export default BrainPacmanOverlay
