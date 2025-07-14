import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface ToastProps {
  type: "success" | "error" | "warning" | "info"
  title: string
  message?: string
  duration?: number
  onClose: () => void
  className?: string
}

const toastVariants = {
  initial: { opacity: 0, y: 50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } }
}

const getToastStyles = (type: ToastProps["type"]) => {
  switch (type) {
    case "success":
      return {
        bg: "bg-green-50 border-green-200",
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        titleColor: "text-green-800",
        messageColor: "text-green-700"
      }
    case "error":
      return {
        bg: "bg-red-50 border-red-200",
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
        titleColor: "text-red-800",
        messageColor: "text-red-700"
      }
    case "warning":
      return {
        bg: "bg-yellow-50 border-yellow-200",
        icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
        titleColor: "text-yellow-800",
        messageColor: "text-yellow-700"
      }
    case "info":
      return {
        bg: "bg-blue-50 border-blue-200",
        icon: <Info className="w-5 h-5 text-blue-600" />,
        titleColor: "text-blue-800",
        messageColor: "text-blue-700"
      }
  }
}

export function EnhancedToast({ 
  type, 
  title, 
  message, 
  onClose, 
  className 
}: ToastProps) {
  const styles = getToastStyles(type)

  return (
    <motion.div
      className={cn(
        "relative w-full max-w-sm p-4 rounded-lg border shadow-lg",
        styles.bg,
        className
      )}
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {styles.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-semibold", styles.titleColor)}>
            {title}
          </h4>
          {message && (
            <p className={cn("text-sm mt-1", styles.messageColor)}>
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-lg"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
      />
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          >
            <EnhancedToast
              {...toast}
              onClose={() => onRemove(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}