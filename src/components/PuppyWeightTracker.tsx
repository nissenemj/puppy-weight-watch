'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import WeightChart from './WeightChart'

interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

export default function PuppyWeightTracker() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [weightData, setWeightData] = useState<WeightEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [weight, setWeight] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Auth states
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          setTimeout(() => {
            loadWeightData()
          }, 0)
        }
      }
    )

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      loadWeightData()
      // Set today's date as default
      const today = new Date().toISOString().split('T')[0]
      setDate(today)
    }
  }, [user])

  const loadWeightData = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (error) throw error
      setWeightData(data || [])
    } catch (error) {
      console.error('Error loading weight data:', error)
      toast.error('Virhe tietojen lataamisessa')
    }
  }

  const handleAuth = async () => {
    setAuthLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success('Kirjautuminen onnistui!')
      } else {
        if (password !== confirmPassword) {
          throw new Error('Salasanat eivät täsmää')
        }
        if (password.length < 6) {
          throw new Error('Salasanan tulee olla vähintään 6 merkkiä')
        }
        
        const redirectUrl = `${window.location.origin}/`
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        })
        if (error) throw error
        toast.success('Tarkista sähköpostisi vahvistuslinkkiä varten')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Virhe uloskirjautumisessa')
    } else {
      setWeightData([])
      toast.success('Kirjauduit ulos')
    }
  }

  const addWeightEntry = async () => {
    if (!user || !date || !weight) {
      toast.error('Täytä kaikki kentät')
      return
    }

    setIsSubmitting(true)

    try {
      const weightNum = parseFloat(weight)
      
      // Check if entry exists for this date
      const existingEntry = weightData.find(entry => entry.date === date)
      
      if (existingEntry) {
        const shouldUpdate = window.confirm('Tältä päivältä on jo merkintä. Haluatko päivittää sen?')
        if (!shouldUpdate) {
          setIsSubmitting(false)
          return
        }

        const { error } = await supabase
          .from('weight_entries')
          .update({ weight: weightNum })
          .eq('id', existingEntry.id)

        if (error) throw error
        toast.success('Painomerkintä päivitetty!')
      } else {
        const { error } = await supabase
          .from('weight_entries')
          .insert([{
            user_id: user.id,
            date,
            weight: weightNum
          }])

        if (error) throw error
        toast.success('Painomerkintä lisätty!')
      }

      await loadWeightData()
      setWeight('')
    } catch (error: any) {
      toast.error('Virhe tallentamisessa: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Haluatko varmasti poistaa tämän merkinnän?')) return

    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadWeightData()
      toast.success('Merkintä poistettu')
    } catch (error: any) {
      toast.error('Virhe poistamisessa: ' + error.message)
    }
  }

  const getStats = () => {
    if (weightData.length === 0) return { current: '-', growth: '-', avgWeekly: '-' }

    const current = weightData[weightData.length - 1].weight
    const first = weightData[0].weight
    const growth = current - first

    let avgWeekly = '-'
    if (weightData.length > 1) {
      const firstDate = new Date(weightData[0].date)
      const lastDate = new Date(weightData[weightData.length - 1].date)
      const weeksDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
      if (weeksDiff > 0) {
        avgWeekly = Math.round((growth / weeksDiff) * 1000).toString()
      }
    }

    return {
      current: current.toFixed(1),
      growth: growth.toFixed(1),
      avgWeekly
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ladataan...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              🐕 Koiranpennun Painonseuranta
            </CardTitle>
            <CardDescription>
              Seuraa koiranpentusi kasvua ja kehitystä
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isLogin ? "login" : "register"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                  Kirjaudu
                </TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                  Rekisteröidy
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Sähköposti</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAuth)}
                    placeholder="oma@email.com"
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
                    onKeyPress={(e) => handleKeyPress(e, handleAuth)}
                    placeholder="Salasana"
                    required
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  disabled={authLoading}
                  className="w-full"
                >
                  {authLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
                </Button>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-reg">Sähköposti</Label>
                  <Input
                    id="email-reg"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAuth)}
                    placeholder="oma@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-reg">Salasana</Label>
                  <Input
                    id="password-reg"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAuth)}
                    placeholder="Vähintään 6 merkkiä"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Vahvista salasana</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAuth)}
                    placeholder="Sama salasana uudelleen"
                    required
                  />
                </div>
                <Button
                  onClick={handleAuth}
                  disabled={authLoading}
                  className="w-full"
                >
                  {authLoading ? 'Luodaan tiliä...' : 'Luo tili'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  🐕 Koiranpennun Painonseuranta
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Seuraa pennun kasvua ja kehitystä
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">
                  Kirjautunut: {user.email}
                </p>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                >
                  Kirjaudu ulos
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Lisää uusi painomittaus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-40">
                <Label htmlFor="date">Päivämäärä</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex-1 min-w-40">
                <Label htmlFor="weight">Paino (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addWeightEntry)}
                  placeholder="esim. 2.5"
                  required
                />
              </div>

              <Button
                onClick={addWeightEntry}
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? 'Tallennetaan...' : 'Lisää mittaus'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stats.current}
              </div>
              <div className="text-sm text-gray-600">Nykyinen paino (kg)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {stats.growth}
              </div>
              <div className="text-sm text-gray-600">Kasvu yhteensä (kg)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {stats.avgWeekly}
              </div>
              <div className="text-sm text-gray-600">Keskikasvu/viikko (g)</div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Chart */}
        {weightData.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Painon kehitys ja ennuste</CardTitle>
              <CardDescription>
                Sininen viiva: mitattu paino • Vihreä katkoviiva: keskikasvukäyrä • Oranssi katkoviiva: ennuste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeightChart weightData={weightData} />
            </CardContent>
          </Card>
        )}

        {/* Weight List */}
        <Card>
          <CardHeader>
            <CardTitle>Painomittaukset</CardTitle>
          </CardHeader>
          <CardContent>
            {weightData.length > 0 ? (
              <div className="space-y-3">
                {weightData.map((entry, index) => {
                  const prevWeight = index > 0 ? weightData[index - 1].weight : entry.weight
                  const change = entry.weight - prevWeight
                  const changeText = index > 0 
                    ? change > 0 
                      ? `(+${change.toFixed(1)} kg)`
                      : `(${change.toFixed(1)} kg)`
                    : ''

                  return (
                    <div key={entry.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-700">
                          {new Date(entry.date).toLocaleDateString('fi-FI')}
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                          {entry.weight} kg
                        </span>
                        {changeText && (
                          <span className={`text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {changeText}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => deleteEntry(entry.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Poista
                      </Button>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🐕</div>
                <p className="text-gray-500 text-lg">
                  Ei vielä painomittauksia
                </p>
                <p className="text-gray-400">
                  Lisää ensimmäinen mittaus yllä olevalla lomakkeella!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
