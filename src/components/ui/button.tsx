import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-family-heading transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        // Primary - Warm terracotta with Anthropic-inspired animations
        default: "bg-[var(--color-interactive-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-interactive-primary-hover)] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-interactive-secondary)] transform hover:translate-y-[-1px] active:translate-y-[0] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/20 before:transition-all before:duration-300 before:transform before:-translate-x-1/2 before:-translate-y-1/2 hover:before:w-full hover:before:h-full font-medium",
        
        // Secondary - Warm neutral surface
        secondary: "bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] border-2 border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-background-tertiary)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-interactive-primary)] focus-visible:ring-[var(--color-interactive-secondary)] transform hover:translate-y-[-1px] active:translate-y-[0] font-medium",
        
        // Trust - Blue for trust-building actions
        trust: "bg-[var(--color-interactive-secondary)] text-[var(--color-text-on-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-interactive-secondary-hover)] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-interactive-primary)] transform hover:translate-y-[-1px] active:translate-y-[0] before:absolute before:top-1/2 before:left-1/2 before:w-0 before:h-0 before:rounded-full before:bg-white/20 before:transition-all before:duration-300 before:transform before:-translate-x-1/2 before:-translate-y-1/2 hover:before:w-full hover:before:h-full font-medium",
        
        // Outline - Clean border style with warm colors
        outline: "border-2 border-[var(--color-interactive-primary)] bg-transparent text-[var(--color-interactive-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-100)] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-interactive-secondary)] transform hover:translate-y-[-1px] active:translate-y-[0] font-medium",
        
        // Ghost - Minimal style with warm hover
        ghost: "bg-transparent text-[var(--color-text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--color-primary-100)] focus-visible:ring-[var(--color-interactive-secondary)] transform hover:translate-y-[-1px] active:translate-y-[0] font-medium",
        
        // Destructive - Error actions
        destructive: "bg-[var(--color-error)] text-[var(--color-text-on-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-error)]/90 hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-error)] transform hover:translate-y-[-1px] active:translate-y-[0] font-medium",
        
        // Success - Health/positive actions with green
        success: "bg-[var(--color-success)] text-[var(--color-text-on-primary)] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-success)]/90 hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-success)] transform hover:translate-y-[-1px] active:translate-y-[0] font-medium",
        
        // Pill - Playful rounded button for special actions
        pill: "bg-[var(--color-interactive-primary)] text-[var(--color-text-on-primary)] rounded-[var(--radius-full)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-interactive-primary-hover)] hover:shadow-[var(--shadow-md)] focus-visible:ring-[var(--color-interactive-secondary)] transform hover:translate-y-[-1px] active:translate-y-[0] px-6 font-medium",
        
        // Link - Text-only with warm accent
        link: "text-[var(--color-text-link)] underline-offset-4 hover:underline hover:text-[var(--color-interactive-secondary-hover)] focus-visible:ring-[var(--color-interactive-secondary)] p-0 h-auto font-medium",
      },
      size: {
        // Comfortable touch targets - mobile-first approach
        sm: "h-11 px-4 text-[var(--font-size-sm)] font-[var(--font-weight-medium)] min-h-[44px]", 
        default: "h-12 px-6 text-[var(--font-size-base)] font-[var(--font-weight-medium)] min-h-[44px]",
        lg: "h-16 px-8 text-[var(--font-size-lg)] font-[var(--font-weight-semibold)] min-h-[44px]",
        xl: "h-16 px-10 text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] min-h-[44px]",
        
        // Icon buttons with proper touch targets
        icon: "h-12 w-12 p-0 min-h-[44px] min-w-[44px] rounded-[var(--radius-md)]",
        "icon-sm": "h-11 w-11 p-0 min-h-[44px] min-w-[44px] rounded-[var(--radius-md)]", 
        "icon-lg": "h-16 w-16 p-0 min-h-[44px] min-w-[44px] rounded-[var(--radius-lg)]",
        
        // Mobile optimized
        mobile: "h-16 px-6 text-[var(--font-size-base)] font-[var(--font-weight-medium)] min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
