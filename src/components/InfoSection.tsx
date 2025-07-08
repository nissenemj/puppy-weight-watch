import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface InfoSectionProps {
  title: string
  sectionNumber?: string
  description?: string
  children: React.ReactNode
  className?: string
  id?: string
}

export default function InfoSection({ 
  title, 
  sectionNumber, 
  description, 
  children, 
  className,
  id 
}: InfoSectionProps) {
  return (
    <section id={id} className={cn("space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground flex items-center gap-3">
          {sectionNumber && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {sectionNumber}
            </Badge>
          )}
          {title}
        </h2>
        {description && (
          <p className="text-lg text-muted-foreground max-w-4xl">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  )
}