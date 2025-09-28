import React, { ReactNode, Suspense, useRef } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const MotionBG = React.lazy(() => import('./ScrollPanBackgroundMotion'))

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
 * Framer Motion is lazy-loaded to avoid hydration and vendor bundling issues.
 * Respects prefers-reduced-motion and falls back to static image (Suspense fallback).
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

  return (
    <section ref={sectionRef} className={`relative w-full overflow-hidden ${minHeightClass} ${className}`}>
      {/* Background image: Suspense fallback shows static image until Motion chunk loads */}
      <ErrorBoundary fallback={() => (
        <img
          src={src}
          alt={alt}
          aria-hidden={alt === ''}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          style={{ zIndex: 1 }}
        />
      )}>
        <Suspense
          fallback={
            <img
              src={src}
              alt={alt}
              aria-hidden={alt === ''}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              style={{ zIndex: 1 }}
            />
          }
        >
          <MotionBG src={src} alt={alt} panX={panX} panY={panY} zoom={zoom} sectionRef={sectionRef} />
        </Suspense>
      </ErrorBoundary>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/50 pointer-events-none" style={{ zIndex: 10 }} />
      
      {/* Title overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ zIndex: 20 }}>
        <h1 className="text-6xl font-bold text-white drop-shadow-2xl">Pentulaskuri</h1>
      </div>
      
      {/* Overlay slot */}
      {children && (
        <div className={`absolute inset-0 z-30 flex ${overlayClassName}`} style={{ zIndex: 30 }}>
          {children}
        </div>
      )}
    </section>
  )
}


