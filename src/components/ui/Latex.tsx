'use client'

import 'katex/dist/katex.min.css'
// @ts-expect-error - react-katex doesn't have type definitions
import { InlineMath, BlockMath } from 'react-katex'

interface LatexProps {
  children: string
  block?: boolean
  className?: string
}

export function Latex({ children, block = false, className = '' }: LatexProps) {
  if (block) {
    return (
      <div className={className}>
        <BlockMath math={children} />
      </div>
    )
  }
  return <InlineMath math={children} />
}

export function LatexBlock({ children, className = '' }: { children: string; className?: string }) {
  return <Latex block className={className}>{children}</Latex>
}
