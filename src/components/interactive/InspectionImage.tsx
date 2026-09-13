'use client'

export const INSPECTION_IMAGE = '/images/vision/inspection-panel.png'
export const LABEL_CROP = [600, 580, 350, 190] as const

/** A viewport into the original image. Cropping does not invent missing pixels. */
export function InspectionImage({ crop = [0, 0, 1536, 1024], alt, children }: { crop?: readonly number[]; alt: string; children?: React.ReactNode }) {
  return <svg role="img" aria-label={alt} viewBox={crop.join(' ')} className="w-full rounded-lg bg-slate-200" style={{ aspectRatio: `${crop[2]} / ${crop[3]}` }}>
    <image href={INSPECTION_IMAGE} width="1536" height="1024" />{children}
  </svg>
}
