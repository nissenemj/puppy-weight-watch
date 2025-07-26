import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate, useLocation } from 'react-router-dom'
import AuthenticationWrapper from '@/components/AuthenticationWrapper'
import WeightTracker from '@/components/WeightTracker'
import { useToast } from '@/hooks/use-toast'

const WeightTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
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
        
        // Only redirect to onboarding if no dogs at all
        if (!dogsExist) {
          navigate('/onboarding')
        }
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

  useEffect(() => {
    if (user && !loading) {
      checkUserData(user)
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

  if (checkingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Tarkistetaan tietoja...</p>
        </div>
      </div>
    )
  }

  return <WeightTracker user={user} onSignOut={handleSignOut} hasBooks={hasBooks} />
}

export default WeightTrackerPage