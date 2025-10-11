import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 font-medium rounded-[var(--radius-md)]",
  {
    variants: {
      variant: {
        // Primary - Warm terracotta brand color
        default: "bg-[var(--color-interactive-primary)] text-white shadow-sm hover:bg-[var(--color-interactive-primary-hover)] hover:shadow-md active:scale-95",

        // Hero - Large, prominent CTA for hero sections
        hero: "bg-white text-[var(--color-primary-700)] shadow-lg hover:bg-white/90 hover:shadow-xl active:scale-95 font-semibold border-2 border-white/20",

        // Secondary - Soft background style
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",

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
        mobile: "h-14 px-6 text-base min-h-[56px]",

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
  isLoading?: boolean
  isSuccess?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    isLoading = false,
    isSuccess = false,
    loadingText,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button"

    // Disable button when loading
    const isDisabled = disabled || isLoading

    // Determine what to show
    const content = React.useMemo(() => {
      if (isSuccess) {
        return (
          <>
            <Check className="h-4 w-4 animate-in zoom-in duration-200" aria-hidden="true" />
            <span className="animate-in fade-in duration-200">Tallennettu!</span>
          </>
        )
      }

      if (isLoading) {
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="animate-in fade-in duration-200">{loadingText || "Ladataan..."}</span>
          </>
        )
      }

      return children
    }, [isSuccess, isLoading, loadingText, children])

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-live={isLoading || isSuccess ? "polite" : undefined}
        {...props}
      >
        {content}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
