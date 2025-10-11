import * as React from "react"
import { motion, useAnimation } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  maxPullDistance?: number
  refreshingText?: string
  pullText?: string
  releaseText?: string
  className?: string
  disabled?: boolean
  hapticFeedback?: boolean
}

type RefreshState = "idle" | "pulling" | "canRelease" | "refreshing" | "complete"

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      children,
      onRefresh,
      threshold = 80,
      maxPullDistance = 120,
      refreshingText = "Päivitetään...",
      pullText = "Vedä päivittääksesi",
      releaseText = "Päästä päivittämään",
      className,
      disabled = false,
      hapticFeedback = true,
      ...props
    },
    ref
  ) => {
    const [refreshState, setRefreshState] = React.useState<RefreshState>("idle")
    const [pullDistance, setPullDistance] = React.useState(0)
    const [touchStartY, setTouchStartY] = React.useState(0)
    const [isAtTop, setIsAtTop] = React.useState(true)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const controls = useAnimation()

    // Trigger haptic feedback
    const triggerHaptic = React.useCallback((intensity: "light" | "medium" | "heavy" = "light") => {
      if (!hapticFeedback || !("vibrate" in navigator)) return

      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50
      }
      navigator.vibrate(patterns[intensity])
    }, [hapticFeedback])

    // Check if scrolled to top
    const checkScrollPosition = React.useCallback(() => {
      if (!containerRef.current) return
      const scrollTop = containerRef.current.scrollTop
      setIsAtTop(scrollTop <= 0)
    }, [])

    React.useEffect(() => {
      const container = containerRef.current
      if (!container) return

      container.addEventListener('scroll', checkScrollPosition, { passive: true })
      checkScrollPosition()

      return () => {
        container.removeEventListener('scroll', checkScrollPosition)
      }
    }, [checkScrollPosition])

    // Handle touch start
    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
      if (disabled || !isAtTop || refreshState === "refreshing") return

      setTouchStartY(e.touches[0].clientY)
      setRefreshState("pulling")
    }, [disabled, isAtTop, refreshState])

    // Handle touch move
    const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
      if (disabled || refreshState === "refreshing" || refreshState === "idle") return

      const currentY = e.touches[0].clientY
      const deltaY = currentY - touchStartY

      // Only allow pulling down
      if (deltaY > 0 && isAtTop) {
        // Prevent default scroll when pulling
        if (deltaY > 10) {
          e.preventDefault()
        }

        // Apply resistance curve
        const resistance = Math.min(deltaY, maxPullDistance)
        const resistanceAdjusted = resistance * (1 - resistance / (maxPullDistance * 1.5))

        setPullDistance(resistanceAdjusted)

        // Update state based on distance
        if (resistanceAdjusted >= threshold && refreshState !== "canRelease") {
          setRefreshState("canRelease")
          triggerHaptic("medium")
        } else if (resistanceAdjusted < threshold && refreshState === "canRelease") {
          setRefreshState("pulling")
          triggerHaptic("light")
        }

        // Animate indicator
        controls.start({
          y: resistanceAdjusted,
          opacity: Math.min(resistanceAdjusted / threshold, 1),
          rotate: (resistanceAdjusted / threshold) * 360,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        })
      }
    }, [disabled, refreshState, touchStartY, threshold, maxPullDistance, isAtTop, controls, triggerHaptic])

    // Handle touch end
    const handleTouchEnd = React.useCallback(async () => {
      if (disabled || refreshState === "idle") return

      if (refreshState === "canRelease" && pullDistance >= threshold) {
        setRefreshState("refreshing")
        triggerHaptic("heavy")

        // Keep indicator at threshold position while refreshing
        controls.start({
          y: threshold,
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        })

        try {
          await onRefresh()
          setRefreshState("complete")
          triggerHaptic("medium")

          // Show checkmark briefly before hiding
          setTimeout(() => {
            controls.start({
              y: 0,
              opacity: 0,
              transition: { duration: 0.3 }
            })
            setRefreshState("idle")
            setPullDistance(0)
          }, 500)
        } catch (error) {
          console.error("Refresh failed:", error)
          controls.start({
            y: 0,
            opacity: 0,
            transition: { duration: 0.3 }
          })
          setRefreshState("idle")
          setPullDistance(0)
        }
      } else {
        // Snap back
        controls.start({
          y: 0,
          opacity: 0,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        })
        setRefreshState("idle")
        setPullDistance(0)
      }
    }, [disabled, refreshState, pullDistance, threshold, onRefresh, controls, triggerHaptic])

    // Calculate progress percentage
    const progressPercentage = Math.min((pullDistance / threshold) * 100, 100)

    return (
      <div
        ref={ref}
        className={cn("relative h-full overflow-hidden", className)}
        {...props}
      >
        {/* Pull indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-50 flex flex-col items-center justify-center pointer-events-none"
          animate={controls}
          initial={{ y: 0, opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-2 py-4 px-6 rounded-b-2xl bg-white/95 backdrop-blur-md shadow-lg border border-[var(--color-border)]">
            {/* Spinner */}
            <div className="relative w-10 h-10">
              {refreshState === "complete" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-success)] text-white"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              ) : (
                <>
                  {/* Progress circle */}
                  <svg className="w-10 h-10 -rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="var(--color-neutral-200)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="var(--color-primary-500)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 18}`}
                      strokeDashoffset={`${2 * Math.PI * 18 * (1 - progressPercentage / 100)}`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.1s ease" }}
                    />
                  </svg>

                  {/* Icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      rotate: refreshState === "refreshing" ? 360 : 0
                    }}
                    transition={{
                      rotate: refreshState === "refreshing"
                        ? { duration: 1, repeat: Infinity, ease: "linear" }
                        : { duration: 0.3 }
                    }}
                  >
                    <RefreshCw
                      className={cn(
                        "w-5 h-5",
                        refreshState === "canRelease" ? "text-[var(--color-primary-700)]" : "text-[var(--color-primary-500)]"
                      )}
                    />
                  </motion.div>
                </>
              )}
            </div>

            {/* Text */}
            <motion.p
              className="text-xs font-medium text-[var(--color-text-secondary)]"
              animate={{
                scale: refreshState === "canRelease" ? 1.05 : 1,
                fontWeight: refreshState === "canRelease" ? 600 : 500
              }}
            >
              {refreshState === "refreshing"
                ? refreshingText
                : refreshState === "canRelease"
                ? releaseText
                : refreshState === "complete"
                ? "Valmis!"
                : pullText}
            </motion.p>
          </div>
        </motion.div>

        {/* Content */}
        <div
          ref={containerRef}
          className="h-full overflow-y-auto overscroll-contain"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            touchAction: refreshState === "pulling" || refreshState === "canRelease" ? "none" : "auto"
          }}
        >
          {children}
        </div>
      </div>
    )
  }
)

PullToRefresh.displayName = "PullToRefresh"

// Hook for pull to refresh functionality
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh])

  return {
    isRefreshing,
    handleRefresh
  }
}