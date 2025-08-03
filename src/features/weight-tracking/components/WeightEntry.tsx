import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, Scale, Save, TrendingUp } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/integrations/supabase/client'
import { User } from '@supabase/supabase-js'

interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight: number
  created_at: string
}

interface WeightEntryProps {
  user: User
  entries: WeightEntry[]
  onEntryAdded: () => void
}

export default function WeightEntry({ user, entries, onEntryAdded }: WeightEntryProps) {
  const [currentWeight, setCurrentWeight] = useState('')
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const addWeightEntry = async () => {
    if (!currentWeight || !user) return

    setIsLoading(true)
    try {
      // Check if entry for selected date already exists
      const existingEntry = entries.find(entry => entry.date === selectedDate)
      
      const weightValue = parseFloat(currentWeight)
      if (isNaN(weightValue) || weightValue <= 0) {
        toast({
          title: "Virheellinen paino",
          description: "Anna kelvollinen painoarvo",
          variant: "destructive",
        })
        return
      }

      const weightData = {
        user_id: user.id,
        dog_id: null, // Will be updated when dog selection is implemented
        date: selectedDate,
        weight: weightValue,
      }

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('weight_entries')
          .update({ weight: weightValue })
          .eq('id', existingEntry.id)

        if (error) throw error

        toast({
          title: "Paino päivitetty! 📊",
          description: `${selectedDate} paino päivitetty: ${currentWeight} kg`,
        })
      } else {
        // Add new entry
        const { error } = await supabase
          .from('weight_entries')
          .insert([weightData])

        if (error) throw error

        toast({
          title: "Paino lisätty! ✅",
          description: `Uusi painomerkintä: ${currentWeight} kg (${selectedDate})`,
        })
      }
      
      setCurrentWeight('')
      setSelectedDate(new Date().toISOString().split('T')[0])
      onEntryAdded()
    } catch (error: any) {
      console.error('Error saving weight entry:', error)
      toast({
        title: "Virhe",
        description: error.message || "Painon tallentaminen epäonnistui",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addWeightEntry()
  }

  return (
    <div className="space-y-6">
      {/* Current Stats Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-cool text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Nykyinen paino</CardTitle>
            <div className="p-2 bg-white/20 rounded-xl">
              <Scale className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{getLatestWeight().toFixed(1)} kg</div>
            <p className="text-xs text-white/70 mt-1">
              Viimeisin mittaus
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-purple text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Painon muutos</CardTitle>
            <div className="p-2 bg-white/20 rounded-xl">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
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

        <Card className="bg-gradient-warm text-white border-0 shadow-xl hover:-translate-y-1 transition-all duration-200 rounded-2xl sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Mittauksia</CardTitle>
            <div className="p-2 bg-white/20 rounded-xl">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {entries.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{entries.length}</div>
            <p className="text-xs text-white/70 mt-1">
              Painomittauksia yhteensä
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weight Entry Form - Mobile Optimized */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Lisää painomittaus
          </CardTitle>
          <CardDescription className="text-base">
            Syötä pentusi paino ja valitse päivämäärä
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-base font-medium flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Paino (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="esim. 3.2"
                  className="h-14 text-lg rounded-xl border-2 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Päivämäärä
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="h-14 text-lg rounded-xl border-2 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit"
              disabled={!currentWeight || isLoading}
              className="w-full h-14 text-lg rounded-xl bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Tallennetaan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Tallenna mittaus
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Entries - Mobile Optimized */}
      {entries.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Viimeisimmät mittaukset</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.slice(-5).reverse().map((entry) => (
                <div 
                  key={entry.id} 
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-xl hover:scale-105 transition-all duration-200 border border-secondary/10"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700 text-base">
                      {new Date(entry.date).toLocaleDateString('fi-FI')}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleTimeString('fi-FI', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-white border-primary text-primary font-semibold px-4 py-2 text-base">
                    {entry.weight} kg
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}