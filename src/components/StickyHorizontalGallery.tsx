import React, { ReactNode, useMemo, useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionTemplate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { UserPlus, Scale, Calculator, BookOpen } from 'lucide-react'

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
 * Sticky section that creates smaller button-style navigation cards
 * Links to different sections of the app with appropriate icons
 */
export default function StickyHorizontalGallery({
  items,
  className = '',
  heightClassName = 'h-[50svh]'
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

  // Navigation buttons configuration
  const navigationButtons = [
    { 
      icon: UserPlus, 
      title: "Luo Profiili", 
      subtitle: "Aloita seuranta",
      link: "/puppy-book",
      variant: "default" as const
    },
    { 
      icon: Scale, 
      title: "Paino Seuranta", 
      subtitle: "Lisää mittaus",
      link: "/weight-tracker", 
      variant: "secondary" as const
    },
    { 
      icon: Calculator, 
      title: "Ruokalaskuri", 
      subtitle: "Laske annostelu",
      link: "/calculator", 
      variant: "outline" as const
    },
    { 
      icon: BookOpen, 
      title: "Oppaat", 
      subtitle: "Lue vinkit",
      link: "/guides", 
      variant: "ghost" as const
    }
  ]

  // Track width: number of slides * 100vw
  const total = items.length
  const x = useTransform(scrollYProgress, [0, 1], [0, -(total - 1) * 100])
  const xVW = useMotionTemplate`${x}vw`
  
  if (reduceMotion) {
    return (
      <section className={`w-full py-16 ${className}`}>
        <div className="w-full px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {navigationButtons.map((button, index) => {
              const IconComponent = button.icon
              return (
                <motion.div
                  key={button.link}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Button 
                    asChild
                    variant={button.variant}
                    size="lg"
                    className="w-full h-24 flex-col gap-2 text-center hover-scale animate-fade-in"
                  >
                    <Link to={button.link} aria-label={`${button.title} - ${button.subtitle}`}>
                      <IconComponent className="w-6 h-6" />
                      <div className="text-xs">
                        <div className="font-semibold">{button.title}</div>
                        <div className="opacity-80">{button.subtitle}</div>
                      </div>
                    </Link>
                  </Button>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section ref={containerRef} className={`w-full ${className}`}>
      <div className={`sticky top-16 ${heightClassName} overflow-hidden`}>
        <motion.div
          className="flex w-[100vw]"
          style={{ x: xVW }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="min-w-[100vw] px-4">
              <div className="h-full w-full flex items-center justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl px-4">
                  {navigationButtons.map((button, buttonIndex) => {
                    const IconComponent = button.icon
                    return (
                      <motion.div
                        key={`${item.id}-${button.link}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: buttonIndex * 0.1 }}
                      >
                        <Button 
                          asChild
                          variant={button.variant}
                          size="lg"
                          className="w-full h-28 flex-col gap-3 text-center hover-scale animate-fade-in shadow-lg"
                        >
                          <Link to={button.link} aria-label={`${button.title} - ${button.subtitle}`}>
                            <IconComponent className="w-8 h-8" />
                            <div className="text-sm">
                              <div className="font-semibold">{button.title}</div>
                              <div className="opacity-80">{button.subtitle}</div>
                            </div>
                          </Link>
                        </Button>
                      </motion.div>
                    )
                  })}
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


