import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, Check } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-medium rounded-xl",
  {
    variants: {
      variant: {
        // Primary - Warm terracotta brand color with subtle glow
        default: "bg-terracotta-500 text-white shadow-sm shadow-terracotta-500/20 hover:bg-terracotta-600 hover:shadow-md hover:shadow-terracotta-500/30 active:scale-95",

        // Hero - Large, prominent CTA for hero sections
        hero: "bg-white text-terracotta-700 shadow-lg hover:bg-stone-50 hover:shadow-xl active:scale-95 font-semibold border-2 border-white/20",

        // Secondary - Sage green for secondary actions
        secondary: "bg-sage-500 text-white shadow-sm shadow-sage-500/20 hover:bg-sage-600 hover:shadow-md hover:shadow-sage-500/30 active:scale-95",

        // Outline - Border style with gradient hover
        outline: "border-2 border-terracotta-500 bg-transparent text-terracotta-600 hover:bg-terracotta-50 hover:shadow-sm hover:shadow-terracotta-500/10 active:scale-95",

        // Ghost - Minimal style
        ghost: "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:scale-95",

        // Destructive - Error/delete actions
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md active:scale-95",

        // Link - Text-only link style
        link: "text-terracotta-600 underline-offset-4 hover:underline p-0 h-auto active:scale-95",
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

