'use client'

import { type ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

/**
 * Wraps the app in framer-motion's MotionConfig so all motion components
 * respect the user's prefers-reduced-motion setting.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
