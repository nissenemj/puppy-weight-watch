import * as React from "react"
import { motion, PanInfo, useAnimation } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BottomSheetProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  snapPoints?: number[] // Array of percentages (0-1), e.g., [0.25, 0.5, 1]
  defaultSnap?: number // Index of default snap point
  title?: string
  description?: string
  className?: string
  showDragHandle?: boolean
  enableBackdropDismiss?: boolean
  enableDragDismiss?: boolean
  hapticFeedback?: boolean
}

export const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      children,
      isOpen,
      onClose,
      snapPoints = [0.5, 1],
      defaultSnap = 0,
      title,
      description,
      className,
      showDragHandle = true,
      enableBackdropDismiss = true,
      enableDragDismiss = true,
      hapticFeedback = true,
      ...props
    },
    ref
  ) => {
    const [currentSnapIndex, setCurrentSnapIndex] = React.useState(defaultSnap)
    const [isDragging, setIsDragging] = React.useState(false)
    const controls = useAnimation()
    const sheetRef = React.useRef<HTMLDivElement>(null)

    const triggerHaptic = React.useCallback((intensity: "light" | "medium" | "heavy" = "light") => {
      if (!hapticFeedback || !("vibrate" in navigator)) return

      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50
      }
      navigator.vibrate(patterns[intensity])
    }, [hapticFeedback])

    // Calculate sheet height based on current snap point
    const getSheetHeight = React.useCallback((snapIndex: number) => {
      const snap = snapPoints[snapIndex]
      return `${snap * 100}vh`
    }, [snapPoints])

    // Find nearest snap point based on current position
    const findNearestSnapPoint = React.useCallback((currentY: number, velocity: number): number => {
      const windowHeight = window.innerHeight
      const currentPercentage = 1 - (currentY / windowHeight)

      // If velocity is high, snap to next point in direction of swipe
      if (Math.abs(velocity) > 500) {
        if (velocity > 0) {
          // Swiping down, find lower snap point
          for (let i = currentSnapIndex; i >= 0; i--) {
            if (snapPoints[i] < currentPercentage) return i
          }
          return 0 // Close if swiping down from lowest point
        } else {
          // Swiping up, find higher snap point
          for (let i = currentSnapIndex; i < snapPoints.length; i++) {
            if (snapPoints[i] > currentPercentage) return i
          }
          return snapPoints.length - 1
        }
      }

      // Otherwise, find closest snap point
      let closestIndex = 0
      let closestDistance = Math.abs(snapPoints[0] - currentPercentage)

      snapPoints.forEach((snap, index) => {
        const distance = Math.abs(snap - currentPercentage)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }, [snapPoints, currentSnapIndex])

    const handleDragStart = React.useCallback(() => {
      setIsDragging(true)
      triggerHaptic("light")
    }, [triggerHaptic])

    const handleDrag = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!enableDragDismiss) return

      const { offset } = info

      // Only allow dragging down
      if (offset.y > 0) {
        controls.start({
          y: offset.y,
          transition: { type: "spring", stiffness: 500, damping: 30 }
        })
      }
    }, [controls, enableDragDismiss])

    const handleDragEnd = React.useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      setIsDragging(false)

      if (!enableDragDismiss) return

      const { offset, velocity } = info
      const windowHeight = window.innerHeight
      const currentY = sheetRef.current?.getBoundingClientRect().top || 0

      // Dismiss threshold: 30% of sheet height or high velocity down
      const dismissThreshold = windowHeight * 0.3
      const shouldDismiss = offset.y > dismissThreshold || (velocity.y > 800 && offset.y > 50)

      if (shouldDismiss) {
        triggerHaptic("medium")
        onClose()
      } else {
        // Snap to nearest point
        const nearestSnap = findNearestSnapPoint(currentY, velocity.y)
        setCurrentSnapIndex(nearestSnap)
        triggerHaptic("light")

        controls.start({
          y: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
          }
        })
      }
    }, [controls, onClose, findNearestSnapPoint, triggerHaptic, enableDragDismiss])

    // Animate sheet in/out
    React.useEffect(() => {
      if (isOpen) {
        controls.start({
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
          }
        })
      } else {
        controls.start({
          y: "100%",
          opacity: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
          }
        })
      }
    }, [isOpen, controls])

    // Reset snap index when opened
    React.useEffect(() => {
      if (isOpen) {
        setCurrentSnapIndex(defaultSnap)
      }
    }, [isOpen, defaultSnap])

    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={enableBackdropDismiss ? onClose : undefined}
          transition={{ duration: 0.2 }}
        />

        {/* Bottom Sheet */}
        <motion.div
          ref={sheetRef}
          drag={enableDragDismiss ? "y" : false}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.3 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ y: "100%", opacity: 0 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[1150]",
            "bg-white rounded-t-3xl shadow-2xl",
            "flex flex-col",
            "max-h-[95vh]",
            "will-change-transform",
            className
          )}
          style={{
            height: getSheetHeight(currentSnapIndex),
            touchAction: isDragging ? "none" : "auto"
          }}
          {...props}
        >
          {/* Drag Handle */}
          {showDragHandle && (
            <div className="flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 bg-[var(--color-neutral-500)] rounded-full opacity-40" />
            </div>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="px-6 pt-2 pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {title && (
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-center",
                    "w-8 h-8 rounded-full",
                    "bg-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-500)]",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
                  )}
                  aria-label="Close sheet"
                >
                  <X className="w-5 h-5 text-[var(--color-text-primary)]" />
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 overscroll-contain">
            {children}
          </div>
        </motion.div>
      </>
    )
  }
)

BottomSheet.displayName = "BottomSheet"

// Hook for controlling bottom sheet
export function useBottomSheet(defaultOpen = false) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}
