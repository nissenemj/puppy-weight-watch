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

  // Show helpful message if user doesn't have required data
  if (!hasDogs || !hasBooks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Painonseuranta edellyttää
          </h2>
          
          {!hasDogs && (
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
          )}
          
          {hasDogs && !hasBooks && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 mb-3">
                📖 Et ole luonut pentukirjaa
              </p>
              <button
                onClick={() => navigate('/puppy-book-landing')}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Luo pentukirja
              </button>
            </div>
          )}
          
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

  return <WeightTracker user={user} onSignOut={handleSignOut} hasBooks={hasBooks} />
}

export default WeightTrackerPage