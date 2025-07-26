import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import AuthenticationWrapper from '@/components/AuthenticationWrapper'
import WeightTracker from '@/components/WeightTracker'
import { useToast } from '@/hooks/use-toast'

const WeightTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

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

  const checkForOnboarding = async (user: User) => {
    try {
      // Check if user has any dogs (indicating they've completed onboarding)
      const { data: dogs, error } = await supabase
        .from('dogs')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (error) {
        console.error('Error checking dogs:', error)
        return
      }

      // If no dogs found, redirect to onboarding
      if (!dogs || dogs.length === 0) {
        navigate('/onboarding')
      }
    } catch (error) {
      console.error('Error in checkForOnboarding:', error)
    }
  }

  useEffect(() => {
    if (user && !loading) {
      checkForOnboarding(user)
    }
  }, [user, loading, navigate])

  const handleAuthSuccess = (user: User) => {
    setUser(user)
    toast({
      title: "Sisäänkirjautuminen onnistui!",
      description: "Tervetuloa takaisin!",
    })
  }

  const handleSignOut = () => {
    setUser(null)
    toast({
      title: "Uloskirjautuminen onnistui",
      description: "Nähdään pian!",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Ladataan...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthenticationWrapper onAuthSuccess={handleAuthSuccess} />
  }

  return <WeightTracker user={user} onSignOut={handleSignOut} />
}

export default WeightTrackerPage