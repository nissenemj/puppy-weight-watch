import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Database,
  X,
  ArrowRight,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { useGuestAuth } from '@/contexts/GuestAuthContext'
import { motion, AnimatePresence } from 'framer-motion'

interface GuestModeBarProps {
  onSignUpClick: () => void
  onSignInClick: () => void
  className?: string
}

export default function GuestModeBar({
  onSignUpClick,
  onSignInClick,
  className = ""
}: GuestModeBarProps) {
  const { guestWeightEntries, guestDogProfile } = useGuestAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if dismissed or no guest data
  if (isDismissed || guestWeightEntries.length === 0) {
    return null
  }

  const entryCount = guestWeightEntries.length
  const hasProfile = !!guestDogProfile

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`relative z-50 ${className}`}
      >
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Status info */}
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Väliaikaistila
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-amber-700">
                  <Database className="w-4 h-4" />
                  <span className="font-medium">
                    {entryCount} mittaus{entryCount !== 1 ? 'ta' : ''} tallennettu
                  </span>
                  {hasProfile && (
                    <>
                      <span>•</span>
                      <span>{guestDogProfile?.name || 'Profiilit'} tallennettu</span>
                    </>
                  )}
                </div>
              </div>

              {/* Center - Warning message */}
              <div className="flex items-center gap-2 text-sm text-amber-700 text-center flex-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>
                  Tietosi tallennetaan väliaikaisesti. Luo tili pysyvää tallennusta varten.
                </span>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSignInClick}
                  className="bg-white hover:bg-amber-50 border-amber-300 text-amber-700 hover:text-amber-800"
                >
                  <User className="w-4 h-4 mr-1" />
                  Kirjaudu
                </Button>

                <Button
                  size="sm"
                  onClick={onSignUpClick}
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                >
                  Luo tili
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Optional: Data summary for larger screens */}
            <div className="hidden lg:flex items-center justify-center mt-2 pt-2 border-t border-amber-200">
              <div className="text-xs text-amber-600 text-center">
                💡 <strong>Vinkki:</strong> Tilin luominen vie alle minuutin ja synkronoi automaattisesti kaikki tietosi
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Lightweight version for mobile
export function GuestModeBarMobile({
  onSignUpClick,
  onSignInClick
}: Omit<GuestModeBarProps, 'className'>) {
  const { guestWeightEntries } = useGuestAuth()
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || guestWeightEntries.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-amber-50 border-b border-amber-200 px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{guestWeightEntries.length} mittausta tallennettu väliaikaisesti</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignInClick}
            className="text-amber-700 text-xs px-2 py-1 h-auto"
          >
            Kirjaudu
          </Button>
          <Button
            size="sm"
            onClick={onSignUpClick}
            className="bg-amber-600 text-white text-xs px-3 py-1 h-auto"
          >
            Luo tili
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDismissed(true)}
            className="text-amber-600 p-1 h-auto"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}