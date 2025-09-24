import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Touch device detection
const isTouchDevice = () => {
  if (typeof window !== 'undefined') {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  }
  return false
}

// Enhanced touch interaction props
interface TouchInteractionProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onPress?: () => void
  feedback?: 'scale' | 'ripple' | 'glow' | 'none'
  feedbackIntensity?: 'low' | 'medium' | 'high'
  touchTargetSize?: 'sm' | 'md' | 'lg'
  role?: string
  ariaLabel?: string
  href?: string
  as?: 'button' | 'div' | 'a' | 'span'
}

// Touch ripple effect component
const TouchRipple: React.FC<{
  x: number
  y: number
  onComplete: () => void
}> = ({ x, y, onComplete }) => (
  <motion.div
    className="absolute rounded-full bg-white/30 pointer-events-none"
    initial={{
      scale: 0,
      opacity: 1,
      x: x - 25,
      y: y - 25,
      width: 50,
      height: 50,
    }}
    animate={{
      scale: 4,
      opacity: 0,
    }}
    transition={{
      duration: 0.6,
      ease: "easeOut"
    }}
    onAnimationComplete={onComplete}
  />
)

export const TouchInteraction: React.FC<TouchInteractionProps> = ({
  children,
  className,
  disabled = false,
  onPress,
  feedback = 'scale',
  feedbackIntensity = 'medium',
  touchTargetSize = 'md',
  role,
  ariaLabel,
  href,
  as = 'button'
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number, x: number, y: number }>>([])
  const [isTouching, setIsTouching] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const isTouch = isTouchDevice()

  // Touch target sizes
  const touchSizes = {
    sm: 'min-h-[44px] min-w-[44px]',
    md: 'min-h-[48px] min-w-[48px]',
    lg: 'min-h-[52px] min-w-[52px]'
  }

  // Feedback intensities
  const feedbackScales = {
    low: { pressed: 0.98, intensity: 0.6 },
    medium: { pressed: 0.95, intensity: 0.8 },
    high: { pressed: 0.92, intensity: 1.0 }
  }

  const currentScale = feedbackScales[feedbackIntensity]

  // Handle press events
  const handlePress = useCallback(() => {
    if (disabled) return
    onPress?.()
  }, [disabled, onPress])

  // Handle ripple effect
  const createRipple = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (feedback !== 'ripple' || !elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])
  }, [feedback])

  const removeRipple = useCallback((id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id))
  }, [])

  // Touch event handlers
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    setIsTouching(true)
    setIsPressed(true)
    createRipple(event)
  }, [createRipple])

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false)
    setIsPressed(false)
    handlePress()
  }, [handlePress])

  // Mouse event handlers (for non-touch devices)
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (isTouch) return
    setIsPressed(true)
    createRipple(event)
  }, [isTouch, createRipple])

  const handleMouseUp = useCallback(() => {
    if (isTouch) return
    setIsPressed(false)
    handlePress()
  }, [isTouch, handlePress])

  const handleMouseLeave = useCallback(() => {
    if (isTouch) return
    setIsPressed(false)
  }, [isTouch])

  // Click handler for accessibility
  const handleClick = useCallback((event: React.MouseEvent) => {
    // Prevent double-firing on touch devices
    if (isTouching) {
      event.preventDefault()
      return
    }
    handlePress()
  }, [isTouching, handlePress])

  // Keyboard event handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setIsPressed(true)
      handlePress()
    }
  }, [handlePress])

  const handleKeyUp = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsPressed(false)
    }
  }, [])

  // Motion variants for different feedback types
  const motionVariants = {
    scale: {
      scale: isPressed ? currentScale.pressed : 1,
      transition: { duration: 0.1, ease: "easeOut" }
    },
    glow: {
      boxShadow: isPressed
        ? `0 0 20px rgba(224, 120, 86, ${currentScale.intensity * 0.6})`
        : '0 0 0px rgba(224, 120, 86, 0)',
      transition: { duration: 0.2, ease: "easeOut" }
    },
    none: {}
  }

  // Component classes
  const componentClasses = cn(
    'relative overflow-hidden',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--color-interactive-primary)]',
    'transition-all duration-200',
    'cursor-pointer select-none',
    'touch-manipulation',
    touchSizes[touchTargetSize],
    disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
    // Smart hover - only on devices that support hover
    !disabled && '[@media(hover:hover)]:hover:brightness-110',
    className
  )

  // Props for the element
  const elementProps = {
    ref: elementRef as any,
    className: componentClasses,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    role: role || (as === 'button' ? 'button' : undefined),
    'aria-label': ariaLabel,
    'aria-pressed': as === 'button' ? isPressed : undefined,
    tabIndex: disabled ? -1 : 0,
    ...(href && { href })
  }

  // Choose the right element type
  const Element = as as any

  return (
    <motion.div
      animate={feedback === 'scale' ? motionVariants.scale :
               feedback === 'glow' ? motionVariants.glow :
               motionVariants.none}
      style={{ position: 'relative' }}
    >
      <Element {...elementProps}>
        {children}

        {/* Ripple effects */}
        <AnimatePresence>
          {feedback === 'ripple' && ripples.map((ripple) => (
            <TouchRipple
              key={ripple.id}
              x={ripple.x}
              y={ripple.y}
              onComplete={() => removeRipple(ripple.id)}
            />
          ))}
        </AnimatePresence>
      </Element>
    </motion.div>
  )
}

// TouchTarget wrapper - simpler component for basic touch optimization
export const TouchTarget: React.FC<{
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}> = ({ children, className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'min-h-[44px] min-w-[44px]',
    md: 'min-h-[48px] min-w-[48px]',
    lg: 'min-h-[52px] min-w-[52px]'
  }

  return (
    <div className={cn(
      'flex items-center justify-center',
      'touch-manipulation',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  )
}

// Hook for mobile touch optimizations
export const useMobileTouch = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHoverSupported, setIsHoverSupported] = useState(true)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsHoverSupported(window.matchMedia('(hover: hover)').matches)
    }

    checkTouch()
    window.addEventListener('resize', checkTouch)

    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  return {
    isTouchDevice,
    isHoverSupported,
    shouldUseTouch: isTouchDevice && !isHoverSupported
  }
}