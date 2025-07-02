
import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { toast } from 'sonner'
import AuthForm from './AuthForm'
import StatisticsCards from './StatisticsCards'
import WeightEntryForm from './WeightEntryForm'
import WeightEntryList from './WeightEntryList'
import WeightChart from './WeightChart'
import FoodCalculator from './FoodCalculator'
import { useWeightEntries } from '@/hooks/useWeightEntries'

export default function PuppyWeightTracker() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch weight entries using the custom hook
  const { data: weightEntries = [], isLoading: entriesLoading, error } = useWeightEntries(user?.id || '')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Uloskirjautuminen epäonnistui: ' + error.message)
    } else {
      toast.success('Olet kirjautunut ulos')
    }
  }

  const handleAuthSuccess = () => {
    // User state will be updated automatically by the auth state listener
    toast.success('Tervetuloa!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Ladataan...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />
  }

  if (error) {
    toast.error('Tietojen lataaminen epäonnistui: ' + error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐕</span>
              <h1 className="text-xl font-bold text-gray-900">Puppy Weight Watch</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Kirjaudu ulos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pentusi kasvun seuranta</h2>
            <p className="text-gray-600">
              Seuraa pentusi painonkehitystä ja laske optimaaliset ruokamäärät
            </p>
          </div>

          <Tabs defaultValue="weight-tracking" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weight-tracking">Painonseuranta</TabsTrigger>
              <TabsTrigger value="growth-chart">Kasvukäyrä</TabsTrigger>
              <TabsTrigger value="food-calculator">Ruokamäärät</TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight-tracking" className="space-y-6">
              <StatisticsCards entries={weightEntries} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WeightEntryForm 
                  userId={user.id} 
                  previousWeights={weightEntries}
                />
                <WeightEntryList 
                  entries={weightEntries} 
                  userId={user.id}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="growth-chart" className="space-y-6">
              <WeightChart 
                weightData={weightEntries.map(entry => ({
                  date: entry.date,
                  weight: entry.weight
                }))} 
              />
            </TabsContent>
            
            <TabsContent value="food-calculator" className="space-y-6">
              <FoodCalculator 
                currentWeight={weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0}
                user={user}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
