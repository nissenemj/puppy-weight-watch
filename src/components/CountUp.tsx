import React, { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  to: number
  from?: number
  durationMs?: number
  decimals?: number
  suffix?: string
  className?: string
}

/**
 * Lightweight count-up component that starts when entering viewport.
 * Uses IntersectionObserver for visibility detection.
 */
export default function CountUp({
  to,
  from = 0,
  durationMs = 1200,
  decimals = 0,
  suffix = '',
  className = ''
}: CountUpProps) {
  const [value, setValue] = useState<number>(from)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.4 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = from + (to - from) * eased
      setValue(current)
      if (progress < 1) requestAnimationFrame(animate)
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [started, durationMs, from, to])

  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref} className={className}>
      {formatted}{suffix}
    </span>
  )
}


