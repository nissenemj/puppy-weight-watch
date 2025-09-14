import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className = "",
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={className}
    >
      <Card className="h-full" variant="elevated">
        {children}
      </Card>
    </motion.div>
  )
}