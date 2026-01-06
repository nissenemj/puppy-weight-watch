import * as React from "react"
import { motion, PanInfo, useAnimation, AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

type TransitionDirection = "forward" | "backward" | "none"

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
  direction?: TransitionDirection
  enableSwipeBack?: boolean
  hapticFeedback?: boolean
  onSwipeBack?: () => void
}

// Stack to track navigation history for swipe back
const navigationStack: string[] = []

export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  (
    {
      children,
      className,
      direction: manualDirection,
      enableSwipeBack = true,
      hapticFeedback = true,
      onSwipeBack,
      ...props
    },
    ref
  ) => {
    const location = useLocation()
    const navigate = useNavigate()
    const controls = useAnimation()
    const [isDragging, setIsDragging] = React.useState(false)
    const [canSwipeBack, setCanSwipeBack] = React.useState(false)
    const previousPathRef = React.useRef<string>("")

    // Determine transition direction based on navigation history
    const direction = React.useMemo(() => {
      if (manualDirection) return manualDirection

      const currentPath = location.pathname
      const previousPath = previousPathRef.current

      // Update navigation stack
      const lastPath = navigationStack[navigationStack.length - 1]
      if (lastPath !== currentPath) {
        // Check if this is a back navigation
        const stackIndex = navigationStack.indexOf(currentPath)
        if (stackIndex !== -1) {
          // Going back
          navigationStack.splice(stackIndex + 1)
          return "backward"
        } else {
          // Going forward
          navigationStack.push(currentPath)
          return "forward"
        }
      }

      return "none"
    }, [location.pathname, manualDirection])

    // Update previous path
    React.useEffect(() => {
      previousPathRef.current = location.pathname
    }, [location.pathname])

    // Check if we can swipe back
    React.useEffect(() => {
      setCanSwipeBack(navigationStack.length > 1)
    }, [location.pathname])

    const triggerHaptic = React.useCallback((intensity: "light" | "medium" = "light") => {
      if (!hapticFeedback || !("vibrate" in navigator)) return

      const patterns = {
        light: 10,
        medium: 20
      }
      navigator.vibrate(patterns[intensity])
    }, [hapticFeedback])

    const handleDragStart = React.useCallback(() => {
      if (!enableSwipeBack || !canSwipeBack) return
      setIsDragging(true)
      triggerHaptic("light")
    }, [enableSwipeBack, canSwipeBack, triggerHaptic])

    const handleDrag = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enableSwipeBack || !canSwipeBack) return

      const { offset } = info

      // Only allow swiping from left edge to right (swipe back gesture)
      if (offset.x > 0) {
        // Add resistance for smoother feel
        const resistance = Math.min(offset.x / window.innerWidth, 0.8)
        controls.start({
          x: offset.x * resistance,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        })
      }
    }, [controls, enableSwipeBack, canSwipeBack])

    const handleDragEnd = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enableSwipeBack || !canSwipeBack) {
        setIsDragging(false)
        return
      }

      const { offset, velocity } = info
      const windowWidth = window.innerWidth

      // Threshold: 40% of screen width or high velocity
      const swipeThreshold = windowWidth * 0.4
      const shouldNavigateBack = offset.x > swipeThreshold || (velocity.x > 800 && offset.x > 50)

      setIsDragging(false)

      if (shouldNavigateBack) {
        triggerHaptic("medium")
        // Navigate back
        if (onSwipeBack) {
          onSwipeBack()
        } else {
          navigate(-1)
        }
      } else {
        // Snap back to original position
        controls.start({
          x: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
          }
        })
      }
    }, [controls, navigate, onSwipeBack, canSwipeBack, enableSwipeBack, triggerHaptic])

    // Animation variants for page transitions
    const pageVariants = {
      initial: (direction: TransitionDirection) => {
        if (direction === "forward") {
          return { x: "100%", opacity: 0 }
        } else if (direction === "backward") {
          return { x: "-30%", opacity: 0 }
        }
        return { opacity: 0 }
      },
      animate: {
        x: 0,
        opacity: 1,
        transition: {
          type: "spring" as const,
          stiffness: 300,
          damping: 30,
          opacity: { duration: 0.2 }
        }
      },
      exit: (direction: TransitionDirection) => {
        if (direction === "forward") {
          return { x: "-30%", opacity: 0 }
        } else if (direction === "backward") {
          return { x: "100%", opacity: 0 }
        }
        return { opacity: 0 }
      }
    }

    return (
      <motion.div
        ref={ref}
        custom={direction}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        drag={enableSwipeBack && canSwipeBack ? "x" : false}
        dragConstraints={{ left: 0, right: window.innerWidth }}
        dragElastic={{ left: 0, right: 0.2 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={cn(
          "relative w-full h-full",
          isDragging && "cursor-grabbing",
          enableSwipeBack && canSwipeBack && "cursor-grab",
          className
        )}
        style={{
          touchAction: isDragging ? "none" : "auto"
        }}
        {...props}
      >
        {/* Back edge indicator (subtle visual cue for swipe back) */}
        {enableSwipeBack && canSwipeBack && (
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-[var(--color-primary-500)]/20 to-transparent pointer-events-none"
            animate={{
              opacity: isDragging ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
          />
        )}

        {children}
      </motion.div>
    )
  }
)

PageTransition.displayName = "PageTransition"

// Hook to programmatically control page transitions
export function usePageTransition() {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateForward = React.useCallback((to: string) => {
    navigate(to)
  }, [navigate])

  const navigateBackward = React.useCallback(() => {
    navigate(-1)
  }, [navigate])

  const canGoBack = React.useMemo(() => {
    return navigationStack.length > 1
  }, [location.pathname])

  return {
    navigateForward,
    navigateBackward,
    canGoBack,
    currentPath: location.pathname
  }
}

// Animated page wrapper component for consistent transitions
interface AnimatedPageProps {
  children: React.ReactNode
  className?: string
  enableSwipeBack?: boolean
}

export const AnimatedPage: React.FC<AnimatedPageProps> = ({
  children,
  className,
  enableSwipeBack = true
}) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition
        key={location.pathname}
        enableSwipeBack={enableSwipeBack}
        className={className}
      >
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}
