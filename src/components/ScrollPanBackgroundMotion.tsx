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
  const scale = useTransform(scrollYProgress, [0, 1], [zoom, zoom])

  // Respect reduced motion: show static image without transforms
  if (reduceMotion) {
    return (
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === ''}
        className="bg-pan-image absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
        style={{ zIndex: 1 }}
      />
    )
  }

  return (
    <motion.img
      src={src}
      alt={alt}
      aria-hidden={alt === ''}
      className="bg-pan-image absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none will-change-transform"
      style={{ x, y, scale, zIndex: 1, transformOrigin: '50% 50%' }}
    />
  )
}
