import * as React from "react"
import { motion, PanInfo, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

interface SwipeGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
  disabled?: boolean
  hapticFeedback?: boolean
}

export const SwipeGesture = React.forwardRef<HTMLDivElement, SwipeGestureProps>(
  ({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    className,
    disabled = false,
    hapticFeedback = true,
    ...props
  }, ref) => {
    const controls = useAnimation()

    const triggerHapticFeedback = () => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(50) // Light haptic feedback
      }
    }

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled) return

      const { offset, velocity } = info
      const swipeConfidenceThreshold = 10000
      const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity
      }

      // Horizontal swipes
      if (swipePower(offset.x, velocity.x) > swipeConfidenceThreshold) {
        if (offset.x > threshold && onSwipeRight) {
          triggerHapticFeedback()
          onSwipeRight()
        } else if (offset.x < -threshold && onSwipeLeft) {
          triggerHapticFeedback()
          onSwipeLeft()
        }
      }

      // Vertical swipes
      if (swipePower(offset.y, velocity.y) > swipeConfidenceThreshold) {
        if (offset.y > threshold && onSwipeDown) {
          triggerHapticFeedback()
          onSwipeDown()
        } else if (offset.y < -threshold && onSwipeUp) {
          triggerHapticFeedback()
          onSwipeUp()
        }
      }

      // Reset position
      controls.start({ x: 0, y: 0 })
    }

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled) return

      // Provide visual feedback during drag
      const { offset } = info
      const maxOffset = 20

      // Limit drag distance for visual feedback
      const constrainedX = Math.max(-maxOffset, Math.min(maxOffset, offset.x * 0.3))
      const constrainedY = Math.max(-maxOffset, Math.min(maxOffset, offset.y * 0.3))

      controls.start({ x: constrainedX, y: constrainedY })
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative cursor-grab active:cursor-grabbing select-none",
          disabled && "cursor-default",
          className
        )}
        drag={!disabled}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        whileTap={{ scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

SwipeGesture.displayName = "SwipeGesture"

// Hook for detecting swipe gestures on any element
export const useSwipeGesture = (options: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  disabled?: boolean
}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    disabled = false
  } = options

  const startX = React.useRef<number>(0)
  const startY = React.useRef<number>(0)
  const endX = React.useRef<number>(0)
  const endY = React.useRef<number>(0)

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    if (disabled) return
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }, [disabled])

  const handleTouchEnd = React.useCallback((e: TouchEvent) => {
    if (disabled) return
    endX.current = e.changedTouches[0].clientX
    endY.current = e.changedTouches[0].clientY

    const deltaX = endX.current - startX.current
    const deltaY = endY.current - startY.current

    // Check if swipe distance exceeds threshold
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  }, [disabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

  const swipeHandlers = React.useMemo(() => ({
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }), [handleTouchStart, handleTouchEnd])

  return swipeHandlers
}