import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base md:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 md:[&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary",
        ghost: "hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
      },
      size: {
        default: "h-12 px-4 py-2", // Increased from h-10 to meet 44px minimum touch target
        sm: "h-11 rounded-md px-3", // Increased from h-9 for mobile
        lg: "h-14 rounded-md px-8", // Increased from h-11 for better mobile experience
        icon: "h-12 w-12", // Increased from h-10 w-10 for mobile touch targets
        mobile: "h-14 px-6 py-3", // New mobile-specific size
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
