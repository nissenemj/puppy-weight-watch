
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Info, 
  Scale, 
  Dog, 
  ShieldCheck,
  Menu,
  X,
  MoreHorizontal,
  Moon,
  Sun,
  UtensilsCrossed,
  Database,
  Book,
  Calculator
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import HeaderButtons from './HeaderButtons'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Skip to content link
  const SkipLink = () => (
    <a 
      href="#main-content"
      className="skip-link fixed left-[-9999px] top-4 z-[2000] bg-primary text-primary-foreground px-4 py-2 rounded focus:left-4 transition-all duration-300"
    >
      Siirry suoraan sisältöön
    </a>
  )

  // Additional features navigation items (excluding main buttons)
  const additionalNavItems = [
    { href: '/', icon: Scale, label: 'Painonseuranta', description: 'Seuraa pennun kasvua' },
    { 
      href: '/info', 
      icon: Info, 
      label: 'Oppaat', 
      description: 'Hyödyllistä tietoa',
      group: 'Tietosivu'
    },
    { 
      href: '/info/puppy-guide', 
      icon: Dog, 
      label: 'Penturuokinta', 
      description: 'Ruokintaohjeet',
      group: 'Tietosivu'
    },
    { 
      href: '/info/safety', 
      icon: ShieldCheck, 
      label: 'Turvallisuus', 
      description: 'Turvallisuusvinkkejä',
      group: 'Tietosivu'
    },
    { 
      href: '/info/food-types', 
      icon: UtensilsCrossed, 
      label: 'Ruokatyypit', 
      description: 'Ruokatietokanta',
      group: 'Tietosivu'
    },
    { 
      href: '/info/feeding-data', 
      icon: Database, 
      label: 'Ruokinta-tiedot', 
      description: 'Ruokintasuositukset',
      group: 'Tietosivu'
    }
  ]


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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [isMobileMenuOpen])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const NavLink = ({ item, className = "" }: { 
    item: typeof additionalNavItems[0], 
    className?: string 
  }) => {
    const active = isActive(item.href)
    return (
      <Link
        to={item.href}
        className={`
          nav-link relative inline-flex items-center px-4 py-3 text-sm font-medium 
          transition-all duration-200 rounded-lg hover:scale-105 active:scale-95
          ${active 
            ? 'text-primary bg-primary/10 font-semibold' 
            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
          }
          ${className}
        `}
        aria-current={active ? 'page' : undefined}
        onClick={closeMobileMenu}
      >
        <item.icon className="mr-2 h-4 w-4" />
        <div className="flex flex-col items-start">
          <span>{item.label}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">{item.description}</span>
          )}
        </div>
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

          {/* Main Action Buttons (Center) */}
          <HeaderButtons />

          {/* Additional Features Navigator (Desktop) */}
          <nav 
            className="hidden md:flex" 
            aria-label="Lisäominaisuudet"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="px-4 py-2 font-medium"
                  aria-label="Avaa lisäominaisuudet"
                  aria-haspopup="true"
                >
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Lisäominaisuudet
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="min-w-72 bg-background/95 backdrop-blur-lg z-[100] border-border/50"
                sideOffset={8}
              >
                {/* Group items */}
                <div className="px-2 py-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Painonseuranta
                  </div>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/"
                      className="flex items-start gap-3 p-3 rounded-md"
                    >
                      <Scale className="h-4 w-4 mt-0.5 text-primary" />
                      <div>
                        <div className="font-medium">Painonseuranta</div>
                        <div className="text-xs text-muted-foreground">Seuraa pennun kasvua</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                
                <div className="px-2 py-1.5">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Tietosivut
                  </div>
                  {additionalNavItems
                    .filter(item => item.group === 'Tietosivu')
                    .map(item => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link 
                          to={item.href}
                          className="flex items-start gap-3 p-3 rounded-md"
                        >
                          <item.icon className="h-4 w-4 mt-0.5 text-primary" />
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.description}</div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Avaa navigointivalikko"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Off-Canvas Menu */}
      <div 
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeMobileMenu}
        />
        
        {/* Off-canvas panel */}
        <div 
          className={`absolute left-0 top-0 h-full w-80 bg-background border-r shadow-xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile menu header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <Dog className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">Pentulaskuri</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeMobileMenu}
              className="p-2"
              aria-label="Sulje valikko"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
           {/* Mobile navigation items */}
           <nav 
             className="px-6 py-4 space-y-3"
             aria-label="Mobiilinavigaatio"
           >
             {/* Main features first */}
             <div className="space-y-2">
               <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                 Pääominaisuudet
               </div>
               <Link
                 to="/puppy-book"
                 className={`
                   flex items-center gap-3 px-4 py-4 rounded-lg font-medium transition-all duration-200
                   ${isActive('/puppy-book') 
                     ? 'text-primary bg-primary/10 font-semibold' 
                     : 'text-foreground hover:bg-accent/50'
                   }
                 `}
                 onClick={closeMobileMenu}
                 aria-current={isActive('/puppy-book') ? 'page' : undefined}
               >
                 <Book className="h-5 w-5" />
                 Pentukirja
               </Link>
               <Link
                 to="/calculator"
                 className={`
                   flex items-center gap-3 px-4 py-4 rounded-lg font-medium transition-all duration-200
                   ${isActive('/calculator') 
                     ? 'text-primary bg-primary/10 font-semibold' 
                     : 'text-foreground hover:bg-accent/50'
                   }
                 `}
                 onClick={closeMobileMenu}
                 aria-current={isActive('/calculator') ? 'page' : undefined}
               >
                 <Calculator className="h-5 w-5" />
                 Pentulaskuri
               </Link>
             </div>

             {/* Additional features */}
             <div className="space-y-2 pt-4 border-t border-border/30">
               <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                 Lisäominaisuudet
               </div>
               {additionalNavItems.map((item) => (
                 <NavLink 
                   key={item.href}
                   item={item} 
                   className="w-full justify-start text-base py-3 px-4 hover:translate-x-1"
                 />
               ))}
             </div>
           </nav>
        </div>
      </div>
      
      {/* Main content wrapper */}
      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {/* Content will be rendered by routes */}
      </main>
    </>
  )
}

export default Navigation
