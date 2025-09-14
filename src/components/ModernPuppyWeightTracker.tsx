import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
import { useIsMobile } from '@/hooks/use-mobile'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeConverters'
import { User } from '@supabase/supabase-js'
import WeightChart from './EnhancedWeightChart'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import PuppyFeeding from './PuppyFeeding'
import SafetyNewsFeed from './SafetyNewsFeed'
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard'
import DogSelector from '@/components/DogSelector'
import WeightEntry from '@/features/weight-tracking/components/WeightEntry'
import GrowthDevelopmentSection from './GrowthDevelopmentSection'
import AchievementSystem from './AchievementSystem'
import { Scale, TrendingUp, Calculator, Utensils, Bell, LogIn, UserPlus, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import the generated assets
import appIcon from '@/assets/app-icon.png'
import welcomeIllustration from '@/assets/welcome-illustration.png'
import heroIllustration from '@/assets/hero-illustration.png'

interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

export default function ModernPuppyWeightTracker() {
  const [currentWeight, setCurrentWeight] = useState('')
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState('weight-tracking')
  const [selectedDog, setSelectedDog] = useState<{ id: string; name: string } | null>(null)
  const [selectedDogBirthDate, setSelectedDogBirthDate] = useState<string | null>(null)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Pull to refresh hook
  const { containerRef, isRefreshing, pullDistance, shouldShowIndicator } = usePullToRefresh({
    onRefresh: async () => {
      if (user) {
        await fetchWeightEntries()
        toast({
          title: "Päivitetty!",
          description: "Tiedot on päivitetty",
        })
      }
    },
    disabled: !user
  })

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      checkForOnboarding()
    }
  }, [user])

  useEffect(() => {
    if (user && selectedDog) {
      fetchWeightEntries()
      fetchDogBirthDate()
    }
  }, [user, selectedDog])

  const checkForOnboarding = async () => {
    if (!user) return
    
    setCheckingOnboarding(true)
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

      // If no dogs found, show onboarding
      if (!dogs || dogs.length === 0) {
        setShowOnboarding(true)
      }
    } catch (error) {
      console.error('Error in checkForOnboarding:', error)
    } finally {
      setCheckingOnboarding(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    fetchWeightEntries() // Refresh data after onboarding
    toast({
      title: "Tervetuloa!",
      description: "Olet valmis käyttämään Pentulaskuria!",
    })
  }

  const fetchWeightEntries = async () => {
    if (!user || !selectedDog) return

    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .eq('dog_id', selectedDog.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching weight entries:', error)
      toast({
        title: "Virhe",
        description: "Painotietojen hakeminen epäonnistui",
        variant: "destructive",
      })
    } else if (data) {
      setEntries(dbToAppTypes.dogFood(data))
    }
  }

  const fetchDogBirthDate = async () => {
    if (!user || !selectedDog) return

    const { data, error } = await supabase
      .from('puppy_books')
      .select('birth_date')
      .eq('owner_id', user.id)
      .eq('dog_id', selectedDog.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching birth date:', error)
      setSelectedDogBirthDate(null)
    } else if (data?.birth_date) {
      setSelectedDogBirthDate(data.birth_date)
    } else {
      setSelectedDogBirthDate(null)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast({
          title: "Sisäänkirjautuminen onnistui!",
          description: "Tervetuloa takaisin!",
        })
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        })
        if (error) throw error
        toast({
          title: "Rekisteröityminen onnistui!",
          description: "Tarkista sähköpostisi vahvistuslinkin saamiseksi.",
        })
      }
    } catch (error: any) {
      toast({
        title: "Virhe",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setEntries([])
    toast({
      title: "Uloskirjautuminen onnistui",
      description: "Nähdään pian!",
    })
  }

  const addWeightEntry = async () => {
    if (!currentWeight || !user) return

    const today = new Date().toISOString().split('T')[0]
    
    // Check if entry for today already exists
    const existingEntry = entries.find(entry => entry.date === today)
    
    // Check if dog is selected
    if (!selectedDog) {
      toast({
        title: "Valitse koira",
        description: "Valitse ensin koira painon lisäämiseen",
        variant: "destructive",
      })
      return
    }

    const weightData = {
      user_id: user.id,
      dog_id: selectedDog.id,
      date: today,
      weight: parseFloat(currentWeight),
    }

    if (existingEntry) {
      // Update existing entry
      const { error } = await supabase
        .from('weight_entries')
        .update({ weight: parseFloat(currentWeight) })
        .eq('id', existingEntry.id)

      if (error) {
        console.error('Error updating weight entry:', error)
        toast({
          title: "Virhe",
          description: "Painon päivittäminen epäonnistui",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Paino päivitetty!",
          description: `Tämän päivän paino päivitetty: ${currentWeight} kg`,
        })
        fetchWeightEntries()
      }
    } else {
      // Add new entry
      const { error } = await supabase
        .from('weight_entries')
        .insert([weightData])

      if (error) {
        console.error('Error inserting weight entry:', error)
        toast({
          title: "Virhe",
          description: "Painon lisääminen epäonnistui",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Paino lisätty!",
          description: `Uusi painomerkintä: ${currentWeight} kg`,
        })
        fetchWeightEntries()
      }
    }
    
    setCurrentWeight('')
  }

  const getLatestWeight = () => {
    if (entries.length === 0) return 0
    return entries[entries.length - 1].weight
  }

  const getWeightChange = () => {
    if (entries.length < 2) return null
    const latest = entries[entries.length - 1].weight
    const previous = entries[entries.length - 2].weight
    return latest - previous
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warm rounded-full blur-3xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-cool rounded-full blur-3xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-sm sm:max-w-md mx-auto pt-16 sm:pt-20 px-4">
          {/* Welcome illustration - Mobile Responsive */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <img 
              src={welcomeIllustration} 
              alt="Tervetuloa" 
              className="w-48 h-36 sm:w-64 sm:h-48 mx-auto mb-4 object-contain max-w-full"
            />
          </div>

          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-scale-in">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src={appIcon} alt="Pentulaskuri" className="w-12 h-12 rounded-2xl shadow-lg" />
                <CardTitle className="text-3xl text-foreground font-semibold">
                  Pentulaskuri
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Kirjaudu sisään seurataksesi pentusi kasvua ja ruokintaa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base font-medium">Sähköposti</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-base font-medium">Salasana</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="mobile"
                  className="w-full rounded-xl bg-gradient-warm hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg" 
                  disabled={loading}
                >
                  {loading ? 'Odota...' : isLogin ? (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Kirjaudu sisään
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Rekisteröidy
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-base rounded-xl border-2 hover:bg-secondary transition-all duration-200"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Luo uusi tili' : 'Kirjaudu sisään olemassa olevalla tilillä'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    )
  }

  // Show onboarding for new users
  if (showOnboarding && user) {
    return <OnboardingWizard user={user} onComplete={handleOnboardingComplete} />
  }

  // Show loading state while checking for onboarding
  if (checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Ladataan...</p>
        </div>
      </div>
    )
  }

  const handleTabSwipe = (direction: 'left' | 'right') => {
    const tabs = ['weight-tracking', 'growth-chart', 'puppy-feeding', 'news-feed']
    const currentIndex = tabs.indexOf(activeTab)
    
    if (direction === 'left' && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    } else if (direction === 'right' && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  return (
      <div 
        ref={containerRef}
        className="min-h-screen bg-gradient-primary relative"
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.min(pullDistance * 0.5, 40)}px)` : 'none',
          transition: shouldShowIndicator ? 'none' : 'transform 0.2s ease-out',
          scrollbarGutter: 'stable'
        }}
      >
        {/* Pull to refresh indicator */}
        {shouldShowIndicator && (
          <div 
            className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-white/80 backdrop-blur-sm z-50"
            style={{
              opacity: Math.min(pullDistance / 80, 1),
              transform: `translateY(${-40 + Math.min(pullDistance * 0.5, 40)}px)`
            }}
          >
            <RefreshCw 
              className={`h-6 w-6 text-primary ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span className="ml-2 text-sm text-gray-600">
              {isRefreshing ? 'Päivitetään...' : pullDistance > 80 ? 'Päästä päivittääksesi' : 'Vedä alas päivittääksesi'}
            </span>
          </div>
        )}
        
        <div className="container mx-auto p-3 sm:p-4 max-w-full overflow-x-hidden">
          {/* Dog Selector */}
          <div className="mb-6">
            <DogSelector 
              user={user} 
              selectedDogId={selectedDog?.id} 
              onDogSelect={(dogId, dog) => setSelectedDog(dog)} 
            />
          </div>

        {/* Weight Entry Section - Always Visible */}
        {selectedDog && (
          <div className="mb-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl animate-scale-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Scale className="h-6 w-6 text-primary" />
                  Lisää painomittaus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Label htmlFor="current-weight" className="text-base font-medium mb-2 block">
                      Paino (kg)
                    </Label>
                    <Input
                      id="current-weight"
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="Esim. 2.5"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={addWeightEntry}
                      disabled={!currentWeight}
                      size="mobile"
                      className="w-full sm:w-auto h-12 rounded-xl bg-gradient-warm hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      Lisää paino
                    </Button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-gray-600">Viimeisin paino</p>
                    <p className="text-xl font-bold text-foreground">{getLatestWeight()} kg</p>
                  </div>
                  <div className="text-center p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-gray-600">Muutos</p>
                    <p className={`text-xl font-bold ${getWeightChange() && getWeightChange()! > 0 ? 'text-green-600' : getWeightChange() && getWeightChange()! < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {getWeightChange() ? (getWeightChange()! > 0 ? '+' : '') + getWeightChange()!.toFixed(1) + ' kg' : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} onSwipe={handleTabSwipe} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-16 md:h-14 rounded-2xl bg-white/50 backdrop-blur-sm overflow-x-auto">
            <TabsTrigger 
              value="weight-tracking" 
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-xl transition-all duration-200 hover:scale-105 px-2 sm:px-4 text-white font-medium",
                activeTab === "weight-tracking" ? "bg-gradient-cool !important" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Scale className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Paino</span>
            </TabsTrigger>
            <TabsTrigger 
              value="growth-chart" 
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-xl transition-all duration-200 hover:scale-105 px-2 sm:px-4 text-white font-medium",
                activeTab === "growth-chart" ? "bg-gradient-purple !important" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Kasvu</span>
            </TabsTrigger>
            <TabsTrigger 
              value="puppy-feeding" 
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-xl transition-all duration-200 hover:scale-105 px-2 sm:px-4 text-white font-medium",
                activeTab === "puppy-feeding" ? "bg-gradient-warm !important" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Utensils className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Ruokinta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="news-feed" 
              className={cn(
                "flex flex-col sm:flex-row items-center gap-1 sm:gap-2 rounded-xl transition-all duration-200 hover:scale-105 px-2 sm:px-4 text-white font-medium",
                activeTab === "news-feed" ? "bg-gradient-purple !important" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bell className="h-5 w-5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Uutiset</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight-tracking" className="space-y-6 animate-fade-in">
            {selectedDog ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 hover-3d">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-3 sm:p-4 bg-gradient-cool rounded-full text-white shadow-lg">
                          <Scale className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Nykyinen paino</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {getLatestWeight().toFixed(1)} kg
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 hover-3d">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-3 sm:p-4 bg-gradient-purple rounded-full text-white shadow-lg">
                          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Painon muutos</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {getWeightChange() !== null ? `${getWeightChange()! > 0 ? '+' : ''}${getWeightChange()!.toFixed(1)} kg` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border-0 hover-3d">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-3 sm:p-4 bg-gradient-warm rounded-full text-white shadow-lg">
                          <Calculator className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-600 font-medium">Mittauksia</p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {entries.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Weight Chart */}
                <WeightChart weightData={entries} />

                {/* Achievement System */}
                <AchievementSystem 
                  weightData={entries}
                  onCelebration={() => {
                    toast({
                      title: "🎉 Uusi saavutus avattu!",
                      description: "Hienoa työtä painonseurannassa!",
                    })
                  }}
                />
              </>
            ) : (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardContent className="text-center py-12">
                  <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Valitse koira</h3>
                  <p className="text-gray-500">Valitse ensin koira aloittaaksesi painonseurannan</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="growth-chart" className="animate-fade-in">
            <GrowthDevelopmentSection 
              weightData={entries}
              birthDate={selectedDogBirthDate || undefined}
            />
          </TabsContent>

          <TabsContent value="puppy-feeding" className="animate-fade-in">
            <AdvancedFoodCalculator currentWeight={getLatestWeight()} user={user} />
          </TabsContent>

          <TabsContent value="news-feed" className="animate-fade-in">
            <SafetyNewsFeed />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  )
}
