import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Book, Calculator, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NavigationButtons: React.FC = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/weight-tracker') return location.pathname === '/weight-tracker'
    if (path === '/puppy-book') return location.pathname.startsWith('/puppy-book')
    if (path === '/calculator') return location.pathname === '/calculator'
    if (path === '/info') return location.pathname.startsWith('/info')
    return false
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        asChild
        variant={isActive('/weight-tracker') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-4 py-2 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/weight-tracker"
          className="flex items-center gap-2"
          aria-current={isActive('/weight-tracker') ? 'page' : undefined}
        >
          <Scale className="h-4 w-4" />
          Painonseuranta
        </Link>
      </Button>
      
      <Button
        asChild
        variant={isActive('/puppy-book') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-4 py-2 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/puppy-book"
          className="flex items-center gap-2"
          aria-current={isActive('/puppy-book') ? 'page' : undefined}
        >
          <Book className="h-4 w-4" />
          Pentukirja
        </Link>
      </Button>
      
      <Button
        asChild
        variant={isActive('/calculator') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-4 py-2 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/calculator"
          className="flex items-center gap-2"
          aria-current={isActive('/calculator') ? 'page' : undefined}
        >
          <Calculator className="h-4 w-4" />
          Laskuri
        </Link>
      </Button>
      
      <Button
        asChild
        variant={isActive('/info') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-4 py-2 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/info"
          className="flex items-center gap-2"
          aria-current={isActive('/info') ? 'page' : undefined}
        >
          <Info className="h-4 w-4" />
          Tietoa
        </Link>
      </Button>
    </div>
  )
}

export default NavigationButtons