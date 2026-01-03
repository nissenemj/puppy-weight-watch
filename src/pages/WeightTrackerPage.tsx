import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthenticationWrapper from '@/components/AuthenticationWrapper'
import ModernPuppyWeightTracker from '@/components/ModernPuppyWeightTracker'
import { useGuestAuth } from '@/contexts/GuestAuthContext'
import GuestModeBar, { GuestModeBarMobile } from '@/components/GuestModeBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PullToRefresh } from '@/components/ui/pull-to-refresh'
import { User as UserIcon, Loader2, Dog, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

const WeightTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const { isGuest, guestWeightEntries, syncGuestDataToUser } = useGuestAuth()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const [hasDogs, setHasDogs] = useState(false)
  const [checkingData, setCheckingData] = useState(true)

  const checkUserData = useCallback(async (userData: User) => {
    try {
      setCheckingData(true)
      // Check if user has any dogs
      const { data: dogs, error: dogsError } = await supabase
        .from('dogs')
        .select('id')
        .eq('user_id', userData.id)
        .limit(1)

      if (dogsError) {
        console.error('Error checking dogs:', dogsError)
        toast({
          title: "Virhe tietojen haussa",
          description: "Koirien tarkistaminen epäonnistui",
          variant: "destructive"
        })
      } else {
        const dogsExist = dogs && dogs.length > 0
        setHasDogs(dogsExist)
      }
    } catch (error) {
      console.error('Error in checkUserData:', error)
      toast({
        title: "Virhe",
        description: "Tietojen lataaminen epäonnistui",
        variant: "destructive"
      })
    } finally {
      setCheckingData(false)
    }
  }, [toast])

  const retryDataLoad = () => {
    if (user) {
      checkUserData(user)
    }
  }

  // useCallback must be called unconditionally (before any early returns)
  const handleRefresh = useCallback(async () => {
    if (user) {
      await checkUserData(user);
    }
  }, [user, checkUserData]);

  useEffect(() => {
    if (user && !loading) {
      checkUserData(user)
    }
  }, [user, loading, checkUserData])

  const handleAuthSuccess = async (user: User) => {
    setUser(user)
    setShowAuthModal(false)

    // Sync guest data if available
    if (guestWeightEntries.length > 0) {
      try {
        await syncGuestDataToUser()
        toast({
          title: "Sisäänkirjautuminen onnistui!",
          description: `Tervetuloa takaisin! ${guestWeightEntries.length} mittausta synkronoitu.`,
        })
      } catch (error) {
        toast({
          title: "Sisäänkirjautuminen onnistui!",
          description: "Tervetuloa takaisin! Huom: vanhoja mittauksia ei voitu synkronoida.",
          variant: "destructive"
        })
      }
    } else {
      toast({
        title: "Sisäänkirjautuminen onnistui!",
        description: "Tervetuloa takaisin!",
      })
    }
  }

  const handleSignUpClick = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignInClick = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  if (loading || (user && checkingData)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-terracotta-500 animate-spin" />
        <p className="text-stone-500 font-medium">Ladataan tietoja...</p>
      </div>
    )
  }

  // Show helpful message if authenticated user doesn't have dogs
  if (user && !hasDogs) {
    return (
      <div className="container max-w-md mx-auto px-4 py-12">
        <Card className="border-stone-200 shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-terracotta-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dog className="w-8 h-8 text-terracotta-500" />
            </div>
            <CardTitle className="text-xl font-serif text-stone-900">Ei koiria lisättynä</CardTitle>
            <CardDescription className="text-stone-500">
              Painonseuranta edellyttää koiran profiilin luomista.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Luo koirallesi profiili aloittaaksesi kasvun seurannan. Se vie vain hetken!
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/onboarding')}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white"
              >
                Lisää koira
              </Button>
              <Button
                variant="ghost"
                onClick={retryDataLoad}
                className="w-full text-stone-500 hover:text-stone-900"
              >
                Yritä uudelleen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} className="min-h-screen">
      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      {/* Guest Mode Bar */}
      {isGuest && guestWeightEntries.length > 0 && (
        <div className="mb-6">
          {isMobile ? (
            <GuestModeBarMobile
              onSignUpClick={handleSignUpClick}
              onSignInClick={handleSignInClick}
            />
          ) : (
            <GuestModeBar
              onSignUpClick={handleSignUpClick}
              onSignInClick={handleSignInClick}
            />
          )}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">Painonseuranta</h1>
            <p className="text-stone-500 mt-1">Seuraa koirasi kasvua ja kehitystä</p>
          </div>

          {/* Quick Actions could go here if needed, but keeping it simple for now */}
        </div>

        <ModernPuppyWeightTracker />
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthenticationWrapper
          onAuthSuccess={handleAuthSuccess}
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      </div>
    </PullToRefresh>
  )
}

export default WeightTrackerPage