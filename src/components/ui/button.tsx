import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 hover-scale",
  {
    variants: {
      variant: {
        // Primary - modern accent color
        default: "bg-[var(--color-accent)] text-white rounded-xl shadow-md hover:bg-[var(--color-accent-600)] hover:shadow-lg focus-visible:ring-[var(--color-accent)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Secondary - subtle surface
        secondary: "bg-[var(--color-surface-alt)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl shadow-sm hover:bg-[var(--color-surface-hover)] hover:shadow-md focus-visible:ring-[var(--color-primary)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Outline - clean border style
        outline: "border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] rounded-xl hover:bg-[var(--color-surface-alt)] hover:shadow-md focus-visible:ring-[var(--color-primary)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Ghost - minimal style
        ghost: "bg-transparent text-[var(--color-text)] rounded-xl hover:bg-[var(--color-surface-alt)] focus-visible:ring-[var(--color-primary)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Destructive - error actions
        destructive: "bg-[var(--color-error)] text-white rounded-xl shadow-md hover:bg-[var(--color-error)]/90 hover:shadow-lg focus-visible:ring-[var(--color-error)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Success - positive actions
        success: "bg-[var(--color-success)] text-white rounded-xl shadow-md hover:bg-[var(--color-success)]/90 hover:shadow-lg focus-visible:ring-[var(--color-success)] transform hover:scale-[1.02] active:scale-[0.98]",
        
        // Link - text-only
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:ring-[var(--color-accent)] p-0 h-auto",
      },
      size: {
        // Comfortable touch targets
        sm: "h-10 px-4 text-sm font-medium", 
        default: "h-12 px-6 text-base font-medium",
        lg: "h-14 px-8 text-lg font-semibold",
        xl: "h-16 px-10 text-xl font-semibold",
        
        // Icon buttons
        icon: "h-12 w-12 p-0",
        "icon-sm": "h-10 w-10 p-0", 
        "icon-lg": "h-14 w-14 p-0",
        
        // Mobile optimized
        mobile: "h-14 px-6 text-base font-medium min-w-[44px]",
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
