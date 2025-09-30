import * as React from "react"
import { motion, useAnimation, PanInfo } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void> | void
  threshold?: number
  className?: string
  disabled?: boolean
  refreshMessage?: string
  pullMessage?: string
}

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  ({
    children,
    onRefresh,
    threshold = 60,
    className,
    disabled = false,
    refreshMessage = "Päivitä",
    pullMessage = "Vedä alas päivittääksesi",
    ...props
  }, ref) => {
    const [isRefreshing, setIsRefreshing] = React.useState(false)
    const [pullDistance, setPullDistance] = React.useState(0)
    const [isPulling, setIsPulling] = React.useState(false)
    const controls = useAnimation()
    const contentControls = useAnimation()

    const triggerHapticFeedback = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
    }

    const handleDragStart = () => {
      if (disabled || isRefreshing) return
      setIsPulling(true)
    }

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled || isRefreshing) return

      const { offset } = info

      // Only allow pulling down from the top
      if (window.scrollY > 0) return

      // Limit pull distance with resistance
      const resistance = 0.5
      const maxPull = threshold * 2
      const constrainedY = Math.max(0, Math.min(maxPull, offset.y * resistance))

      setPullDistance(constrainedY)
      contentControls.start({ y: constrainedY })

      // Visual feedback when threshold is reached
      if (constrainedY >= threshold && !isRefreshing) {
        triggerHapticFeedback()
      }
    }

    const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (disabled || isRefreshing) return

      setIsPulling(false)

      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        triggerHapticFeedback()

        // Keep the refresh indicator visible
        contentControls.start({ y: threshold })

        try {
          await onRefresh()
        } catch (error) {
          console.error('Refresh failed:', error)
        } finally {
          // Animate back to original position
          await contentControls.start({
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30
            }
          })
          setIsRefreshing(false)
          setPullDistance(0)
        }
      } else {
        // Snap back to original position
        contentControls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 400,
            damping: 40
          }
        })
        setPullDistance(0)
      }
    }

    const getRefreshOpacity = () => {
      if (isRefreshing) return 1
      return Math.min(1, pullDistance / threshold)
    }

    const getRefreshScale = () => {
      if (isRefreshing) return 1
      return Math.min(1, pullDistance / threshold)
    }

    const shouldShowRefreshIndicator = isRefreshing || pullDistance > 10

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Pull-to-refresh indicator */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50"
          style={{
            y: pullDistance >= threshold ? 20 : pullDistance - 40
          }}
          animate={{
            opacity: getRefreshOpacity(),
            scale: getRefreshScale()
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {shouldShowRefreshIndicator && (
            <div className="flex flex-col items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
              <motion.div
                animate={{
                  rotate: isRefreshing ? 360 : 0
                }}
                transition={{
                  duration: isRefreshing ? 1 : 0,
                  repeat: isRefreshing ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <RefreshCw
                  className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    pullDistance >= threshold || isRefreshing
                      ? "text-[var(--color-primary-500)]"
                      : "text-[var(--color-text-secondary)]"
                  )}
                />
              </motion.div>
              <span className="text-caption text-[var(--color-text-secondary)]">
                {isRefreshing
                  ? refreshMessage
                  : pullDistance >= threshold
                    ? "Vapauta päivittääksesi"
                    : pullMessage
                }
              </span>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <motion.div
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.3, bottom: 0 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={contentControls}
          className="relative"
        >
          {children}
        </motion.div>
      </div>
    )
  }
)

PullToRefresh.displayName = "PullToRefresh"