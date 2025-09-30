import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Scale,
  Calculator,
  PlusCircle,
  Camera,
  BookOpen,
  Zap,
  ChevronUp,
  Dog,
  Heart,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Card } from "./card"
import { Badge } from "./badge"
import { Separator } from "./separator"

interface QuickAction {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
  badge?: string
  color?: "default" | "primary" | "secondary" | "success"
  disabled?: boolean
}

interface QuickActionsProps {
  className?: string
  variant?: "floating" | "inline" | "sidebar"
  position?: "bottom-right" | "bottom-left" | "bottom-center"
  customActions?: QuickAction[]
}

export const QuickActions = React.forwardRef<HTMLDivElement, QuickActionsProps>(
  ({
    className,
    variant = "floating",
    position = "bottom-right",
    customActions,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [lastUsedActions, setLastUsedActions] = React.useState<string[]>([])
    const navigate = useNavigate()
    const location = useLocation()

    // Smart actions based on current route
    const getContextualActions = React.useCallback((): QuickAction[] => {
      const baseActions: QuickAction[] = [
        {
          id: "add-weight",
          label: "Lisää paino",
          description: "Tallenna uusi painomittaus",
          icon: <Scale className="w-4 h-4" />,
          action: () => navigate("/weight-tracker"),
          color: "primary"
        },
        {
          id: "calculate-food",
          label: "Laske ruoka",
          description: "Määritä ruokamäärä",
          icon: <Calculator className="w-4 h-4" />,
          action: () => navigate("/calculator"),
          color: "secondary"
        },
        {
          id: "add-memory",
          label: "Lisää muisto",
          description: "Tallenna pentupäiväkirjaan",
          icon: <Camera className="w-4 h-4" />,
          action: () => navigate("/puppy-book"),
          color: "success"
        },
        {
          id: "view-guides",
          label: "Oppaat",
          description: "Lue pentuoppaita",
          icon: <BookOpen className="w-4 h-4" />,
          action: () => navigate("/guides")
        }
      ]

      // Add contextual actions based on current route
      const contextualActions: QuickAction[] = []

      if (location.pathname === "/weight-tracker") {
        contextualActions.push({
          id: "add-health-record",
          label: "Terveysmerkintä",
          description: "Lisää terveystietoja",
          icon: <Heart className="w-4 h-4" />,
          action: () => navigate("/puppy-book?tab=health"),
          color: "success"
        })
      }

      if (location.pathname === "/calculator") {
        contextualActions.push({
          id: "view-food-types",
          label: "Ruokatyypit",
          description: "Selaa ruokavaihtoehtoja",
          icon: <Dog className="w-4 h-4" />,
          action: () => navigate("/food-types")
        })
      }

      if (location.pathname === "/puppy-book") {
        contextualActions.push({
          id: "add-milestone",
          label: "Milestone",
          description: "Merkitse tärkeä hetki",
          icon: <Calendar className="w-4 h-4" />,
          action: () => navigate("/puppy-book?tab=milestones"),
          color: "primary"
        })
      }

      return [...contextualActions, ...baseActions].slice(0, 6)
    }, [navigate, location.pathname])

    const actions = customActions || getContextualActions()

    const handleActionClick = (action: QuickAction) => {
      // Track usage for smart ordering
      setLastUsedActions(prev => {
        const updated = [action.id, ...prev.filter(id => id !== action.id)].slice(0, 3)
        localStorage.setItem('quickActionsUsage', JSON.stringify(updated))
        return updated
      })

      action.action()
      setIsOpen(false)

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30)
      }
    }

    // Load usage history
    React.useEffect(() => {
      const saved = localStorage.getItem('quickActionsUsage')
      if (saved) {
        try {
          setLastUsedActions(JSON.parse(saved))
        } catch {
          // Ignore parsing errors
        }
      }
    }, [])

    // Sort actions by usage
    const sortedActions = React.useMemo(() => {
      return [...actions].sort((a, b) => {
        const aIndex = lastUsedActions.indexOf(a.id)
        const bIndex = lastUsedActions.indexOf(b.id)

        if (aIndex === -1 && bIndex === -1) return 0
        if (aIndex === -1) return 1
        if (bIndex === -1) return -1

        return aIndex - bIndex
      })
    }, [actions, lastUsedActions])

    // Floating variant
    if (variant === "floating") {
      const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2'
      }

      return (
        <div
          ref={ref}
          className={cn(
            "fixed z-50",
            positionClasses[position],
            className
          )}
          {...props}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="mb-4"
              >
                <Card className="p-4 max-w-sm shadow-xl border-0 glass-card">
                  <div className="space-y-2">
                    <h3 className="text-body font-semibold text-center text-white mb-3">
                      Pika-toiminnot
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      {sortedActions.map((action, index) => (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-auto p-3 flex flex-col items-center gap-2 text-white hover:bg-white/20 relative transition-all duration-200",
                              action.disabled && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => handleActionClick(action)}
                            disabled={action.disabled}
                          >
                            <div className="flex items-center justify-center">
                              {action.icon}
                            </div>
                            <div className="text-center">
                              <div className="text-xs font-medium">{action.label}</div>
                            </div>

                            {action.badge && (
                              <Badge
                                variant="secondary"
                                className="absolute -top-1 -right-1 text-xs h-5 px-1"
                              >
                                {action.badge}
                              </Badge>
                            )}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Button */}
          <Button
            variant="gradient"
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300",
              isOpen && "rotate-45"
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <Zap className="w-6 h-6" />
              )}
            </motion.div>
          </Button>
        </div>
      )
    }

    // Inline variant
    if (variant === "inline") {
      return (
        <div ref={ref} className={cn("space-y-4", className)} {...props}>
          <div className="flex items-center justify-between">
            <h3 className="text-h6 font-semibold text-[var(--color-text-primary)]">
              Pika-toiminnot
            </h3>
            <Badge variant="secondary" className="text-xs">
              {sortedActions.length}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedActions.map((action) => (
              <motion.div
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 mobile-card-interactive">
                  <Button
                    variant="ghost"
                    className="w-full h-auto p-0 flex flex-col items-center gap-3"
                    onClick={() => handleActionClick(action)}
                    disabled={action.disabled}
                  >
                    <div className={cn(
                      "p-3 rounded-xl",
                      action.color === "primary" && "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]",
                      action.color === "secondary" && "bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]",
                      action.color === "success" && "bg-[var(--color-tertiary-100)] text-[var(--color-tertiary-600)]",
                      !action.color && "bg-[var(--color-accent-100)] text-[var(--color-text-primary)]"
                    )}>
                      {action.icon}
                    </div>

                    <div className="text-center">
                      <div className="text-body-sm font-medium text-[var(--color-text-primary)]">
                        {action.label}
                      </div>
                      <div className="text-caption text-[var(--color-text-secondary)] mt-1">
                        {action.description}
                      </div>
                    </div>

                    {action.badge && (
                      <Badge variant="outline" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }

    // Sidebar variant
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        <h3 className="text-body font-semibold text-[var(--color-text-primary)] px-3">
          Pika-toiminnot
        </h3>

        <Separator />

        <div className="space-y-1">
          {sortedActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 h-auto",
                action.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
            >
              <span className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                action.color === "primary" && "bg-[var(--color-primary-100)] text-[var(--color-primary-600)]",
                action.color === "secondary" && "bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]",
                action.color === "success" && "bg-[var(--color-tertiary-100)] text-[var(--color-tertiary-600)]",
                !action.color && "bg-[var(--color-accent-100)] text-[var(--color-text-primary)]"
              )}>
                {action.icon}
              </span>

              <div className="flex-1 text-left">
                <div className="text-body-sm font-medium">{action.label}</div>
                <div className="text-caption text-[var(--color-text-secondary)]">
                  {action.description}
                </div>
              </div>

              {action.badge && (
                <Badge variant="secondary" className="text-xs">
                  {action.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    )
  }
)

QuickActions.displayName = "QuickActions"

export type { QuickAction, QuickActionsProps }