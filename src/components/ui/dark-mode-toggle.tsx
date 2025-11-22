import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

interface DarkModeToggleProps {
  className?: string
  variant?: "default" | "glass" | "neo" | "minimal"
}

export const DarkModeToggle = React.forwardRef<
  HTMLButtonElement,
  DarkModeToggleProps
>(({ className, variant = "default" }, ref) => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  const getVariantStyles = () => {
    switch (variant) {
      case "glass":
        return "glass-card hover:backdrop-blur-xl micro-bounce"
      case "neo":
        return "neo-button"
      case "minimal":
        return "bg-transparent hover:bg-[var(--color-background-secondary)]"
      default:
        return ""
    }
  }

  return (
    <Button
      ref={ref}
      variant={variant === "default" ? "ghost" : "ghost"}
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        getVariantStyles(),
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300 smooth-transform",
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 w-5 h-5 transition-all duration-300 smooth-transform",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          )}
        />
      </div>

      {/* Animated background */}
      <div
        className={cn(
          "absolute inset-0 rounded-md transition-all duration-500",
          isDark
            ? "bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"
            : "bg-gradient-to-br from-yellow-200/20 via-orange-200/20 to-red-200/20"
        )}
      />
    </Button>
  )
})

DarkModeToggle.displayName = "DarkModeToggle"

// Hook for using dark mode state
export const useDarkMode = () => {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    // Check initial theme from localStorage or system preference
    const stored = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = stored === 'dark' || (!stored && systemPrefersDark)

    setIsDark(shouldBeDark)

    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = React.useCallback(() => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return { isDark, toggleDarkMode }
}