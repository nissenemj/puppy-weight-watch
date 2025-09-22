import React, { MutableRefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

interface MotionProps {
  src: string
  alt?: string
  panX?: number
  panY?: number
  zoom?: number
  sectionRef: MutableRefObject<HTMLDivElement | null>
}

export default function ScrollPanBackgroundMotion({
  src,
  alt = '',
  panX = 100,
  panY = 50,
  zoom = 1.1,
  sectionRef
}: MotionProps) {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], [-panX / 2, panX / 2])
  const y = useTransform(scrollYProgress, [0, 1], [-panY / 2, panY / 2])
  const scale = useTransform(scrollYProgress, [0, 1], [1, zoom])

  // Respect reduced motion: render nothing here (static fallback is shown by Suspense in parent)
  if (reduceMotion) return null

  return (
    <motion.img
      src={src}
      alt={alt}
      aria-hidden={alt === ''}
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none will-change-transform"
      style={{ x, y, scale }}
    />
  )
}
