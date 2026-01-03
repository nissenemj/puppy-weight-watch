import { useState, useEffect, useCallback } from 'react'
import { SkeletonMobileCard } from '@/components/ui/skeleton'
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
import { dbToAppTypes } from '@/utils/typeUtils'
import { User } from '@supabase/supabase-js'
import { useGuestAuth } from '@/contexts/GuestAuthContext'
import WeightChart from './EnhancedWeightChart'
import GrowthChart from './PuppyBook/GrowthChart'
import type { SizeClass } from '@/types/veterinary'
import AdvancedFoodCalculator from './AdvancedFoodCalculator'
import PuppyFeeding from './PuppyFeeding'
import SafetyNewsFeed from './SafetyNewsFeed'
import OnboardingWizard from '@/features/onboarding/components/OnboardingWizard'
import DogSelector from '@/components/DogSelector'
import WeightEntry from '@/features/weight-tracking/components/WeightEntry'
import GrowthDevelopmentSection from './GrowthDevelopmentSection'
import AchievementSystem from './AchievementSystem'
import AuthModal from './AuthModal'
import { Scale, TrendingUp, Calculator, Utensils, Bell, RefreshCw, Calendar } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { fi } from 'date-fns/locale'
import { cn } from '@/lib/utils'

// Import the generated assets (used in AuthModal)
import heroIllustration from '@/assets/hero-3d.png'
import emptyStateIllustration from '@/assets/empty-state-3d.png'

interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

interface WeightPoint {
  age_weeks: number
  weight_kg: number
  date: string
}

export default function ModernPuppyWeightTracker() {
  const [currentWeight, setCurrentWeight] = useState('')
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [isLogin, setIsLogin] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(false)
  const [activeTab, setActiveTab] = useState('weight-tracking')
  const [selectedDog, setSelectedDog] = useState<{ id: string; name: string; breed?: string } | null>(null)
  const [selectedDogBirthDate, setSelectedDogBirthDate] = useState<string | null>(null)
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Guest auth context
  const {
    user,
    isGuest,
    guestWeightEntries,
    guestDogProfile,
    addGuestWeightEntry,
    updateGuestDogProfile,
    signInWithEmail,
    signUpWithEmail,
    syncGuestDataToUser
  } = useGuestAuth()

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
    disabled: false // Allow refresh for both authenticated and guest users
  })

  // Load guest data when in guest mode
  useEffect(() => {
    if (isGuest && guestWeightEntries.length > 0) {
      // Convert guest entries to chart format
      const convertedEntries = guestWeightEntries.map((entry: any) => ({
        id: entry.id,
        user_id: 'guest',
        date: entry.date,
        weight: entry.weight,
        created_at: entry.created_at
      }))
      setEntries(convertedEntries)

      // Set guest dog profile if available
      if (guestDogProfile && !selectedDog) {
        setSelectedDog({
          id: 'guest-dog',
          name: guestDogProfile.name || 'Pentuni'
        })
      }
    }
  }, [isGuest, guestWeightEntries, guestDogProfile, selectedDog])

  const checkForOnboarding = useCallback(async () => {
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
  }, [user])

  const fetchWeightEntries = useCallback(async () => {
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
      setEntries(dbToAppTypes.dogFood(data) as WeightEntry[])
    }
  }, [user, selectedDog, toast])

  const fetchDogBirthDate = useCallback(async () => {
    if (!user || !selectedDog) return

    const { data, error } = await supabase
      .from('puppy_books')
      .select('birth_date')
      .eq('owner_id', user.id)
      .eq('puppy_id', selectedDog.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching birth date:', error)
      setSelectedDogBirthDate(null)
    } else if (data?.birth_date) {
      setSelectedDogBirthDate(data.birth_date)
    } else {
      setSelectedDogBirthDate(null)
    }
  }, [user, selectedDog])

  useEffect(() => {
    if (user) {
      checkForOnboarding()
    }
  }, [user, checkForOnboarding])

  useEffect(() => {
    if (user && selectedDog) {
      fetchWeightEntries()
      fetchDogBirthDate()
    }
  }, [user, selectedDog, fetchWeightEntries, fetchDogBirthDate])

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    fetchWeightEntries() // Refresh data after onboarding
    toast({
      title: "Tervetuloa!",
      description: "Olet valmis käyttämään Pentulaskuria!",
    })
  }


  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setEntries([])
    setSelectedDog(null)
    toast({
      title: "Uloskirjautuminen onnistui",
      description: "Nähdään pian!",
    })
  }

  const addWeightEntry = async () => {
    if (!currentWeight) return

    const weight = parseFloat(currentWeight)
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Virheellinen paino",
        description: "Anna kelvollinen painon arvo",
        variant: "destructive",
      })
      return
    }

    if (isGuest) {
      // Guest mode: save to localStorage
      addGuestWeightEntry(weight)

      // Update guest dog profile if not set
      if (!guestDogProfile) {
        updateGuestDogProfile({
          name: 'Pentuni',
          breed: undefined,
          birthDate: undefined,
          gender: undefined
        })
      }

      toast({
        title: "Paino lisätty!",
        description: `Uusi painomerkintä: ${currentWeight} kg (väliaikainen tallentus)`,
      })
      setCurrentWeight('')
      return
    }

    // Authenticated user: save to database
    if (!user || !selectedDog) {
      toast({
        title: "Valitse koira",
        description: "Valitse ensin koira painon lisäämiseen",
        variant: "destructive",
      })
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const existingEntry = entries.find(entry => entry.date === today)

    const weightData = {
      user_id: user.id,
      dog_id: selectedDog.id,
      date: today,
      weight: weight,
    }

    if (existingEntry) {
      // Update existing entry
      const { error } = await supabase
        .from('weight_entries')
        .update({ weight: weight })
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

  const saveBirthDate = async () => {
    if (!birthDate || !user || !selectedDog) return

    const birthDateString = birthDate.toISOString().split('T')[0]

    try {
      // Check if puppy_books entry exists for this dog
      const { data: existingBook, error: checkError } = await supabase
        .from('puppy_books')
        .select('id')
        .eq('owner_id', user.id)
        .eq('puppy_id', selectedDog.id)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingBook) {
        // Update existing puppy book
        const { error: updateError } = await supabase
          .from('puppy_books')
          .update({ birth_date: birthDateString })
          .eq('id', existingBook.id)

        if (updateError) throw updateError
      } else {
        // Create new puppy book
        const { error: insertError } = await supabase
          .from('puppy_books')
          .insert({
            owner_id: user.id,
            puppy_id: selectedDog.id,
            birth_date: birthDateString
          })

        if (insertError) throw insertError
      }

      // Update local state
      setSelectedDogBirthDate(birthDateString)
      setShowBirthDatePicker(false)

      toast({
        title: "Syntymäpäivä tallennettu!",
        description: `${selectedDog.name}:n syntymäpäivä on nyt ${format(birthDate, 'dd.MM.yyyy', { locale: fi })}`
      })
    } catch (error) {
      console.error('Error saving birth date:', error)
      toast({
        title: "Virhe",
        description: "Syntymäpäivän tallentaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  // Convert weight entries to GrowthChart format
  const convertToWeightPoints = (entries: WeightEntry[], birthDate: string | null): WeightPoint[] => {
    if (!birthDate) return []

    const birthDateObj = new Date(birthDate)
    return entries.map(entry => {
      const entryDate = new Date(entry.date)
      const ageInWeeks = Math.floor((entryDate.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 7))

      return {
        age_weeks: Math.max(0, ageInWeeks),
        weight_kg: entry.weight,
        date: entry.date
      }
    }).sort((a, b) => a.age_weeks - b.age_weeks)
  }

  // Determine size class based on breed or current weight
  const determineSizeClass = (): SizeClass => {
    if (!selectedDog?.breed) {
      // Default to medium if no breed specified
      return 'medium'
    }

    const breed = selectedDog.breed.toLowerCase()

    // Toy/Small breeds (up to 10kg)
    if (breed.includes('chihuahua') || breed.includes('yorkshire') ||
      breed.includes('pomeranian') || breed.includes('maltese') ||
      breed.includes('toy') || breed.includes('mini')) {
      return 'toy_small'
    }

    // Large/Giant breeds (25kg+)
    if (breed.includes('labrador') || breed.includes('retriever') ||
      breed.includes('saksanpaimenkoira') || breed.includes('rottweiler') ||
      breed.includes('mastiff') || breed.includes('saint bernard') ||
      breed.includes('great dane') || breed.includes('leonberger')) {
      return 'large_giant'
    }

    // Medium breeds (default)
    return 'medium'
  }

  if (!user && !isGuest) {
    return (
      <AuthModal
        isOpen={true}
        mode={isLogin ? 'signin' : 'signup'}
        onModeChange={(mode) => setIsLogin(mode === 'signin')}
        onAuthSuccess={() => { }} // Auth state will be handled by GuestAuthContext
        fullScreen={true}
      />
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

      <div className="w-full mx-auto p-3 sm:p-4 max-w-full overflow-x-hidden">
        {/* Dog Selector */}
        {user && (
          <div className="mb-6">
            <DogSelector
              user={user}
              selectedDogId={selectedDog?.id}
              onDogSelect={(dogId, dog) => {
                // Handle dog deletion - if no dogId, set selectedDog to null
                if (dogId && dog?.id) {
                  setSelectedDog(dog)
                } else {
                  setSelectedDog(null)
                }
              }}
            />
          </div>
        )}

        {/* Weight Entry Section - Always Visible */}
        {(selectedDog || isGuest) && (
          <div className="mb-6">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl animate-scale-in">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Scale className="h-6 w-6 text-primary" />
                  Lisää painomittaus {isGuest && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 ml-2">
                      Väliaikainen
                    </Badge>
                  )}
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
            {(selectedDog || isGuest) ? (
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

                {/* Growth Chart with Centiles */}
                {selectedDogBirthDate && entries.length > 0 ? (
                  <GrowthChart
                    weightPoints={convertToWeightPoints(entries, selectedDogBirthDate)}
                    initialSizeClass={determineSizeClass()}
                  />
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                    <CardContent className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Kasvukäyrä ei saatavilla
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {!selectedDogBirthDate
                          ? 'Aseta pennun syntymäpäivä nähdäksesi kasvukäyrän centile-viivoilla'
                          : 'Lisää painomittauksia nähdäksesi kasvukäyrän'}
                      </p>

                      {!selectedDogBirthDate && user && selectedDog && (
                        <Popover open={showBirthDatePicker} onOpenChange={setShowBirthDatePicker}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              <Calendar className="h-4 w-4" />
                              Aseta syntymäpäivä
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white shadow-xl border-2" align="center">
                            <CalendarComponent
                              mode="single"
                              selected={birthDate}
                              onSelect={(date) => setBirthDate(date)}
                              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                              locale={fi}
                            />
                            <div className="p-3 border-t flex gap-2">
                              <Button
                                onClick={saveBirthDate}
                                disabled={!birthDate}
                                className="flex-1"
                                size="sm"
                              >
                                Tallenna
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setShowBirthDatePicker(false)
                                  setBirthDate(undefined)
                                }}
                                className="flex-1"
                                size="sm"
                              >
                                Peruuta
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </CardContent>
                  </Card>
                )}

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
                  <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                    {isGuest ? 'Aloita painonseuranta' : 'Valitse koira'}
                  </h3>
                  <p className="text-gray-500">
                    {isGuest
                      ? 'Lisää ensimmäinen painomittaus pentullesi'
                      : 'Valitse ensin koira aloittaaksesi painonseurannan'
                    }
                  </p>
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
            {user ? (
              <AdvancedFoodCalculator currentWeight={getLatestWeight()} user={user} />
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-600">Kirjaudu sisään käyttääksesi ruokalaskuria</p>
              </div>
            )}
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
