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
  X
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from 'react'

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
          Ruokamäärälaskuri
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Dog className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Pentulaskuri
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Button asChild variant={isActive('/') ? 'default' : 'ghost'} size="sm">
              <Link to="/">
                <Scale className="mr-2 h-4 w-4" />
                Painonseuranta
              </Link>
            </Button>
            
            <Button asChild variant={isActive('/calculator') ? 'default' : 'ghost'} size="sm">
              <Link to="/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                Laskuri
              </Link>
            </Button>
            
            <Button asChild variant={isActive('/info') ? 'default' : 'ghost'} size="sm">
              <Link to="/info">
                <Info className="mr-2 h-4 w-4" />
                Oppaat
              </Link>
            </Button>
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