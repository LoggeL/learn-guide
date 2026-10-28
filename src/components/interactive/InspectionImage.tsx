'use client'

import { useEffect, useRef, useState } from 'react'

export const INSPECTION_IMAGE = '/images/vision/inspection-panel.png'
export const IMAGE_W = 1536
export const IMAGE_H = 1024
/** Cap height of "SN-4827-XK", measured on the original file (rows 647–669). */
export const LABEL_CAP_HEIGHT = 23
/** Region around the white sticker in original pixels: x, y, width, height. */
export const LABEL_REGION = [632, 612, 268, 134] as const

export type Rect = readonly [number, number, number, number]

let imagePromise: Promise<HTMLImageElement> | null = null

function loadInspectionImage(): Promise<HTMLImageElement> {
  if (!imagePromise) {
    imagePromise = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = INSPECTION_IMAGE
    })
  }
  return imagePromise
}

export function useInspectionImage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    let alive = true
    loadInspectionImage().then(i => { if (alive) setImg(i) }).catch(() => {})
    return () => { alive = false }
  }, [])
  return img
}

/** Letterbox a source rectangle into a square or rectangular encoder canvas, preserving aspect ratio. */
export function fitInto(srcW: number, srcH: number, canvasW: number, canvasH: number) {
  const scale = Math.min(canvasW / srcW, canvasH / srcH)
  const w = Math.round(srcW * scale)
  const h = Math.round(srcH * scale)
  return { scale, w, h, x: Math.floor((canvasW - w) / 2), y: Math.floor((canvasH - h) / 2) }
}

interface ResampledViewProps {
  /** Source rectangle in original pixels. */
  source: Rect
  /** Size of the encoder canvas in pixels. */
  canvas: readonly [number, number]
  /** Where the resampled source lands inside the canvas: x, y, width, height. */
  target: Rect
  /** Optional sub-rectangle of the canvas to display magnified (encoder pixels stay blocky). */
  view?: Rect
  /** Grid spacing in canvas pixels (patch or token cell). */
  grid?: number
  /** Heavier grid lines every n canvas pixels (e.g. tile borders). */
  majorGrid?: number
  alt: string
  children?: React.ReactNode
}

/**
 * Really resamples the reference image to the encoder resolution in a canvas,
 * then shows the result (or a part of it) enlarged without smoothing.
 * Overlay children use canvas pixel coordinates.
 */
export function ResampledView({ source, canvas, target, view, grid, majorGrid, alt, children }: ResampledViewProps) {
  const img = useInspectionImage()
  const ref = useRef<HTMLCanvasElement>(null)
  const [cw, ch] = canvas
  const v: Rect = view ?? [0, 0, cw, ch]
  const key = [...source, cw, ch, ...target, ...v].join(',')

  useEffect(() => {
    const el = ref.current
    if (!el || !img) return
    const full = document.createElement('canvas')
    full.width = cw
    full.height = ch
    const fctx = full.getContext('2d')
    if (!fctx) return
    fctx.fillStyle = '#7f7f7f'
    fctx.fillRect(0, 0, cw, ch)
    fctx.imageSmoothingEnabled = true
    fctx.imageSmoothingQuality = 'high'
    fctx.drawImage(img, source[0], source[1], source[2], source[3], target[0], target[1], target[2], target[3])
    el.width = Math.max(1, Math.round(v[2]))
    el.height = Math.max(1, Math.round(v[3]))
    const ctx = el.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(full, v[0], v[1], v[2], v[3], 0, 0, el.width, el.height)
    // key encodes source, canvas, target and view; the arrays themselves may be recreated each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, key])

  const lines: React.ReactNode[] = []
  if (grid) {
    for (let x = grid; x < cw; x += grid) lines.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={ch} stroke="rgba(255,255,255,.45)" strokeWidth={v[2] / 400} />)
    for (let y = grid; y < ch; y += grid) lines.push(<line key={`y${y}`} x1={0} y1={y} x2={cw} y2={y} stroke="rgba(255,255,255,.45)" strokeWidth={v[2] / 400} />)
  }
  if (majorGrid) {
    for (let x = majorGrid; x < cw; x += majorGrid) lines.push(<line key={`X${x}`} x1={x} y1={0} x2={x} y2={ch} stroke="#fbbf24" strokeWidth={v[2] / 150} />)
    for (let y = majorGrid; y < ch; y += majorGrid) lines.push(<line key={`Y${y}`} x1={0} y1={y} x2={cw} y2={y} stroke="#fbbf24" strokeWidth={v[2] / 150} />)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-slate-500" style={{ aspectRatio: `${v[2]} / ${v[3]}` }}>
      <canvas ref={ref} role="img" aria-label={alt} className="absolute inset-0 h-full w-full" style={{ imageRendering: 'pixelated' }} />
      <svg viewBox={v.join(' ')} className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        {lines}
        {children}
      </svg>
    </div>
  )
}

/** The original file at full resolution with an optional SVG overlay in original pixel coordinates. */
export function OriginalView({ alt, children }: { alt: string; children?: React.ReactNode }) {
  return (
    <svg role="img" aria-label={alt} viewBox={`0 0 ${IMAGE_W} ${IMAGE_H}`} className="w-full rounded-lg bg-slate-200" style={{ aspectRatio: `${IMAGE_W} / ${IMAGE_H}` }}>
      <image href={INSPECTION_IMAGE} width={IMAGE_W} height={IMAGE_H} />
      {children}
    </svg>
  )
}
