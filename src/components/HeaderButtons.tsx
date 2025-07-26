import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scale, Book } from 'lucide-react'
import { Button } from '@/components/ui/button'

const HeaderButtons: React.FC = () => {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/puppy-book') return location.pathname.startsWith('/puppy-book')
    return false
  }

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button
        asChild
        variant={isActive('/puppy-book') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-6 py-3 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/puppy-book"
          className="flex items-center gap-2"
          aria-current={isActive('/puppy-book') ? 'page' : undefined}
        >
          <Book className="h-5 w-5" />
          Pentukirja
        </Link>
      </Button>
      
      <Button
        asChild
        variant={isActive('/') ? 'default' : 'outline'}
        size="lg"
        className="font-semibold px-6 py-3 h-auto transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Link 
          to="/"
          className="flex items-center gap-2"
          aria-current={isActive('/') ? 'page' : undefined}
        >
          <Scale className="h-5 w-5" />
          Painonseuranta
        </Link>
      </Button>
    </div>
  )
}

export default HeaderButtons