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
import { User } from '@supabase/supabase-js'
import WeightChart from './WeightChart'
import FoodCalculator from './FoodCalculator'
import PuppyFeeding from './PuppyFeeding'
import SafetyNewsFeed from './SafetyNewsFeed'
import HeaderButtons from './HeaderButtons'
import DogSelector from './DogSelector'
import WeightEntryForm from './WeightEntryForm'
import WeightEntryList from './WeightEntryList'
import { useWeightEntries } from '@/hooks/useWeightEntries'
import { Scale, TrendingUp, Calculator, Utensils, Bell, RefreshCw, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Dog {
  id: string
  name: string
  breed?: string
  weight_kg?: number
  age_years?: number
  activity_level?: string
  health_conditions?: string[]
}

interface WeightTrackerProps {
  user: User
  onSignOut: () => void
}

const WeightTracker = ({ user, onSignOut }: WeightTrackerProps) => {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [activeTab, setActiveTab] = useState('weight-tracking')
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Get weight entries for selected dog
  const { data: entries = [], refetch: refetchEntries } = useWeightEntries(
    user.id, 
    selectedDog?.id
  )

  // Pull to refresh hook
  const { containerRef, isRefreshing, pullDistance, shouldShowIndicator } = usePullToRefresh({
    onRefresh: async () => {
      await refetchEntries()
      toast({
        title: "Päivitetty!",
        description: "Tiedot on päivitetty",
      })
    },
    disabled: false
  })

  const handleDogSelect = (dogId: string, dog: Dog) => {
    setSelectedDog(dog)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    onSignOut()
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
      className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50 relative"
    >
      {/* Navigation Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <HeaderButtons 
            showLogo={true} 
            logoText="Painonseuranta"
          />
          
          <div className="flex items-center gap-4">
            <DogSelector
              user={user}
              selectedDogId={selectedDog?.id}
              onDogSelect={handleDogSelect}
            />
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Tervetuloa</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      <div 
        ref={containerRef}
        className="relative"
        style={{
          transform: shouldShowIndicator ? `translateY(${Math.min(pullDistance * 0.5, 40)}px)` : 'none',
          transition: shouldShowIndicator ? 'none' : 'transform 0.2s ease-out'
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
            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-blue-600 mb-2">Nykyinen paino</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-800">{getLatestWeight()} kg</p>
                    </div>
                    <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-green-600 mb-2">Muutos</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-800">
                        {getWeightChange() !== null ? `${getWeightChange()! > 0 ? '+' : ''}${getWeightChange()!.toFixed(1)} kg` : 'Ei dataa'}
                      </p>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Merkintöjä</p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-800">{entries.length}</p>
                    </div>
                    <Badge variant="secondary" className="text-purple-600 bg-purple-100">{entries.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weight Entry Form and List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedDog ? (
                <WeightEntryForm 
                  userId={user.id} 
                  dogId={selectedDog.id}
                  previousWeights={entries} 
                />
              ) : (
                <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Valitse ensin koira lisätäksesi painomerkintöjä</p>
                  </CardContent>
                </Card>
              )}
              
              {selectedDog && entries.length > 0 && (
                <WeightEntryList 
                  entries={entries} 
                  userId={user.id} 
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="growth-chart" className="animate-fade-in">
            <WeightChart weightData={entries} />
          </TabsContent>

          <TabsContent value="puppy-feeding" className="animate-fade-in">
            <div className="space-y-6">
              <FoodCalculator currentWeight={getLatestWeight()} user={user} />
              <PuppyFeeding />
            </div>
          </TabsContent>

          <TabsContent value="news-feed" className="animate-fade-in">
            <SafetyNewsFeed />
          </TabsContent>
        </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default WeightTracker