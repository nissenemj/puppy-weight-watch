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
import { Scale, TrendingUp, Calculator, Utensils, Bell, RefreshCw, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

interface WeightTrackerProps {
  user: User
  onSignOut: () => void
}

const WeightTracker = ({ user, onSignOut }: WeightTrackerProps) => {
  const [currentWeight, setCurrentWeight] = useState('')
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [activeTab, setActiveTab] = useState('weight-tracking')
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // Pull to refresh hook
  const { containerRef, isRefreshing, pullDistance, shouldShowIndicator } = usePullToRefresh({
    onRefresh: async () => {
      await fetchWeightEntries()
      toast({
        title: "Päivitetty!",
        description: "Tiedot on päivitetty",
      })
    },
    disabled: false
  })

  useEffect(() => {
    fetchWeightEntries()
  }, [user])

  const fetchWeightEntries = async () => {
    const { data, error } = await supabase
      .from('weight_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching weight entries:', error)
      toast({
        title: "Virhe",
        description: "Painotietojen hakeminen epäonnistui",
        variant: "destructive",
      })
    } else if (data) {
      setEntries(data)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setEntries([])
    onSignOut()
  }

  const addWeightEntry = async () => {
    if (!currentWeight || !user) return

    const today = new Date().toISOString().split('T')[0]
    
    // Check if entry for today already exists
    const existingEntry = entries.find(entry => entry.date === today)
    
    const weightData = {
      user_id: user.id,
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
          <HeaderButtons showLogo={true} logoText="Painonseuranta" />
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">Tervetuloa</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Kirjaudu ulos</span>
            </Button>
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

            {/* Weight Entry Form */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl text-foreground flex items-center gap-2">
                  <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  Lisää painomerkintä
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Syötä pennun tämän päivän paino kilogrammoina
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <Label htmlFor="weight" className="text-sm sm:text-base font-medium mb-2 block">Paino (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="esim. 5.2"
                      className="h-12 sm:h-14 text-base sm:text-lg rounded-xl border-2 focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <Button 
                    onClick={addWeightEntry}
                    size="mobile"
                    className="h-12 sm:h-14 px-6 sm:px-8 rounded-xl bg-gradient-cool hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg sm:self-end"
                  >
                    Lisää
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent entries */}
            {entries.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-foreground">Viimeisimmät merkinnät</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {entries.slice(-5).reverse().map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-2 sm:p-3 bg-white/50 rounded-lg">
                        <span className="text-sm sm:text-base text-gray-600">{entry.date}</span>
                        <span className="text-sm sm:text-base font-semibold text-foreground">{entry.weight} kg</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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