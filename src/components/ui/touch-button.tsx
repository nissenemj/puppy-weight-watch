import * as React from "react"
import { motion, MotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

const touchButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-target select-none active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-700)] shadow-md hover:shadow-lg",
        secondary: "bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-700)] shadow-md hover:shadow-lg",
        success: "bg-[var(--color-tertiary-500)] text-white hover:bg-[var(--color-tertiary-700)] shadow-md hover:shadow-lg",
        destructive: "bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90 shadow-md hover:shadow-lg",
        outline: "border-2 border-[var(--color-primary-500)] bg-transparent text-[var(--color-primary-500)] hover:bg-[var(--color-primary-100)]",
        ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-200)]"
      },
      size: {
        sm: "h-12 px-4 py-2 text-sm rounded-lg min-h-[48px] min-w-[48px]",
        default: "h-14 px-6 py-3 text-base rounded-xl min-h-[56px] min-w-[56px]",
        lg: "h-16 px-8 py-4 text-lg rounded-xl min-h-[64px] min-w-[64px]",
        icon: "h-14 w-14 rounded-xl min-h-[56px] min-w-[56px]"
      },
      fullWidth: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false
    }
  }
)

export interface TouchButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style'>,
    VariantProps<typeof touchButtonVariants>,
    Omit<MotionProps, "children"> {
  asChild?: boolean
  loading?: boolean
  hapticFeedback?: boolean
  pressEffect?: "scale" | "opacity" | "none"
}

const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    asChild = false,
    loading = false,
    hapticFeedback = true,
    pressEffect = "scale",
    disabled,
    onClick,
    children,
    ...props
  }, ref) => {
    const triggerHapticFeedback = () => {
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(30) // Light haptic feedback
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return

      triggerHapticFeedback()
      onClick?.(e)
    }

    const getWhileTapEffect = () => {
      switch (pressEffect) {
        case "scale":
          return { scale: 0.95 }
        case "opacity":
          return { opacity: 0.8 }
        case "none":
        default:
          return {}
      }
    }

    const motionProps = {
      whileTap: getWhileTapEffect(),
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25
      }
    }

    // If asChild, use Slot without motion props
    if (asChild) {
      // Filter out motion-specific props for Slot
      const { 
        whileTap, whileHover, animate, initial, exit, variants, 
        transition, drag, dragConstraints, dragElastic, dragMomentum,
        onDrag, onDragStart, onDragEnd, onAnimationStart, onAnimationComplete,
        ...buttonProps 
      } = props as any
      
      return (
        <Slot
          className={cn(touchButtonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          onClick={handleClick}
          {...buttonProps}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span className="opacity-70">Lataa...</span>
            </div>
          ) : (
            children
          )}
        </Slot>
      )
    }

    return (
      <motion.button
        className={cn(touchButtonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...motionProps}
        {...props}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <span className="opacity-70">Lataa...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

TouchButton.displayName = "TouchButton"

export { TouchButton, touchButtonVariants }