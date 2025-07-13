import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Scale, 
  BookOpen, 
  Info, 
  Plus,
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  gradient: string
}

const quickActions: QuickAction[] = [
  {
    id: 'weight-tracker',
    title: 'Painonseuranta',
    description: 'Seuraa pennun kasvua',
    icon: <Scale className="w-6 h-6" />,
    href: '/',
    color: 'text-primary',
    gradient: 'from-primary to-primary/80'
  },
  {
    id: 'calculator',
    title: 'Ruokalaskuri',
    description: 'Laske ruokamäärät',
    icon: <Calculator className="w-6 h-6" />,
    href: '/calculator',
    color: 'text-accent',
    gradient: 'from-accent to-accent/80'
  },
  {
    id: 'puppy-book',
    title: 'Pentukirja',
    description: 'Oppaat ja vinkit',
    icon: <BookOpen className="w-6 h-6" />,
    href: '/puppy-book',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 'info',
    title: 'Tietoa',
    description: 'Ruokinta ja terveys',
    icon: <Info className="w-6 h-6" />,
    href: '/info',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  }
]

interface QuickActionsProps {
  className?: string
  showAddNew?: boolean
}

export function QuickActions({ className, showAddNew = true }: QuickActionsProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Nopeat toiminnot</h3>
        {showAddNew && (
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Plus className="w-4 h-4 mr-1" />
            Lisää
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to={action.href}>
              <div className={`
                p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200
                group cursor-pointer relative overflow-hidden
              `}>
                {/* Gradient overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${action.gradient} 
                  opacity-0 group-hover:opacity-5 transition-opacity duration-200
                `} />
                
                <div className="relative z-10">
                  <div className={`${action.color} mb-2`}>
                    {action.icon}
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-muted-foreground'
    }
  }

  return (
    <motion.div
      className="p-4 rounded-xl border bg-card"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p className={`text-xs ${getTrendColor()} flex items-center gap-1 mt-1`}>
              <TrendingUp className="w-3 h-3" />
              {change}
            </p>
          )}
        </div>
        <div className="text-muted-foreground">
          {icon}
        </div>
      </div>
    </motion.div>
  )
}