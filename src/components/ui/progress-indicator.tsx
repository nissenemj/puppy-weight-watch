import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  progress: number // 0-100
  className?: string
  showPercentage?: boolean
  variant?: "default" | "puppy" | "success"
  size?: "sm" | "md" | "lg"
}

export function ProgressIndicator({ 
  progress, 
  className, 
  showPercentage = true,
  variant = "default",
  size = "md"
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "puppy":
        return "bg-gradient-to-r from-primary to-accent"
      case "success":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-primary"
    }
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Edistyminen</span>
        {showPercentage && (
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        )}
      </div>
      
      <div className={cn(
        "w-full bg-muted rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <motion.div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            getVariantStyles()
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {variant === "puppy" && progress === 100 && (
        <motion.div
          className="flex justify-center mt-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-2xl">🎉</span>
        </motion.div>
      )}
    </div>
  )
}

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  className?: string
}

export function StepProgress({ currentStep, totalSteps, steps, className }: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground">
          Vaihe {currentStep} / {totalSteps}
        </span>
        <span className="text-sm text-muted-foreground">
          {steps[currentStep - 1]}
        </span>
      </div>
      
      <div className="flex space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex-1 h-2 rounded-full",
              index < currentStep 
                ? "bg-primary" 
                : "bg-muted"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index < currentStep ? 1 : 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}