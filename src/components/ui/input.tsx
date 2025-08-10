import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full border font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)] ring-offset-background focus-visible:ring-[var(--color-accent)] hover:border-[var(--color-accent-200)]",
        glass: "bg-white/5 border-white/20 text-white ring-offset-transparent focus-visible:ring-white/50 hover:border-white/30 placeholder:text-white/60",
        filled: "bg-[var(--color-primary-50)] border-transparent text-[var(--color-text)] focus-visible:ring-[var(--color-accent)] hover:bg-[var(--color-primary-100)]",
        outline: "bg-transparent border-2 border-[var(--color-accent-200)] text-[var(--color-text)] focus-visible:ring-[var(--color-accent)] focus-visible:border-[var(--color-accent)] hover:border-[var(--color-accent-300)]"
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm rounded-lg",
        default: "h-11 px-4 py-2 text-body rounded-xl",
        lg: "h-12 px-4 py-3 text-body-lg rounded-xl",
        xl: "h-14 px-6 py-4 text-body-lg rounded-2xl"
      },
      state: {
        default: "",
        error: "border-red-300 focus-visible:ring-red-500 text-red-900 placeholder:text-red-400",
        success: "border-green-300 focus-visible:ring-green-500 text-green-900",
        warning: "border-yellow-300 focus-visible:ring-yellow-500 text-yellow-900"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    }
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode
  suffix?: React.ReactNode
  label?: string
  helperText?: string
  errorText?: string
  htmlSize?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, icon, suffix, label, helperText, errorText, htmlSize, type, ...props }, ref) => {
    const finalState = errorText ? "error" : state

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-body-sm font-medium text-[var(--color-text)] block">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            type={type}
            size={htmlSize}
            className={cn(
              inputVariants({ variant, size, state: finalState }),
              icon && "pl-10",
              suffix && "pr-10",
              className
            )}
            ref={ref}
            {...props}
          />
          
          {suffix && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {suffix}
            </div>
          )}
        </div>

        {(helperText || errorText) && (
          <div className={cn(
            "text-caption",
            errorText ? "text-red-600" : "text-muted-foreground"
          )}>
            {errorText || helperText}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
