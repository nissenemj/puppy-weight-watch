
import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Calculator, 
  Info, 
  Scale, 
  Dog, 
  ShieldCheck,
  Menu,
  X,
  Book,
  MoreHorizontal,
  Moon,
  Sun
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navigation = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [hiddenItems, setHiddenItems] = useState<number[]>([])
  const navRef = useRef<HTMLUListElement>(null)
  const moreRef = useRef<HTMLLIElement>(null)
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Skip to content link
  const SkipLink = () => (
    <a 
      href="#main-content"
      className="skip-link absolute left-[-999px] top-auto z-[2000] bg-primary text-primary-foreground px-4 py-2 rounded focus:left-4 focus:top-4"
    >
      Siirry suoraan sisältöön
    </a>
  )

  // Main navigation items
  const navItems = [
    { href: '/', icon: Scale, label: 'Painonseuranta' },
    { href: '/calculator', icon: Calculator, label: 'Laskuri' },
    { href: '/puppy-book', icon: Book, label: 'Pentukirja' },
    { href: '/info', icon: Info, label: 'Oppaat' },
    { href: '/info/puppy-guide', icon: Dog, label: 'Penturuokinta' },
    { href: '/info/safety', icon: ShieldCheck, label: 'Turvallisuus' },
    { href: '/info/food-types', icon: Dog, label: 'Ruokatyypit' }
  ]

  // Priority+ navigation logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 || !navRef.current || !moreRef.current) return
      
      const nav = navRef.current
      const more = moreRef.current
      const items = Array.from(nav.children).filter(child => 
        !child.classList.contains('more-menu')
      ) as HTMLElement[]
      
      // Reset
      setHiddenItems([])
      setShowMoreMenu(false)
      
      const availableWidth = nav.clientWidth - more.offsetWidth - 40
      let totalWidth = 0
      const hidden: number[] = []
      
      for (let i = 0; i < items.length; i++) {
        totalWidth += items[i].offsetWidth
        if (totalWidth > availableWidth) {
          hidden.push(i)
        }
      }
      
      if (hidden.length > 0) {
        setHiddenItems(hidden)
        setShowMoreMenu(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Dark mode toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle('dark', shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
  }

  // Mobile menu effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const NavLink = ({ item, index, className = "" }: { 
    item: typeof navItems[0], 
    index: number, 
    className?: string 
  }) => {
    const active = isActive(item.href)
    return (
      <Link
        to={item.href}
        className={`
          nav-link relative inline-flex items-center px-4 py-3 text-sm font-medium 
          transition-all duration-200 rounded-lg
          ${active 
            ? 'text-primary bg-primary/10 font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }
          ${className}
        `}
        aria-current={active ? 'page' : undefined}
        onClick={() => setIsOpen(false)}
      >
        <item.icon className="mr-2 h-4 w-4" />
        {item.label}
        {active && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
        )}
      </Link>
    )
  }

  return (
    <>
      <SkipLink />
      <header className="site-header sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 font-bold text-lg hover:opacity-80 transition-opacity"
          >
            <Dog className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">Pentulaskuri</span>
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex flex-1 justify-center" 
            aria-label="Päänavigaatio"
          >
            <ul 
              ref={navRef}
              className="flex items-center gap-1 max-w-4xl overflow-hidden"
            >
              {navItems.map((item, index) => (
                <li 
                  key={item.href}
                  className={hiddenItems.includes(index) ? 'hidden' : ''}
                >
                  <NavLink item={item} index={index} />
                </li>
              ))}
              
              {/* More menu for Priority+ */}
              <li 
                ref={moreRef}
                className={`more-menu ${showMoreMenu ? 'block' : 'hidden'}`}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="px-4 py-3"
                      aria-label="Lisää vaihtoehtoja"
                    >
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Lisää
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end"
                    className="min-w-48 bg-background/95 backdrop-blur-lg"
                  >
                    {hiddenItems.map(index => (
                      <DropdownMenuItem key={navItems[index].href} asChild>
                        <Link 
                          to={navItems[index].href}
                          className="flex items-center w-full"
                        >
                          {React.createElement(navItems[index].icon, { className: "mr-2 h-4 w-4" })}
                          {navItems[index].label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
              aria-label={`Vaihda ${isDark ? 'vaaleaan' : 'tummaan'} teemaan`}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 md:hidden"
                  aria-label="Avaa navigointivalikko"
                  aria-expanded={isOpen}
                  aria-controls="mobile-nav"
                >
                  <div className="hamburger-icon relative w-5 h-5">
                    <span className={`hamburger-line ${isOpen ? 'open' : ''}`} />
                  </div>
                  <span className="sr-only">Valikko</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent 
                side="left" 
                className="w-80 sm:w-96 px-0"
                id="mobile-nav"
              >
                <SheetHeader className="px-6 pb-4">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Dog className="h-5 w-5 text-primary" />
                    Pentulaskuri
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Valitse sivu navigoidaksesi sovelluksessa
                  </SheetDescription>
                </SheetHeader>
                
                <nav 
                  className="px-6 space-y-2"
                  aria-label="Mobiilinavigaatio"
                >
                  {navItems.map((item, index) => (
                    <NavLink 
                      key={item.href}
                      item={item} 
                      index={index}
                      className="w-full justify-start"
                    />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Main content wrapper */}
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* Content will be rendered by routes */}
      </main>
    </>
  )
}

export default Navigation
