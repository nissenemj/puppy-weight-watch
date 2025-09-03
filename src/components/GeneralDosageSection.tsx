import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Save, Trash2, Edit, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { dbToAppTypes } from '@/utils/typeConverters'
import { useToast } from '@/hooks/use-toast'

interface DosageTableRow {
  id?: string
  weight_range: string
  age_range: string
  daily_amount: string
  notes: string
  row_order: number
}

interface DosageGuideline {
  id: string
  title: string
  food_brand?: string
  food_name?: string
  description?: string
  created_at: string
  table_rows?: DosageTableRow[]
}

export default function GeneralDosageSection() {
  const [guidelines, setGuidelines] = useState<DosageGuideline[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tableRows, setTableRows] = useState<DosageTableRow[]>([])
  const [newGuideline, setNewGuideline] = useState({
    title: '',
    food_brand: '',
    food_name: '',
    description: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchGuidelines()
  }, [])

  const fetchGuidelines = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch guidelines
      const { data: guidelinesData, error: guidelinesError } = await supabase
        .from('general_dosage_guidelines')
        .select('*')
        .order('created_at', { ascending: false })

      if (guidelinesError) throw guidelinesError

      // Fetch table rows for each guideline
      const guidelinesWithRows = await Promise.all(
        (guidelinesData || []).map(async (guideline) => {
          const { data: rowsData } = await supabase
            .from('general_dosage_table_rows')
            .select('*')
            .eq('guideline_id', guideline.id)
            .order('row_order', { ascending: true })

          return {
            ...guideline,
            table_rows: rowsData || []
          }
        })
      )

      setGuidelines(dbToAppTypes.dogFood(guidelinesWithRows))
    } catch (error) {
      console.error('Error fetching guidelines:', error)
      toast({
        title: "Virhe",
        description: "Annostelutietojen lataaminen epäonnistui",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createGuideline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Käyttäjää ei löytynyt')

      if (!newGuideline.title) {
        toast({
          title: "Virhe",
          description: "Anna otsikko",
          variant: "destructive"
        })
        return
      }

      const { error } = await supabase
        .from('general_dosage_guidelines')
        .insert({
          user_id: user.id,
          title: newGuideline.title,
          food_brand: newGuideline.food_brand || null,
          food_name: newGuideline.food_name || null,
          description: newGuideline.description || null
        })

      if (error) throw error

      toast({
        title: "Onnistui",
        description: "Annostelutaulu luotu"
      })

      setNewGuideline({ title: '', food_brand: '', food_name: '', description: '' })
      setIsCreateDialogOpen(false)
      fetchGuidelines()
    } catch (error) {
      console.error('Error creating guideline:', error)
      toast({
        title: "Virhe",
        description: "Annostelutaulun luominen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const deleteGuideline = async (id: string) => {
    try {
      const { error } = await supabase
        .from('general_dosage_guidelines')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Onnistui",
        description: "Annostelutaulu poistettu"
      })

      fetchGuidelines()
    } catch (error) {
      console.error('Error deleting guideline:', error)
      toast({
        title: "Virhe",
        description: "Annostelutaulun poistaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const startEditingTable = (guideline: DosageGuideline) => {
    setEditingId(guideline.id)
    setTableRows(guideline.table_rows?.length ? guideline.table_rows : [{ weight_range: '', age_range: '', daily_amount: '', notes: '', row_order: 0 }])
  }

  const saveTableData = async (guidelineId: string) => {
    try {
      // Delete existing table rows
      await supabase
        .from('general_dosage_table_rows')
        .delete()
        .eq('guideline_id', guidelineId)

      // Insert new table rows
      if (tableRows.length > 0) {
        const { error } = await supabase
          .from('general_dosage_table_rows')
          .insert(
            tableRows.map((row, index) => ({
              guideline_id: guidelineId,
              weight_range: row.weight_range,
              age_range: row.age_range,
              daily_amount: row.daily_amount,
              notes: row.notes,
              row_order: index
            }))
          )

        if (error) throw error
      }

      toast({
        title: "Onnistui",
        description: "Taulukkotiedot tallennettiin"
      })

      setEditingId(null)
      setTableRows([])
      fetchGuidelines()
    } catch (error) {
      console.error('Error saving table data:', error)
      toast({
        title: "Virhe",
        description: "Taulukkotietojen tallentaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const addTableRow = () => {
    setTableRows(prev => [...prev, { weight_range: '', age_range: '', daily_amount: '', notes: '', row_order: prev.length }])
  }

  const updateTableRow = (index: number, field: keyof DosageTableRow, value: string) => {
    setTableRows(prev => prev.map((row, i) => 
      i === index ? { ...row, [field]: value } : row
    ))
  }

  const removeTableRow = (index: number) => {
    setTableRows(prev => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Ladataan annostelutauluja...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>Yleiset annostelutaulut</span>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Luo uusi taulu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Luo uusi annostelutaulu</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Otsikko *</Label>
                  <Input
                    id="title"
                    value={newGuideline.title}
                    onChange={(e) => setNewGuideline(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="esim. Royal Canin Puppy annostelu"
                  />
                </div>
                <div>
                  <Label htmlFor="food_brand">Ruokamerkki</Label>
                  <Input
                    id="food_brand"
                    value={newGuideline.food_brand}
                    onChange={(e) => setNewGuideline(prev => ({ ...prev, food_brand: e.target.value }))}
                    placeholder="esim. Royal Canin"
                  />
                </div>
                <div>
                  <Label htmlFor="food_name">Ruoan nimi</Label>
                  <Input
                    id="food_name"
                    value={newGuideline.food_name}
                    onChange={(e) => setNewGuideline(prev => ({ ...prev, food_name: e.target.value }))}
                    placeholder="esim. Puppy Medium"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Kuvaus</Label>
                  <Textarea
                    id="description"
                    value={newGuideline.description}
                    onChange={(e) => setNewGuideline(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Lisätietoja annostelusta..."
                  />
                </div>
                <Button onClick={createGuideline} className="w-full">
                  Luo taulu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {guidelines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ei tallennettuja annostelutauluja.</p>
            <p className="text-sm mt-2">Luo ensimmäinen taulu yllä olevalla painikkeella.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{guideline.title}</h3>
                      {guideline.food_brand && (
                        <p className="text-sm text-muted-foreground">Merkki: {guideline.food_brand}</p>
                      )}
                      {guideline.food_name && (
                        <p className="text-sm text-muted-foreground">Tuote: {guideline.food_name}</p>
                      )}
                      {guideline.description && (
                        <p className="text-sm text-muted-foreground mt-1">{guideline.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingTable(guideline)}
                        disabled={editingId === guideline.id}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {editingId === guideline.id ? 'Muokataan...' : 'Muokkaa'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGuideline(guideline.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingId === guideline.id ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Muokkaa annostelutaulukkoa</h4>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" onClick={() => addTableRow()}>
                            <Plus className="h-4 w-4 mr-1" />
                            Lisää rivi
                          </Button>
                          <Button size="sm" onClick={() => saveTableData(guideline.id)}>
                            <Save className="h-4 w-4 mr-1" />
                            Tallenna
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingId(null)
                              setTableRows([])
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Peruuta
                          </Button>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Paino-alue</TableHead>
                            <TableHead>Ikä-alue</TableHead>
                            <TableHead>Päiväannos</TableHead>
                            <TableHead>Huomiot</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tableRows.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Input
                                  value={row.weight_range}
                                  onChange={(e) => updateTableRow(index, 'weight_range', e.target.value)}
                                  placeholder="esim. 2-5 kg"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={row.age_range}
                                  onChange={(e) => updateTableRow(index, 'age_range', e.target.value)}
                                  placeholder="esim. 2-4 kk"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={row.daily_amount}
                                  onChange={(e) => updateTableRow(index, 'daily_amount', e.target.value)}
                                  placeholder="esim. 45-65 g"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={row.notes}
                                  onChange={(e) => updateTableRow(index, 'notes', e.target.value)}
                                  placeholder="Lisätietoja..."
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeTableRow(index)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div>
                      {guideline.table_rows && guideline.table_rows.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Paino-alue</TableHead>
                              <TableHead>Ikä-alue</TableHead>
                              <TableHead>Päiväannos</TableHead>
                              <TableHead>Huomiot</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {guideline.table_rows.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell>{row.weight_range}</TableCell>
                                <TableCell>{row.age_range}</TableCell>
                                <TableCell>{row.daily_amount}</TableCell>
                                <TableCell>{row.notes}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Ei tallennettuja taulukkotietoja.</p>
                          <p className="text-sm mt-2">Klikkaa "Muokkaa" lisätäksesi tiedot.</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Luotu: {new Date(guideline.created_at).toLocaleDateString('fi-FI')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}