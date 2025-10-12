import React, { ReactNode, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LazyImage } from '@/components/LazyImage'
import { Button } from '@/components/ui/button'
import { Scale, Calculator } from 'lucide-react'

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
  aspectRatio?: string
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
  aspectRatio,
  children
}: ScrollPanBackgroundProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  return (
    <section 
      ref={sectionRef} 
      className={`relative w-full overflow-hidden ${minHeightClass} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Background image: Suspense fallback shows static image until Motion chunk loads */}
      <ErrorBoundary fallback={() => (
        <LazyImage
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          priority={true}
        />
      )}>
        <Suspense
          fallback={
            <LazyImage
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
              priority={true}
            />
          }
        >
          <MotionBG src={src} alt={alt} panX={panX} panY={panY} zoom={zoom} sectionRef={sectionRef} />
        </Suspense>
      </ErrorBoundary>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" style={{ zIndex: 10 }} />

      {/* Content overlay slot */}
      {children && (
        <div className={`absolute inset-0 z-30 flex ${overlayClassName}`} style={{ zIndex: 30 }}>
          {children}
        </div>
      )}
    </section>
  )
}


