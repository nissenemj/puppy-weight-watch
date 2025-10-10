import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 font-medium rounded-[var(--radius-md)]",
  {
    variants: {
      variant: {
        // Primary - Warm terracotta brand color
        default: "bg-[var(--color-interactive-primary)] text-white shadow-sm hover:bg-[var(--color-interactive-primary-hover)] hover:shadow-md active:scale-95",

        // Outline - Border style
        outline: "border-2 border-[var(--color-interactive-primary)] bg-transparent text-[var(--color-interactive-primary)] hover:bg-[var(--color-primary-100)] active:scale-95",

        // Ghost - Minimal style
        ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-neutral-100 active:scale-95",

        // Destructive - Error/delete actions
        destructive: "bg-[var(--color-error)] text-white shadow-sm hover:bg-[var(--color-error)]/90 hover:shadow-md active:scale-95",

        // Link - Text-only link style
        link: "text-[var(--color-text-link)] underline-offset-4 hover:underline p-0 h-auto active:scale-95",
      },
      size: {
        // Mobile-first touch targets (min 44px)
        sm: "h-11 px-4 text-sm min-h-[44px]",
        default: "h-12 px-6 text-base min-h-[44px]",
        lg: "h-14 px-8 text-lg min-h-[48px]",

        // Icon buttons
        icon: "h-12 w-12 p-0 min-h-[44px] min-w-[44px]",
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
