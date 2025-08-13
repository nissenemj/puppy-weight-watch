import React, { useEffect, useState } from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

interface ScrollProgressBarProps {
  heightClassName?: string
  colorClassName?: string
  className?: string
}

/**
 * Thin top progress bar that indicates page scroll progress.
 * - Uses framer-motion useScroll for smooth updates
 * - Respects prefers-reduced-motion
 * - Includes hydration safety check
 */
export default function ScrollProgressBar({
  heightClassName = 'h-1',
  colorClassName = 'bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-primary)] to-[var(--color-accent)]',
  className = ''
}: ScrollProgressBarProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Wait for hydration to avoid SSR/client mismatch
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 120,
    damping: reduceMotion ? 200 : 20,
    mass: 0.2
  })

  // Don't render until hydrated to prevent React hooks issues
  if (!isHydrated) {
    return (
      <div className={`fixed top-0 left-0 right-0 z-[10000] ${heightClassName} ${className}`}>
        <div className={`w-full h-full ${colorClassName}`} />
      </div>
    )
  }

  return (
    <motion.div
      aria-hidden
      className={`fixed top-0 left-0 right-0 z-[10000] ${heightClassName} ${className}`}
      style={{
        transformOrigin: '0% 0%',
        scaleX
      }}
    >
      <div className={`w-full h-full ${colorClassName}`} />
    </motion.div>
  )
}


