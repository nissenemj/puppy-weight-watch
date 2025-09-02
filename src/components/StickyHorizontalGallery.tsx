import React, { ReactNode, useMemo, useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion'
import { Card } from '@/components/ui/card'

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
  // Work around Framer Motion hydration timing: set target after client mount
  const [scrollOptions, setScrollOptions] = useState<any>(undefined)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        setScrollOptions({ target: containerRef })
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [])
  const { scrollYProgress } = useScroll(scrollOptions)

  // Track width: number of slides * 100vw
  const total = items.length
  const x = useTransform(scrollYProgress, [0, 1], [0, -(total - 1) * 100])
  const xVW = useMotionTemplate`${x}vw`
  if (reduceMotion) {
    const cardVariants = ['gradient', 'glass', 'modern', 'elevated']
    
    return (
      <section className={`relative w-full py-16 ${className}`}>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card 
                  variant={cardVariants[index % cardVariants.length] as any}
                  className="aspect-square p-8 flex items-center justify-center text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-full ${
                    cardVariants[index % cardVariants.length] === 'gradient' ? 'text-white' : ''
                  }`}>
                    {item.content}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const cardVariants = ['gradient', 'glass', 'modern', 'elevated']
  
  return (
    <section ref={containerRef} className={`relative w-full ${className}`}>
      <div className={`sticky top-16 ${heightClassName} overflow-hidden`}>
        <motion.div
          className="flex w-[100vw]"
          style={{ x: xVW }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="min-w-[100vw] px-4">
              <div className="h-full container mx-auto flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                  {/* Create 2x2 grid by repeating the same content in different card styles */}
                  {Array.from({ length: 4 }, (_, cardIndex) => (
                    <motion.div
                      key={`${item.id}-${cardIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: cardIndex * 0.1 }}
                    >
                      <Card 
                        variant={cardVariants[cardIndex] as any}
                        className="aspect-square p-8 flex items-center justify-center text-center hover:scale-105 transition-transform duration-300"
                      >
                        <div className={`w-full ${
                          cardVariants[cardIndex] === 'gradient' ? 'text-white' : ''
                        }`}>
                          {item.content}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      {/* Spacer for scroll height */}
      <div style={{ height: `${total * 100}vh` }} />
    </section>
  )
}


