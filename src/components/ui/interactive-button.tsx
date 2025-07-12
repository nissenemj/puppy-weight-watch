import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface InteractiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  buttonVariant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export const InteractiveButton: React.FC<InteractiveButtonProps> = ({ 
  children, 
  onClick, 
  buttonVariant = 'primary',
  className = "",
  disabled = false
}) => {
  const buttonClass = buttonVariant === 'primary' ? 'primary-action' : 'secondary-action'
  
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`${buttonClass} ${className}`}
        variant="ghost"
      >
        {children}
      </Button>
    </motion.div>
  )
}