import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'
import WeightChart from './WeightChart'
import FoodCalculator from './FoodCalculator'
import PuppyFeeding from './PuppyFeeding'
import SafetyNewsFeed from './SafetyNewsFeed'
import { Scale, TrendingUp, Calculator, Utensils, Bell, LogIn, UserPlus } from 'lucide-react'

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
  const { toast } = useToast()

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
      fetchWeightEntries()
    }
  }, [user])

  const fetchWeightEntries = async () => {
    if (!user) return

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-warm rounded-full blur-3xl opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-cool rounded-full blur-3xl opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-md mx-auto pt-20">
          {/* Welcome illustration */}
          <div className="text-center mb-8 animate-fade-in">
            <img 
              src={welcomeIllustration} 
              alt="Tervetuloa" 
              className="w-64 h-48 mx-auto mb-4 object-contain"
            />
          </div>

          <Card className="backdrop-blur-sm bg-white/80 shadow-2xl border-0 animate-scale-in">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img src={appIcon} alt="Pentulaskuri" className="w-12 h-12 rounded-2xl shadow-lg" />
                <CardTitle className="text-3xl bg-gradient-warm bg-clip-text text-transparent">
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
                  className="w-full h-12 text-base rounded-xl bg-gradient-warm hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg" 
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-25 to-purple-50">
      <div className="container mx-auto p-4">
        {/* Modern Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <img src={appIcon} alt="Pentulaskuri" className="w-16 h-16 rounded-3xl shadow-lg animate-bounce-gentle" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Pentulaskuri
              </h1>
              <p className="text-gray-600 text-lg">Seuraa pentusi kasvua ja ruokintaa</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 bg-white/50 px-3 py-2 rounded-lg backdrop-blur-sm">
              {user.email}
            </span>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="rounded-xl hover:scale-105 transition-all duration-200"
            >
              Kirjaudu ulos
            </Button>
          </div>
        </div>

        <Tabs defaultValue="weight-tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-14 rounded-2xl bg-white/50 backdrop-blur-sm">
            <TabsTrigger 
              value="weight-tracking" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-cool data-[state=active]:text-white transition-all duration-200 hover:scale-105"
            >
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">Painonseuranta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="growth-chart" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white transition-all duration-200 hover:scale-105"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Kasvukäyrä</span>
            </TabsTrigger>
            <TabsTrigger 
              value="food-calculator" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-primary data-[state=active]:text-white transition-all duration-200 hover:scale-105"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Ruokamäärät</span>
            </TabsTrigger>
            <TabsTrigger 
              value="puppy-feeding" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-warm data-[state=active]:text-white transition-all duration-200 hover:scale-105"
            >
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Penturuokinta</span>
            </TabsTrigger>
            <TabsTrigger 
              value="news-feed" 
              className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-purple data-[state=active]:text-white transition-all duration-200 hover:scale-105"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Uutiset</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight-tracking" className="space-y-6 animate-fade-in">
            {/* Modern Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-cool text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Nykyinen paino</CardTitle>
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Scale className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{getLatestWeight().toFixed(1)} kg</div>
                  <p className="text-xs text-white/70 mt-1">
                    Viimeisin mittaus
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-purple text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Painon muutos</CardTitle>
                  <div className="p-2 bg-white/20 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getWeightChange() !== null ? (
                      <>
                        {getWeightChange()! > 0 ? '+' : ''}{getWeightChange()!.toFixed(1)} kg
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <p className="text-xs text-white/70 mt-1">
                    Edellisestä mittauksesta
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-warm text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white/90">Mittauksia</CardTitle>
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {entries.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{entries.length}</div>
                  <p className="text-xs text-white/70 mt-1">
                    Painomittauksia yhteensä
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weight Entry Form */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Lisää painomittaus</CardTitle>
                <CardDescription className="text-base">
                  Syötä pentusi tämänhetkinen paino kilogrammoina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="weight" className="text-base font-medium">Paino (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="esim. 3.2"
                      className="h-12 text-base rounded-xl border-2 focus:border-primary focus:ring-primary mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={addWeightEntry} 
                      disabled={!currentWeight}
                      className="h-12 px-6 rounded-xl bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      Lisää mittaus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            {entries.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl">Viimeisimmät mittaukset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entries.slice(-5).reverse().map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-xl hover:scale-105 transition-all duration-200">
                        <span className="font-medium text-gray-700">
                          {new Date(entry.date).toLocaleDateString('fi-FI')}
                        </span>
                        <Badge variant="outline" className="bg-white border-primary text-primary font-semibold px-3 py-1">
                          {entry.weight} kg
                        </Badge>
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

          <TabsContent value="food-calculator" className="animate-fade-in">
            <FoodCalculator currentWeight={getLatestWeight()} user={user} />
          </TabsContent>

          <TabsContent value="puppy-feeding" className="animate-fade-in">
            <PuppyFeeding />
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