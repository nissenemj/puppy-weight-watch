import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ContextMenuAction {
  label: string
  icon?: LucideIcon
  onSelect: () => void
  variant?: "default" | "destructive" | "primary"
  disabled?: boolean
}

interface ContextMenuMobileProps {
  children: React.ReactNode
  actions: ContextMenuAction[]
  longPressDelay?: number
  hapticFeedback?: boolean
  className?: string
}

export const ContextMenuMobile = React.forwardRef<HTMLDivElement, ContextMenuMobileProps>(
  (
    {
      children,
      actions,
      longPressDelay = 500,
      hapticFeedback = true,
      className,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isPressing, setIsPressing] = React.useState(false)
    const longPressTimer = React.useRef<NodeJS.Timeout>()
    const touchStartTime = React.useRef<number>(0)

    const triggerHaptic = React.useCallback((intensity: "light" | "medium" | "heavy" = "medium") => {
      if (!hapticFeedback || !("vibrate" in navigator)) return

      const patterns = {
        light: 10,
        medium: 20,
        heavy: 50
      }
      navigator.vibrate(patterns[intensity])
    }, [hapticFeedback])

    const handleLongPressStart = React.useCallback((e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault()
      setIsPressing(true)
      touchStartTime.current = Date.now()
      triggerHaptic("light")

      longPressTimer.current = setTimeout(() => {
        setIsOpen(true)
        setIsPressing(false)
        triggerHaptic("heavy")
      }, longPressDelay)
    }, [longPressDelay, triggerHaptic])

    const handleLongPressEnd = React.useCallback(() => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
      setIsPressing(false)
    }, [])

    const handleActionSelect = React.useCallback((action: ContextMenuAction) => {
      if (action.disabled) return

      triggerHaptic("medium")
      action.onSelect()
      setIsOpen(false)
    }, [triggerHaptic])

    const handleClose = React.useCallback(() => {
      setIsOpen(false)
      triggerHaptic("light")
    }, [triggerHaptic])

    // Cleanup on unmount
    React.useEffect(() => {
      return () => {
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current)
        }
      }
    }, [])

    return (
      <>
        {/* Trigger element */}
        <div
          ref={ref}
          className={cn("relative", className)}
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          onTouchCancel={handleLongPressEnd}
          onMouseDown={handleLongPressStart}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          {...props}
        >
          {/* Visual feedback during long press */}
          <motion.div
            className="absolute inset-0 rounded-lg bg-[var(--color-primary-500)]/10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: isPressing ? 1 : 0,
              scale: isPressing ? 1 : 0.95
            }}
            transition={{ duration: 0.2 }}
          />

          {children}
        </div>

        {/* Context Menu Sheet */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                transition={{ duration: 0.2 }}
              />

              {/* Action Sheet */}
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-[1150] bg-white rounded-t-3xl shadow-2xl pb-safe"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              >
                {/* Drag handle */}
                <div className="flex items-center justify-center pt-3 pb-2">
                  <div className="w-12 h-1.5 bg-[var(--color-neutral-500)] rounded-full opacity-40" />
                </div>

                {/* Header */}
                <div className="px-6 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Valinnat
                  </h3>
                  <button
                    onClick={handleClose}
                    className={cn(
                      "flex items-center justify-center",
                      "w-8 h-8 rounded-full",
                      "bg-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-500)]",
                      "transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
                    )}
                    aria-label="Sulje valikko"
                  >
                    <X className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </button>
                </div>

                {/* Actions */}
                <div className="px-4 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
                  {actions.map((action, index) => {
                    const Icon = action.icon

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleActionSelect(action)}
                        disabled={action.disabled}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-4",
                          "rounded-xl transition-all duration-200",
                          "min-h-[56px] touch-target",
                          "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
                          action.disabled && "opacity-50 cursor-not-allowed",
                          !action.disabled && "hover:bg-[var(--color-neutral-200)]/50 active:scale-98",
                          action.variant === "destructive" && !action.disabled && "text-[var(--color-error)]",
                          action.variant === "primary" && !action.disabled && "text-[var(--color-primary-700)]",
                          action.variant === "default" && !action.disabled && "text-[var(--color-text-primary)]"
                        )}
                      >
                        {Icon && (
                          <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                            action.variant === "destructive" && !action.disabled && "bg-[var(--color-error)]/10",
                            action.variant === "primary" && !action.disabled && "bg-[var(--color-primary-100)]",
                            action.variant === "default" && !action.disabled && "bg-[var(--color-neutral-200)]"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                        )}
                        <span className="text-base font-medium flex-1 text-left">
                          {action.label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Cancel button */}
                <div className="px-4 pb-4 pt-2">
                  <button
                    onClick={handleClose}
                    className={cn(
                      "w-full py-4 px-4 rounded-xl",
                      "bg-[var(--color-neutral-200)] hover:bg-[var(--color-neutral-500)]",
                      "text-[var(--color-text-primary)] font-semibold",
                      "transition-colors duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2",
                      "min-h-[56px] touch-target"
                    )}
                  >
                    Peruuta
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }
)

ContextMenuMobile.displayName = "ContextMenuMobile"

// Hook for programmatic control
export function useContextMenuMobile() {
  const [isOpen, setIsOpen] = React.useState(false)

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
