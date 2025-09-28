import React, { ReactNode, Suspense, useRef } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LazyImage } from '@/components/LazyImage'

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
        <LazyImage
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          priority={true}
        />
      )}>
        <Suspense
          fallback={
            <LazyImage
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              priority={true}
            />
          }
        >
          <MotionBG src={src} alt={alt} panX={panX} panY={panY} zoom={zoom} sectionRef={sectionRef} />
        </Suspense>
      </ErrorBoundary>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" style={{ zIndex: 10 }} />
      
      {/* Hero Content */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-4" style={{ zIndex: 20 }}>
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl mb-6 font-display">
            Pentulaskuri
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg mb-8 leading-relaxed">
            Pentusi parhaaksi – ammattitasoinen seuranta ja hoito-ohjaus koiran terveelle kasvulle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
              Aloita seuranta
            </button>
            <button className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105">
              Ruokalaskuri
            </button>
          </div>
        </div>
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


