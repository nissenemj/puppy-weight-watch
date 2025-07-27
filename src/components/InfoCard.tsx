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
    default: 'bg-card/95 backdrop-blur-sm border-0 shadow-xl rounded-2xl',
    warm: 'bg-gradient-peach text-gray-800 border-0 shadow-xl rounded-2xl',
    cool: 'bg-gradient-mint text-gray-800 border-0 shadow-xl rounded-2xl',
    purple: 'bg-gradient-primary text-white border-0 shadow-xl rounded-2xl',
    accent: 'bg-accent/15 backdrop-blur-sm border-accent/30 shadow-xl rounded-2xl text-card-foreground'
  }

  return (
    <Card className={cn(variantClasses[variant], className, "animate-fade-in hover-scale")}>
      <CardHeader>
        <CardTitle className={cn(
          "text-xl flex items-center gap-2",
          variant === 'purple' 
            ? "text-white" 
            : variant === 'warm' || variant === 'cool'
            ? "text-gray-800"
            : "text-card-foreground"
        )}>
          {icon}
          {title}
        </CardTitle>
        {description && (
          <CardDescription className={cn(
            variant === 'purple' 
              ? "text-white/80" 
              : variant === 'warm' || variant === 'cool'
              ? "text-gray-700"
              : "text-muted-foreground"
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