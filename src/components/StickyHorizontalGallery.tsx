import React, { ReactNode, useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion'

interface Item {
  id: string
  content: ReactNode
}

interface StickyHorizontalGalleryProps {
  items: Item[]
  className?: string
  heightClassName?: string
}

/**
 * Sticky section that pins to viewport while inner track scrolls horizontally.
 * Falls back to vertical list when reduced motion is preferred.
 */
export default function StickyHorizontalGallery({
  items,
  className = '',
  heightClassName = 'h-[70svh]'
}: StickyHorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef })

  // Track width: number of slides * 100vw
  const total = items.length
  const x = useTransform(scrollYProgress, [0, 1], [0, -(total - 1) * 100])
  const xVW = useMotionTemplate`${x}vw`
  if (reduceMotion) {
    return (
      <section className={`relative w-full ${className}`}>
        <div className="container mx-auto px-4 space-y-6">
          {items.map(item => (
            <div key={item.id} className="bg-card border rounded-xl p-4 shadow-sm">
              {item.content}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className={`relative w-full ${className}`}>
      <div className={`sticky top-16 ${heightClassName} overflow-hidden`}>
        <motion.div
          className="flex w-[100vw]"
          style={{ x: xVW }}
        >
          {items.map(item => (
            <div key={item.id} className="min-w-[100vw] px-4">
              <div className="h-full container mx-auto bg-card border rounded-xl p-6 shadow-sm">
                {item.content}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


