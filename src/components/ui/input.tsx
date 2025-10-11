import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
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
  successText?: string
  htmlSize?: number
  showStateIcon?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant,
    size,
    state,
    icon,
    suffix,
    label,
    helperText,
    errorText,
    successText,
    htmlSize,
    type,
    showStateIcon = true,
    ...props
  }, ref) => {
    // Determine final state
    const finalState = errorText ? "error" : successText ? "success" : state

    // Determine state icon
    const stateIcon = React.useMemo(() => {
      if (!showStateIcon) return null

      if (errorText) {
        return <AlertCircle className="h-4 w-4 text-[var(--color-error)]" aria-hidden="true" />
      }

      if (successText) {
        return <CheckCircle2 className="h-4 w-4 text-[var(--color-success)]" aria-hidden="true" />
      }

      return null
    }, [errorText, successText, showStateIcon])

    // Determine helper text to display
    const displayText = errorText || successText || helperText
    const displayIcon = errorText
      ? <AlertCircle className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      : successText
      ? <CheckCircle2 className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      : helperText
      ? <Info className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
      : null

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
              (suffix || stateIcon) && "pr-10",
              className
            )}
            ref={ref}
            aria-invalid={!!errorText}
            aria-describedby={displayText ? `${props.id}-hint` : undefined}
            {...props}
          />

          {(suffix || stateIcon) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {stateIcon || suffix}
            </div>
          )}
        </div>

        {displayText && (
          <div
            id={props.id ? `${props.id}-hint` : undefined}
            className={cn(
              "flex items-start gap-1.5 text-caption animate-in fade-in duration-200",
              errorText && "text-[var(--color-error)]",
              successText && "text-[var(--color-success)]",
              !errorText && !successText && "text-muted-foreground"
            )}
            role={errorText ? "alert" : "status"}
          >
            {displayIcon}
            <span>{displayText}</span>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

// eslint-disable-next-line react-refresh/only-export-components
export { Input, inputVariants }
