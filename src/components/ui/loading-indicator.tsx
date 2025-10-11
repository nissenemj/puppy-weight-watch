import * as React from "react"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
  "inline-block animate-spin",
  {
    variants: {
      size: {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        default: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12"
      },
      variant: {
        default: "text-[var(--color-primary-500)]",
        secondary: "text-[var(--color-secondary-500)]",
        muted: "text-[var(--color-text-tertiary)]",
        white: "text-white"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
)

interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Ladataan"}
        className={cn("inline-flex items-center justify-center", className)}
        {...props}
      >
        <Loader2 className={cn(spinnerVariants({ size, variant }))} />
        <span className="sr-only">{label || "Ladataan"}</span>
      </div>
    )
  }
)

Spinner.displayName = "Spinner"

// iOS-style Activity Indicator
interface ActivityIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  color?: string
}

export const ActivityIndicator = React.forwardRef<HTMLDivElement, ActivityIndicatorProps>(
  ({ className, size = "default", color = "var(--color-primary-500)", ...props }, ref) => {
    const sizeClass = {
      sm: "w-4 h-4",
      default: "w-6 h-6",
      lg: "w-8 h-8"
    }[size]

    const lineCount = 12
    const lines = Array.from({ length: lineCount })

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Ladataan"
        className={cn("inline-block relative", sizeClass, className)}
        {...props}
      >
        {lines.map((_, index) => {
          const rotation = (index * 360) / lineCount
          const delay = (index * 0.0833) // 1/12 second intervals

          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-0 w-0.5 rounded-full origin-bottom"
              style={{
                height: size === "sm" ? "25%" : "30%",
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                backgroundColor: color
              }}
              animate={{
                opacity: [0.1, 1, 0.1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay,
                ease: "linear"
              }}
            />
          )
        })}
        <span className="sr-only">Ladataan</span>
      </div>
    )
  }
)

ActivityIndicator.displayName = "ActivityIndicator"

// Progress Bar
interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  label?: string
  showLabel?: boolean
  animated?: boolean
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      label,
      showLabel = false,
      animated = true,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && label && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[var(--color-text-primary)]">
              {label}
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label || "Progress"}
          className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--color-neutral-200)]"
        >
          <motion.div
            className="h-full bg-[var(--color-primary-500)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: animated ? 0.5 : 0,
              ease: "easeOut"
            }}
          />
        </div>
      </div>
    )
  }
)

ProgressBar.displayName = "ProgressBar"

// Indeterminate Progress Bar
interface IndeterminateProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const IndeterminateProgress = React.forwardRef<HTMLDivElement, IndeterminateProgressProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {label && (
          <span className="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">
            {label}
          </span>
        )}

        <div
          role="progressbar"
          aria-label={label || "Ladataan"}
          className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--color-neutral-200)]"
        >
          <motion.div
            className="absolute h-full w-1/3 bg-[var(--color-primary-500)] rounded-full"
            animate={{
              x: ["-100%", "300%"]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
    )
  }
)

IndeterminateProgress.displayName = "IndeterminateProgress"

// Dots Loader
interface DotsLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg"
  label?: string
}

export const DotsLoader = React.forwardRef<HTMLDivElement, DotsLoaderProps>(
  ({ className, size = "default", label, ...props }, ref) => {
    const dotSize = {
      sm: "w-1.5 h-1.5",
      default: "w-2 h-2",
      lg: "w-3 h-3"
    }[size]

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label || "Ladataan"}
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "rounded-full bg-[var(--color-primary-500)]",
              dotSize
            )}
            animate={{
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15
            }}
          />
        ))}
        <span className="sr-only">{label || "Ladataan"}</span>
      </div>
    )
  }
)

DotsLoader.displayName = "DotsLoader"

// Page Loader (fullscreen)
interface PageLoaderProps {
  message?: string
  showProgress?: boolean
  progress?: number
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = "Ladataan...",
  showProgress = false,
  progress = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 px-6">
        <ActivityIndicator size="lg" />

        {message && (
          <p className="text-base font-medium text-[var(--color-text-primary)] text-center">
            {message}
          </p>
        )}

        {showProgress && (
          <div className="w-64 max-w-full">
            <ProgressBar value={progress} animated />
          </div>
        )}
      </div>
    </motion.div>
  )
}

PageLoader.displayName = "PageLoader"

// Overlay Loader
interface OverlayLoaderProps {
  show: boolean
  message?: string
  backdrop?: boolean
}

export const OverlayLoader: React.FC<OverlayLoaderProps> = ({
  show,
  message = "Ladataan...",
  backdrop = true
}) => {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-[1500] flex items-center justify-center",
        backdrop && "bg-black/40 backdrop-blur-sm"
      )}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-4 min-w-[200px]"
      >
        <ActivityIndicator size="lg" />
        {message && (
          <p className="text-sm font-medium text-[var(--color-text-primary)] text-center">
            {message}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

OverlayLoader.displayName = "OverlayLoader"

// Inline Loader for lists
interface InlineLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
}

export const InlineLoader = React.forwardRef<HTMLDivElement, InlineLoaderProps>(
  ({ className, message = "Ladataan...", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-3 py-8",
          className
        )}
        {...props}
      >
        <Spinner size="sm" />
        {message && (
          <span className="text-sm text-[var(--color-text-secondary)]">
            {message}
          </span>
        )}
      </div>
    )
  }
)

InlineLoader.displayName = "InlineLoader"

// Button Loading State Component
interface ButtonLoaderProps {
  loading?: boolean
  children: React.ReactNode
  loadingText?: string
}

export const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  loading = false,
  children,
  loadingText
}) => {
  return (
    <>
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" variant="white" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </>
  )
}

ButtonLoader.displayName = "ButtonLoader"
