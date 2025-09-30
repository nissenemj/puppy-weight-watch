import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthenticationWrapper from '@/components/AuthenticationWrapper'
import ModernPuppyWeightTracker from '@/components/ModernPuppyWeightTracker'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import LayoutWithNavigation from '@/components/ui/layout-with-navigation'
import { useGuestAuth } from '@/contexts/GuestAuthContext'
import GuestModeBar, { GuestModeBarMobile } from '@/components/GuestModeBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout, Container, Section } from '@/components/ui/Layout'
import { Dog, RefreshCw, Plus, User as UserIcon, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

const WeightTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')
  const navigate = useNavigate()
  const location = useLocation()
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

  const [hasBooks, setHasBooks] = useState(false)
  const [hasDogs, setHasDogs] = useState(false)
  const [checkingData, setCheckingData] = useState(true)

  const checkUserData = async (user: User) => {
    try {
      setCheckingData(true)
      
      // Check if user has puppy books
      const { data: books, error: booksError } = await supabase
        .from('puppy_books')
        .select('id, dog_id')
        .eq('owner_id', user.id)
        .limit(1)

      if (booksError) {
        console.error('Error checking puppy books:', booksError)
        toast({
          title: "Virhe tietojen haussa",
          description: "Pentukirjojen tarkistaminen epäonnistui",
          variant: "destructive"
        })
      } else {
        setHasBooks(books && books.length > 0)
      }

      // Check if user has any dogs
      const { data: dogs, error: dogsError } = await supabase
        .from('dogs')
        .select('id')
        .eq('user_id', user.id)
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
        
        // Remove automatic redirect - let user choose what to do
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
  }

  const retryDataLoad = () => {
    if (user) {
      checkUserData(user)
    }
  }

  useEffect(() => {
    if (user && !loading) {
      checkUserData(user)
    }
  }, [user, loading, navigate])

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

  const handleSignOut = () => {
    setUser(null)
    toast({
      title: "Uloskirjautuminen onnistui",
      description: "Nähdään pian!",
    })
  }

  const handleSignUpClick = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignInClick = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  if (loading) {
    return (
      <PageLayout variant="default">
        <Section className="min-h-screen flex items-center justify-center">
          <Container size="sm" padding="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <div className="w-16 h-16 border-4 border-[var(--color-accent-200)] border-t-[var(--color-accent)] rounded-full"></div>
              </motion.div>
              <p className="text-body-lg text-muted">Ladataan...</p>
            </motion.div>
          </Container>
        </Section>
      </PageLayout>
    )
  }

  // Guest mode: Allow access without authentication
  // Show weight tracker with guest mode UI

  // Only show loading for authenticated users
  if (user && checkingData) {
    return (
      <PageLayout variant="default">
        <Section className="min-h-screen flex items-center justify-center">
          <Container size="sm" padding="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-6"
              >
                <div className="w-16 h-16 border-4 border-[var(--color-accent-200)] border-t-[var(--color-accent)] rounded-full"></div>
              </motion.div>
              <p className="text-body-lg text-muted">Tarkistetaan tietoja...</p>
            </motion.div>
          </Container>
        </Section>
      </PageLayout>
    )
  }

  // Show helpful message if authenticated user doesn't have dogs
  if (user && !hasDogs) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4 mobile-text-wrap mobile-container-safe">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center mobile-card-safe">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Painonseuranta edellyttää koiran lisäämistä
          </h2>

          <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 mb-3">
              🐕 Sinulla ei ole vielä koiria lisättynä
            </p>
            <button
              onClick={() => navigate('/onboarding')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
            >
              Lisää koira
            </button>
          </div>

          <div className="mt-4 pt-4 border-t">
            <button
              onClick={retryDataLoad}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Yritä uudelleen
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Custom quick actions for weight tracker
  const weightTrackerQuickActions = [
    {
      id: "add-health-record",
      label: "Terveysmerkintä",
      description: "Lisää terveystietoja",
      icon: <UserIcon className="w-4 h-4" />,
      action: () => navigate('/puppy-book?tab=health'),
      color: "success" as const
    }
  ];

  return (
    <MobileOptimizedLayout>
      <LayoutWithNavigation
        showBreadcrumbs={true}
        stickyNavigation={true}
        showQuickActions={true}
        quickActionsVariant="floating"
        customQuickActions={weightTrackerQuickActions}
      >
        {/* Show guest mode bar for non-authenticated users */}
        {isGuest && guestWeightEntries.length > 0 && (
          <>
            {isMobile ? (
              <GuestModeBarMobile
                onSignUpClick={handleSignUpClick}
                onSignInClick={handleSignInClick}
              />
            ) : (
              <div className="px-4 py-2">
                <GuestModeBar
                  onSignUpClick={handleSignUpClick}
                  onSignInClick={handleSignInClick}
                />
              </div>
            )}
          </>
        )}

        <ModernPuppyWeightTracker />

        {/* Auth Modal */}
        {showAuthModal && (
          <AuthenticationWrapper
            onAuthSuccess={handleAuthSuccess}
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </LayoutWithNavigation>
    </MobileOptimizedLayout>
  )
}

export default WeightTrackerPage