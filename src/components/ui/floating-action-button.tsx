import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

const fabVariants = cva(
  "fixed inline-flex items-center justify-center rounded-full shadow-lg transition-all duration-300 z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 smooth-transform focus-modern",
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
      },
      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
        "center-right": "top-1/2 right-6 transform -translate-y-1/2"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right"
    }
  }
)

interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  icon: LucideIcon
  label?: string
  showLabel?: boolean
  pulse?: boolean
}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({
  className,
  variant,
  size,
  position,
  icon: Icon,
  label,
  showLabel = false,
  pulse = false,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div className="fixed z-50" style={{
      bottom: position?.includes('bottom') ? '1.5rem' : undefined,
      top: position?.includes('top') ? '1.5rem' : undefined,
      right: position?.includes('right') ? '1.5rem' : undefined,
      left: position?.includes('left') ? '1.5rem' : undefined,
      transform: position?.includes('center') ? 'translateX(-50%)' : undefined
    }}>
      <button
        className={cn(
          fabVariants({ variant, size }),
          pulse && "animate-pulse",
          "relative group",
          className
        )}
        ref={ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={label}
        {...props}
      >
        {/* Icon */}
        <Icon
          className={cn(
            "transition-all duration-200",
            size === "sm" ? "w-4 h-4" :
            size === "lg" ? "w-6 h-6" :
            size === "xl" ? "w-8 h-8" : "w-5 h-5",
            isHovered && "scale-110"
          )}
        />

        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-20 bg-white transition-opacity duration-150" />

        {/* Label tooltip */}
        {label && (
          <div
            className={cn(
              "absolute right-full mr-3 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-200 pointer-events-none",
              showLabel || isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-2"
            )}
          >
            {label}
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45" />
          </div>
        )}

        {/* Floating animation */}
        <div className="absolute inset-0 rounded-full opacity-30 animate-ping" style={{
          animationDuration: '2s',
          animationDelay: '1s'
        }} />
      </button>
    </div>
  )
})

FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton, fabVariants }
export type { FloatingActionButtonProps }