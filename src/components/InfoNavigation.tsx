
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, BookOpen, Database, AlertTriangle } from 'lucide-react'
import puppyLogo from '@/assets/puppy-logo.png'

export default function InfoNavigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/info', label: 'Etusivu', icon: Home },
    { path: '/info/food-types', label: 'Ruokatyypit', icon: BookOpen },
    { path: '/info/feeding-data', label: 'Annostelutiedot', icon: Database },
    { path: '/info/safety', label: 'Turvallisuus', icon: AlertTriangle },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/info" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-gray-900 truncate">
            <img src={puppyLogo} alt="Puppy Logo" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <span className="hidden sm:inline">Puppy Weight Watch</span>
            <span className="sm:hidden">PWW</span>
          </Link>
          
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
          
          <Link to="/">
            <Button variant="outline" size="sm">
              Takaisin sovellukseen
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
