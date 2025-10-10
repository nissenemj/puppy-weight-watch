import * as React from "react"
import { motion, MotionProps } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

const touchButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-body font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 smooth-transform focus-modern touch-target select-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] hover-glow",
        secondary: "bg-[var(--color-secondary-500)] text-white hover:bg-[var(--color-secondary-600)] active:bg-[var(--color-secondary-700)] hover-glow-secondary",
        success: "bg-[var(--color-tertiary-500)] text-white hover:bg-[var(--color-tertiary-600)] active:bg-[var(--color-tertiary-700)] hover-glow-success",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive",
        outline: "border-2 border-[var(--color-accent-200)] bg-transparent text-[var(--color-text)] hover:bg-[var(--color-accent-50)] hover:border-[var(--color-accent-300)] active:bg-[var(--color-accent-100)]",
        ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-accent-100)] active:bg-[var(--color-accent-200)]",
        glass: "glass-card text-white hover:backdrop-blur-xl hover:bg-white/20 active:bg-white/30 micro-bounce",
        neo: "neo-button text-[var(--color-text)] active:shadow-inner",
        gradient: "bg-gradient-modern-warm text-white hover:opacity-90 active:opacity-80 hover-glow micro-elastic"
      },
      size: {
        sm: "h-12 px-4 py-2 text-body-sm rounded-lg min-h-[48px] min-w-[48px]",
        default: "h-14 px-6 py-3 text-body rounded-xl min-h-[56px] min-w-[56px]",
        lg: "h-16 px-8 py-4 text-body-lg rounded-xl min-h-[64px] min-w-[64px]",
        xl: "h-20 px-10 py-5 text-h6 rounded-2xl min-h-[80px] min-w-[80px]",
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