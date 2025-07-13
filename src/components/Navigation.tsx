import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  Calculator, 
  Info, 
  Scale, 
  Dog, 
  ShieldCheck,
  Menu,
  X,
  Book,
  Bell,
  Settings
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Navigation = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const NavigationLinks = () => (
    <div className="flex flex-col space-y-2 w-full">
      <Button 
        asChild 
        variant={isActive('/') ? 'default' : 'ghost'} 
        className="justify-start"
        onClick={() => setIsOpen(false)}
      >
        <Link to="/">
          <Scale className="mr-2 h-4 w-4" />
          Painonseuranta
        </Link>
      </Button>

      <Button 
        asChild 
        variant={isActive('/calculator') ? 'default' : 'ghost'} 
        className="justify-start"
        onClick={() => setIsOpen(false)}
      >
        <Link to="/calculator">
          <Calculator className="mr-2 h-4 w-4" />
          Laskuri
        </Link>
      </Button>
      
      <Button 
        asChild 
        variant={isActive('/puppy-book') ? 'default' : 'ghost'} 
        className="justify-start"
        onClick={() => setIsOpen(false)}
      >
        <Link to="/puppy-book">
          <Book className="mr-2 h-4 w-4" />
          Pentukirja
        </Link>
      </Button>
      
      <Button 
        asChild 
        variant={isActive('/info') ? 'default' : 'ghost'} 
        className="justify-start"
        onClick={() => setIsOpen(false)}
      >
        <Link to="/info">
          <Info className="mr-2 h-4 w-4" />
          Tietoa ja oppaat
        </Link>
      </Button>

      <div className="px-3 py-2">
        <p className="text-sm font-medium text-muted-foreground mb-2">Oppaat</p>
        <div className="space-y-1">
          <Button 
            asChild 
            variant={isActive('/info/puppy-guide') ? 'secondary' : 'ghost'} 
            size="sm"
            className="justify-start w-full"
            onClick={() => setIsOpen(false)}
          >
            <Link to="/info/puppy-guide">
              <Dog className="mr-2 h-3 w-3" />
              Penturuokinta
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant={isActive('/info/safety') ? 'secondary' : 'ghost'} 
            size="sm"
            className="justify-start w-full"
            onClick={() => setIsOpen(false)}
          >
            <Link to="/info/safety">
              <ShieldCheck className="mr-2 h-3 w-3" />
              Turvallisuus
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant={isActive('/info/food-types') ? 'secondary' : 'ghost'} 
            size="sm"
            className="justify-start w-full"
            onClick={() => setIsOpen(false)}
          >
            <Link to="/info/food-types">
              <Dog className="mr-2 h-3 w-3" />
              Ruokatyypit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Dog className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Pentulaskuri
            </span>
          </Link>
          
          <div className="flex overflow-x-auto scrollbar-hide">
            <Link
              to="/"
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all flex items-center ${
                isActive('/') 
                  ? 'nav-tab-active' 
                  : 'nav-tab-inactive'
              }`}
            >
              <Scale className="w-5 h-5 mr-2" />
              Painonseuranta
            </Link>
            
            <Link
              to="/calculator"
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all flex items-center ${
                isActive('/calculator') 
                  ? 'nav-tab-active' 
                  : 'nav-tab-inactive'
              }`}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Laskuri
            </Link>
            
            <Link
              to="/puppy-book"
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all flex items-center ${
                isActive('/puppy-book') 
                  ? 'nav-tab-active' 
                  : 'nav-tab-inactive'
              }`}
            >
              <Book className="w-5 h-5 mr-2" />
              Pentukirja
            </Link>
            
            <Link
              to="/info"
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium transition-all flex items-center ${
                isActive('/info') 
                  ? 'nav-tab-active' 
                  : 'nav-tab-inactive'
              }`}
            >
              <Info className="w-5 h-5 mr-2" />
              Oppaat
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Avaa valikko</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-6">
              <Link
                to="/"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Dog className="h-6 w-6" />
                <span className="font-bold">Pentulaskuri</span>
              </Link>
              <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                <div className="flex flex-col space-y-3">
                  <NavigationLinks />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <Dog className="h-6 w-6" />
              <span className="font-bold">Pentulaskuri</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation