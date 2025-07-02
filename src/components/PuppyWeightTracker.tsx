
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
import { Scale, TrendingUp, Calculator, Utensils, LogIn, UserPlus } from 'lucide-react'

interface WeightEntry {
  id: string
  date: string
  weight: number
  created_at?: string
}

export default function PuppyWeightTracker() {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-20">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">🐕 Pentujen kasvuseurin</CardTitle>
              <CardDescription>
                Kirjaudu sisään seurataksesi pentusi kasvua ja ruokintaa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Sähköposti</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Salasana</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Odota...' : isLogin ? (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Kirjaudu sisään
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Rekisteröidy
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🐕 Pentujen kasvuseurin</h1>
            <p className="text-gray-600">Seuraa pentusi kasvua ja ruokintaa</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Kirjautunut: {user.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Kirjaudu ulos
            </Button>
          </div>
        </div>

        <Tabs defaultValue="weight-tracking" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weight-tracking" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Painonseuranta
            </TabsTrigger>
            <TabsTrigger value="growth-chart" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Kasvukäyrä
            </TabsTrigger>
            <TabsTrigger value="food-calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Ruokamäärät
            </TabsTrigger>
            <TabsTrigger value="puppy-feeding" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Penturuokinta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight-tracking" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nykyinen paino</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getLatestWeight().toFixed(1)} kg</div>
                  <p className="text-xs text-muted-foreground">
                    Viimeisin mittaus
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Painon muutos</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {getWeightChange() !== null ? (
                      <>
                        {getWeightChange()! > 0 ? '+' : ''}{getWeightChange()!.toFixed(1)} kg
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Edellisestä mittauksesta
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mittauksia</CardTitle>
                  <Badge variant="secondary">{entries.length}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Painomittauksia yhteensä
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Weight Entry Form */}
            <Card>
              <CardHeader>
                <CardTitle>Lisää painomittaus</CardTitle>
                <CardDescription>
                  Syötä pentusi tämänhetkinen paino kilogrammoina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="weight">Paino (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={currentWeight}
                      onChange={(e) => setCurrentWeight(e.target.value)}
                      placeholder="esim. 3.2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addWeightEntry} disabled={!currentWeight}>
                      Lisää mittaus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            {entries.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Viimeisimmät mittaukset</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {entries.slice(-5).reverse().map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{new Date(entry.date).toLocaleDateString('fi-FI')}</span>
                        <Badge variant="outline">{entry.weight} kg</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="growth-chart">
            <WeightChart weightData={entries} />
          </TabsContent>

          <TabsContent value="food-calculator">
            <FoodCalculator currentWeight={getLatestWeight()} user={user} />
          </TabsContent>

          <TabsContent value="puppy-feeding">
            <PuppyFeeding />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  )
}
