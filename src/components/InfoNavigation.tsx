
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, BookOpen, Database, AlertTriangle, Dog } from 'lucide-react'

export default function InfoNavigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/info', label: 'Etusivu', icon: Home },
    { path: '/info/food-types', label: 'Ruokatyypit', icon: BookOpen },
    { path: '/info/feeding-data', label: 'Annostelutiedot', icon: Database },
    { path: '/info/safety', label: 'Turvallisuus', icon: AlertTriangle },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 w-full">
      <div className="container mx-auto px-2 sm:px-4 max-w-full">
        <div className="flex items-center justify-between h-16 min-w-0">
          <Link to="/info" className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-bold text-gray-900 truncate min-w-0">
            <Dog className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 flex-shrink-0" />
            <span className="hidden sm:inline truncate">Pentulaskuri</span>
          </Link>
          
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className="flex items-center gap-1 text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
          
          <Link to="/" className="flex-shrink-0">
            <Button variant="outline" size="sm" className="text-xs px-2 py-1">
              <span className="hidden sm:inline">Takaisin sovellukseen</span>
              <span className="sm:hidden">Takaisin</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
