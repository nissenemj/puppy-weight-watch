import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface InfoCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'warm' | 'cool' | 'purple' | 'accent'
  icon?: React.ReactNode
}

export default function InfoCard({ 
  title, 
  description, 
  children, 
  className,
  variant = 'default',
  icon
}: InfoCardProps) {
  const variantClasses = {
    default: 'bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl',
    warm: 'bg-gradient-warm text-white border-0 shadow-xl rounded-2xl',
    cool: 'bg-gradient-cool text-white border-0 shadow-xl rounded-2xl',
    purple: 'bg-gradient-purple text-white border-0 shadow-xl rounded-2xl',
    accent: 'bg-accent/10 backdrop-blur-sm border-accent/20 shadow-xl rounded-2xl'
  }

  return (
    <Card className={cn(variantClasses[variant], className, "animate-fade-in hover-scale")}>
      <CardHeader>
        <CardTitle className={cn(
          "text-xl flex items-center gap-2",
          variant !== 'default' && variant !== 'accent' ? 'text-white' : ''
        )}>
          {icon}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(
            variant !== 'default' && variant !== 'accent' ? 'text-white/90' : ''
          )}>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}