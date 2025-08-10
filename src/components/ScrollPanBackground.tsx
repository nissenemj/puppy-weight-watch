import React, { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface ScrollPanBackgroundProps {
  src: string
  alt?: string
  panX?: number
  panY?: number
  zoom?: number
  minHeightClass?: string
  className?: string
  overlayClassName?: string
  children?: ReactNode
}

/**
 * Pan + subtle zoom background that reacts to vertical scroll within its section.
 * Respects prefers-reduced-motion and falls back to static image.
 */
export default function ScrollPanBackground({
  src,
  alt = '',
  panX = 100,
  panY = 50,
  zoom = 1.1,
  minHeightClass = 'min-h-[80svh]',
  className = '',
  overlayClassName = '',
  children
}: ScrollPanBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Compute transforms: from -half pan to +half pan; scale from 1 to zoom
  const x = useTransform(scrollYProgress, [0, 1], [-panX / 2, panX / 2])
  const y = useTransform(scrollYProgress, [0, 1], [-panY / 2, panY / 2])
  const scale = useTransform(scrollYProgress, [0, 1], [1, zoom])

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden ${minHeightClass} ${className}`}>
      {/* Background image */}
      {reduceMotion ? (
        <img
          src={src}
          alt={alt}
          aria-hidden={alt === ''}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />
      ) : (
        <motion.img
          src={src}
          alt={alt}
          aria-hidden={alt === ''}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none will-change-transform"
          style={{ x, y, scale }}
        />
      )}

      {/* Overlay slot */}
      {children && (
        <div className={`relative z-10 w-full h-full flex items-center justify-center ${overlayClassName}`}>
          {children}
        </div>
      )}
    </section>
  )
}


