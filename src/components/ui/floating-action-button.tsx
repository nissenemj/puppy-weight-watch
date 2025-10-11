import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const fabVariants = cva(
  "inline-flex items-center justify-center rounded-full shadow-lg z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 smooth-transform focus-modern",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-700)] shadow-xl hover:shadow-2xl",
        secondary: "bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-700)] shadow-xl hover:shadow-2xl",
        success: "bg-[var(--color-tertiary-500)] text-white hover:bg-[var(--color-tertiary-700)] shadow-xl hover:shadow-2xl",
        glass: "bg-white/10 backdrop-blur-md text-[var(--color-text-primary)] hover:bg-white/20",
        gradient: "bg-gradient-primary text-white hover:opacity-90"
      },
      size: {
        sm: "w-12 h-12",
        default: "w-14 h-14",
        lg: "w-16 h-16",
        xl: "w-20 h-20"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

type Position = "bottom-right" | "bottom-left" | "bottom-center" | "top-right" | "top-left" | "center-right"

interface FloatingActionButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof fabVariants> {
  icon: LucideIcon
  label?: string
  showLabel?: boolean
  pulse?: boolean
  position?: Position
  hideOnScroll?: boolean
  scrollThreshold?: number
  bottomNavHeight?: number
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// Hook for scroll direction detection
function useScrollDirection(threshold: number = 10) {
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down" | null>(null)
  const [isAtTop, setIsAtTop] = React.useState(true)
  const lastScrollY = React.useRef(0)
  const ticking = React.useRef(false)

  React.useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY

      if (scrollY <= 0) {
        setIsAtTop(true)
        setScrollDirection(null)
      } else {
        setIsAtTop(false)

        if (Math.abs(scrollY - lastScrollY.current) >= threshold) {
          setScrollDirection(scrollY > lastScrollY.current ? "down" : "up")
          lastScrollY.current = scrollY
        }
      }

      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateScrollDirection()

    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return { scrollDirection, isAtTop }
}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({
  className,
  variant,
  size,
  position = "bottom-right",
  icon: Icon,
  label,
  showLabel = false,
  pulse = false,
  hideOnScroll = false,
  scrollThreshold = 10,
  bottomNavHeight = 72,
  onClick,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const { scrollDirection, isAtTop } = useScrollDirection(scrollThreshold)

  // Determine if FAB should be visible
  const isVisible = !hideOnScroll || scrollDirection === "up" || isAtTop

  // Calculate position based on position prop
  const getPositionStyles = React.useCallback(() => {
    const baseOffset = 24 // 1.5rem

    switch (position) {
      case "bottom-right":
        return {
          bottom: baseOffset + (hideOnScroll ? bottomNavHeight : 0),
          right: baseOffset
        }
      case "bottom-left":
        return {
          bottom: baseOffset + (hideOnScroll ? bottomNavHeight : 0),
          left: baseOffset
        }
      case "bottom-center":
        return {
          bottom: baseOffset + (hideOnScroll ? bottomNavHeight : 0),
          left: "50%",
          transform: "translateX(-50%)"
        }
      case "top-right":
        return {
          top: baseOffset,
          right: baseOffset
        }
      case "top-left":
        return {
          top: baseOffset,
          left: baseOffset
        }
      case "center-right":
        return {
          top: "50%",
          right: baseOffset,
          transform: "translateY(-50%)"
        }
      default:
        return {
          bottom: baseOffset,
          right: baseOffset
        }
    }
  }, [position, hideOnScroll, bottomNavHeight])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed z-50"
          style={getPositionStyles()}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              fabVariants({ variant, size }),
              pulse && "animate-pulse",
              "relative group",
              className
            )}
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            aria-label={label}
            {...props}
          >
            {/* Icon with rotation animation on hover */}
            <motion.div
              animate={{
                rotate: isHovered ? [0, -10, 10, 0] : 0
              }}
              transition={{
                duration: 0.3
              }}
            >
              <Icon
                className={cn(
                  "transition-all duration-200",
                  size === "sm" ? "w-4 h-4" :
                  size === "lg" ? "w-6 h-6" :
                  size === "xl" ? "w-8 h-8" : "w-5 h-5"
                )}
              />
            </motion.div>

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-20 bg-white transition-opacity duration-150" />

            {/* Label tooltip with animation */}
            <AnimatePresence>
              {label && (showLabel || isHovered) && (
                <motion.div
                  initial={{ opacity: 0, x: position?.includes('left') ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: position?.includes('left') ? 10 : -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "absolute px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none",
                    position?.includes('left') ? "left-full ml-3" : "right-full mr-3"
                  )}
                >
                  {label}
                  <div className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45",
                    position?.includes('left') ? "-left-1" : "-right-1"
                  )} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pulse ring animation */}
            {pulse && (
              <motion.div
                className="absolute inset-0 rounded-full bg-current opacity-20"
                animate={{
                  scale: [1, 1.5, 1.5],
                  opacity: [0.2, 0, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton, fabVariants, useScrollDirection }
export type { FloatingActionButtonProps }