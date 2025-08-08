import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useToast } from '@/hooks/use-toast'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'

const OnboardingPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate('/weight-tracker')
        return
      }
      setUser(session.user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate('/weight-tracker')
        return
      }
      setUser(session.user)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleOnboardingComplete = () => {
    toast({
      title: "Tervetuloa!",
      description: "Olet valmis käyttämään Pentulaskuria!",
    })
    navigate('/weight-tracker')
  }

  if (loading) {
    return (
      <MobileOptimizedLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <LoadingSpinner size="lg" />
        </div>
      </MobileOptimizedLayout>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <MobileOptimizedLayout>
      <OnboardingWizard user={user} onComplete={handleOnboardingComplete} />
    </MobileOptimizedLayout>
  )
}

export default OnboardingPage