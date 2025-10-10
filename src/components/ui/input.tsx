import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full border font-medium transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-white border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-primary-500)] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]",
        outline: "bg-transparent border-2 border-[var(--color-primary-500)] text-[var(--color-text-primary)] hover:border-[var(--color-primary-700)] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)]"
      },
      size: {
        sm: "h-11 px-3 py-2 text-sm rounded-lg min-h-[44px]",
        default: "h-11 px-4 py-2 text-base rounded-xl min-h-[44px]",
        lg: "h-12 px-4 py-3 text-lg rounded-xl min-h-[44px]"
      },
      state: {
        default: "",
        error: "border-[var(--color-error)] focus-visible:ring-[var(--color-error)]",
        success: "border-[var(--color-success)] focus-visible:ring-[var(--color-success)]"
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
