
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, BookOpen, Database, AlertTriangle } from 'lucide-react'
import appIcon from '@/assets/app-icon.png'

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
          <Link to="/info" className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-bold truncate min-w-0">
            <img src={appIcon} alt="Pentulaskuri" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0" />
            <span className="hidden sm:inline truncate text-foreground font-semibold">Pentulaskuri</span>
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
