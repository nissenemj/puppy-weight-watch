import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Search,
  Clock,
  TrendingUp,
  BookOpen,
  Calculator,
  Scale,
  Heart,
  Dog,
  X,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Button } from "./button"
import { Card } from "./card"
import { Badge } from "./badge"
import { Separator } from "./separator"

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  action: () => void
  keywords: string[]
  priority: number
}

interface SearchSuggestion {
  id: string
  query: string
  category: string
  icon: React.ReactNode
}

interface SmartSearchProps {
  className?: string
  placeholder?: string
  variant?: "default" | "modal" | "inline"
  onClose?: () => void
}

export const SmartSearch = React.forwardRef<HTMLDivElement, SmartSearchProps>(
  ({ className, placeholder = "Etsi...", variant = "default", onClose, ...props }, ref) => {
    const [query, setQuery] = React.useState("")
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const [recentSearches, setRecentSearches] = React.useState<string[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Search data - could be fetched from API
    const searchData: SearchResult[] = React.useMemo(() => [
      {
        id: "weight-tracker",
        title: "Painonseuranta",
        description: "Seuraa pennun painon kehitystä",
        category: "Ominaisuudet",
        icon: <Scale className="w-4 h-4" />,
        action: () => navigate("/weight-tracker"),
        keywords: ["paino", "seuranta", "mittaus", "kasvu", "kehitys"],
        priority: 10
      },
      {
        id: "food-calculator",
        title: "Ruokalaskuri",
        description: "Laske sopivat ruokamäärät",
        category: "Ominaisuudet",
        icon: <Calculator className="w-4 h-4" />,
        action: () => navigate("/calculator"),
        keywords: ["ruoka", "laskuri", "annos", "määrä", "syöttäminen"],
        priority: 10
      },
      {
        id: "puppy-book",
        title: "Pentupäiväkirja",
        description: "Tallenna muistoja ja milestone-tapahtumia",
        category: "Ominaisuudet",
        icon: <BookOpen className="w-4 h-4" />,
        action: () => navigate("/puppy-book"),
        keywords: ["päiväkirja", "muistot", "milestone", "valokuvat"],
        priority: 9
      },
      {
        id: "puppy-guide",
        title: "Pentuopas",
        description: "Kasvatus- ja hoito-ohjeet",
        category: "Oppaat",
        icon: <Dog className="w-4 h-4" />,
        action: () => navigate("/guides/puppy-guide"),
        keywords: ["opas", "kasvatus", "hoito", "vinkit", "neuvot"],
        priority: 8
      },
      {
        id: "socialization",
        title: "Sosialisaatio",
        description: "Pennun tutustuttaminen ympäröivään maailmaan",
        category: "Oppaat",
        icon: <Heart className="w-4 h-4" />,
        action: () => navigate("/guides/socialization"),
        keywords: ["sosialisaatio", "tutustuttaminen", "sosiaalisuus"],
        priority: 7
      },
      {
        id: "feeding-tips",
        title: "Ruokintavinkit",
        description: "Vinkkejä oikeanlaiseen ruokintaan",
        category: "Oppaat",
        icon: <TrendingUp className="w-4 h-4" />,
        action: () => navigate("/guides"),
        keywords: ["ruokinta", "vinkit", "syöttäminen", "ravinto"],
        priority: 6
      }
    ], [navigate])

    // Smart suggestions based on context
    const getSmartSuggestions = React.useCallback((): SearchSuggestion[] => {
      const suggestions: SearchSuggestion[] = [
        {
          id: "add-weight",
          query: "lisää paino",
          category: "Toiminnot",
          icon: <Scale className="w-4 h-4" />
        },
        {
          id: "calculate-food",
          query: "laske ruokamäärä",
          category: "Toiminnot",
          icon: <Calculator className="w-4 h-4" />
        },
        {
          id: "puppy-care",
          query: "pennun hoito",
          category: "Oppaat",
          icon: <Heart className="w-4 h-4" />
        }
      ]

      // Add contextual suggestions based on current page
      if (location.pathname === "/weight-tracker") {
        suggestions.unshift({
          id: "weight-analysis",
          query: "painokäyrä analyysi",
          category: "Analyysi",
          icon: <TrendingUp className="w-4 h-4" />
        })
      }

      return suggestions
    }, [location.pathname])

    // Filter search results
    const filteredResults = React.useMemo(() => {
      if (!query.trim()) return []

      const queryLower = query.toLowerCase()
      return searchData
        .filter(item => {
          const titleMatch = item.title.toLowerCase().includes(queryLower)
          const descMatch = item.description.toLowerCase().includes(queryLower)
          const keywordMatch = item.keywords.some(keyword =>
            keyword.toLowerCase().includes(queryLower)
          )
          return titleMatch || descMatch || keywordMatch
        })
        .sort((a, b) => {
          // Prioritize title matches
          const aTitleMatch = a.title.toLowerCase().includes(queryLower)
          const bTitleMatch = b.title.toLowerCase().includes(queryLower)
          if (aTitleMatch && !bTitleMatch) return -1
          if (!aTitleMatch && bTitleMatch) return 1

          // Then by priority
          return b.priority - a.priority
        })
        .slice(0, 6)
    }, [query, searchData])

    // Handle search execution
    const handleSearch = (result?: SearchResult) => {
      const searchTerm = result?.title || query

      if (searchTerm.trim()) {
        // Save to recent searches
        setRecentSearches(prev => {
          const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5)
          localStorage.setItem('recentSearches', JSON.stringify(updated))
          return updated
        })

        if (result) {
          result.action()
        } else {
          // Generic search - could navigate to search results page
          navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
        }

        setQuery("")
        setIsOpen(false)
        onClose?.()
      }
    }

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
      setQuery(suggestion.query)
      inputRef.current?.focus()
    }

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < filteredResults.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case "Enter":
          e.preventDefault()
          if (selectedIndex >= 0 && filteredResults[selectedIndex]) {
            handleSearch(filteredResults[selectedIndex])
          } else {
            handleSearch()
          }
          break
        case "Escape":
          setIsOpen(false)
          setSelectedIndex(-1)
          onClose?.()
          break
      }
    }

    // Load recent searches
    React.useEffect(() => {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch {
          // Ignore parsing errors
        }
      }
    }, [])

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && 'current' in ref && ref.current &&
            !ref.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSelectedIndex(-1)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [ref])

    const suggestions = getSmartSuggestions()

    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card className="max-h-96 overflow-hidden shadow-xl border-0 glass-card">
                {/* Search Results */}
                {filteredResults.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-body-sm font-semibold text-white mb-2 px-2">
                      Hakutulokset
                    </h3>
                    <div className="space-y-1">
                      {filteredResults.map((result, index) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start gap-3 p-3 h-auto text-left text-white hover:bg-white/20",
                              selectedIndex === index && "bg-white/20"
                            )}
                            onClick={() => handleSearch(result)}
                          >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                              {result.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{result.title}</div>
                              <div className="text-white/70 text-caption truncate">
                                {result.description}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {result.category}
                            </Badge>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Suggestions */}
                {!query && suggestions.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-body-sm font-semibold text-white mb-2 px-2">
                      Ehdotukset
                    </h3>
                    <div className="grid grid-cols-1 gap-1">
                      {suggestions.map((suggestion) => (
                        <Button
                          key={suggestion.id}
                          variant="ghost"
                          className="justify-start gap-3 p-2 h-auto text-white hover:bg-white/20"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/10">
                            {suggestion.icon}
                          </span>
                          <span className="text-body-sm">{suggestion.query}</span>
                          <ArrowRight className="w-3 h-3 ml-auto opacity-70" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <>
                    <Separator className="bg-white/10" />
                    <div className="p-2">
                      <h3 className="text-body-sm font-semibold text-white mb-2 px-2">
                        Viimeaikaiset haut
                      </h3>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start gap-3 p-2 text-white hover:bg-white/20"
                            onClick={() => setQuery(search)}
                          >
                            <Clock className="w-4 h-4 opacity-70" />
                            <span className="text-body-sm">{search}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* No Results */}
                {query && filteredResults.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="text-white/70 mb-2">
                      Ei hakutuloksia haulle "{query}"
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-white/20 hover:bg-white/10"
                      onClick={() => handleSearch()}
                    >
                      Etsi yleisesti
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

SmartSearch.displayName = "SmartSearch"

export type { SearchResult, SearchSuggestion, SmartSearchProps }