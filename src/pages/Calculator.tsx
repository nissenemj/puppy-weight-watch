import React from 'react'
import Navigation from '@/components/Navigation'
import EnhancedPuppyCalculator from '@/components/EnhancedPuppyCalculator'

const Calculator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <EnhancedPuppyCalculator />
      </div>
    </div>
  )
}

export default Calculator