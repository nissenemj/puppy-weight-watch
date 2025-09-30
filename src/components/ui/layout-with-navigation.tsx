import * as React from "react"
import { cn } from "@/lib/utils"
import { EnhancedNavigation } from "./enhanced-navigation"
import { QuickActions, QuickAction } from "./quick-actions"
import { SmartSearch } from "./smart-search"

interface LayoutWithNavigationProps {
  children: React.ReactNode
  className?: string
  showBreadcrumbs?: boolean
  stickyNavigation?: boolean
  showQuickActions?: boolean
  quickActionsVariant?: "floating" | "inline" | "sidebar"
  showSearch?: boolean
  customQuickActions?: QuickAction[]
}

export const LayoutWithNavigation = React.forwardRef<
  HTMLDivElement,
  LayoutWithNavigationProps
>(({
  children,
  className,
  showBreadcrumbs = true,
  stickyNavigation = true,
  showQuickActions = true,
  quickActionsVariant = "floating",
  showSearch = false,
  customQuickActions,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn("min-h-screen bg-gradient-subtle", className)} {...props}>
      {/* Enhanced Navigation */}
      <EnhancedNavigation
        showBreadcrumbs={showBreadcrumbs}
        sticky={stickyNavigation}
      >
        {/* Search Bar in Navigation */}
        {showSearch && (
          <div className="container mx-auto px-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-md mx-auto">
              <SmartSearch placeholder="Etsi pentulaskuri.com..." />
            </div>
          </div>
        )}
      </EnhancedNavigation>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Quick Actions */}
      {showQuickActions && quickActionsVariant === "floating" && (
        <QuickActions
          variant="floating"
          position="bottom-right"
          customActions={customQuickActions}
        />
      )}
    </div>
  )
})

LayoutWithNavigation.displayName = "LayoutWithNavigation"

export default LayoutWithNavigation