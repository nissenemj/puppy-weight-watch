import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Upload, Trash2, Eye, Save, X } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DosageTableRow {
  id?: string
  weight_range: string
  age_range: string
  daily_amount: string
  notes: string
  row_order: number
}

interface DosageImage {
  id: string
  title: string
  description?: string
  image_path: string
  food_brand?: string
  created_at: string
  table_data?: DosageTableRow[]
}

export default function DosageImagesSection() {
  const [dosageImages, setDosageImages] = useState<DosageImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [editingTableId, setEditingTableId] = useState<string | null>(null)
  const [tableRows, setTableRows] = useState<DosageTableRow[]>([])
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    food_brand: '',
    file: null as File | null
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchDosageImages()
  }, [])

  const fetchDosageImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch images - admin sees all, regular users see only their own
      const { data: images, error: imagesError } = await supabase
        .from('dosage_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (imagesError) throw imagesError

      // Fetch table data for each image
      const imagesWithTableData = await Promise.all(
        (images || []).map(async (image) => {
          const { data: tableData } = await supabase
            .from('dosage_table_data')
            .select('*')
            .eq('dosage_image_id', image.id)
            .order('row_order', { ascending: true })

          return {
            ...image,
            table_data: tableData || []
          }
        })
      )

      setDosageImages(imagesWithTableData)
    } catch (error) {
      console.error('Error fetching dosage images:', error)
      toast({
        title: "Virhe",
        description: "Annostelukuvien lataaminen epäonnistui",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async () => {
    if (!newImage.file || !newImage.title) {
      toast({
        title: "Virhe",
        description: "Valitse kuva ja anna otsikko",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Käyttäjää ei löytynyt')

      // Upload image to storage
      const fileExt = newImage.file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('food-images')
        .upload(fileName, newImage.file)

      if (uploadError) throw uploadError

      // Save image metadata to database
      const { error: dbError } = await supabase
        .from('dosage_images')
        .insert({
          user_id: user.id,
          title: newImage.title,
          description: newImage.description || null,
          food_brand: newImage.food_brand || null,
          image_path: fileName
        })

      if (dbError) throw dbError

      toast({
        title: "Onnistui",
        description: "Annostelukuva tallennettiin onnistuneesti"
      })

      setNewImage({ title: '', description: '', food_brand: '', file: null })
      setIsDialogOpen(false)
      fetchDosageImages()
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        title: "Virhe",
        description: "Kuvan tallentaminen epäonnistui",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const deleteImage = async (imageId: string, imagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('food-images')
        .remove([imagePath])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('dosage_images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw dbError

      toast({
        title: "Onnistui",
        description: "Annostelukuva poistettiin"
      })

      fetchDosageImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: "Virhe",
        description: "Kuvan poistaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const saveTableData = async (imageId: string) => {
    try {
      // Delete existing table data
      await supabase
        .from('dosage_table_data')
        .delete()
        .eq('dosage_image_id', imageId)

      // Insert new table data
      if (tableRows.length > 0) {
        const { error } = await supabase
          .from('dosage_table_data')
          .insert(
            tableRows.map((row, index) => ({
              dosage_image_id: imageId,
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

      setEditingTableId(null)
      setTableRows([])
      fetchDosageImages()
    } catch (error) {
      console.error('Error saving table data:', error)
      toast({
        title: "Virhe",
        description: "Taulukkotietojen tallentaminen epäonnistui",
        variant: "destructive"
      })
    }
  }

  const startEditingTable = (image: DosageImage) => {
    setEditingTableId(image.id)
    setTableRows(image.table_data || [{ weight_range: '', age_range: '', daily_amount: '', notes: '', row_order: 0 }])
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

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage
      .from('food-images')
      .getPublicUrl(imagePath)
    return data.publicUrl
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Ladataan annostelukuvia...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>Annostelukuvat</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Lisää kuva
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lisää annostelukuva</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Otsikko *</Label>
                  <Input
                    id="title"
                    value={newImage.title}
                    onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="esim. Royal Canin Puppy annostelu"
                  />
                </div>
                <div>
                  <Label htmlFor="food_brand">Ruokamerkki</Label>
                  <Input
                    id="food_brand"
                    value={newImage.food_brand}
                    onChange={(e) => setNewImage(prev => ({ ...prev, food_brand: e.target.value }))}
                    placeholder="esim. Royal Canin"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Kuvaus</Label>
                  <Textarea
                    id="description"
                    value={newImage.description}
                    onChange={(e) => setNewImage(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Lisätietoja annostelusta..."
                  />
                </div>
                <div>
                  <Label htmlFor="file">Kuva *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImage(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                  />
                </div>
                <Button onClick={uploadImage} disabled={uploading} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Tallentaa...' : 'Tallenna kuva'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {dosageImages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Ei tallennettuja annostelukuvia.</p>
            <p className="text-sm mt-2">Lisää ensimmäinen kuva yllä olevalla painikkeella.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dosageImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                      {image.food_brand && (
                        <p className="text-sm text-muted-foreground">{image.food_brand}</p>
                      )}
                      {image.description && (
                        <p className="text-sm text-muted-foreground mt-1">{image.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditingTable(image)}
                        disabled={editingTableId === image.id}
                      >
                        {editingTableId === image.id ? 'Muokataan...' : 'Muokkaa taulukkoa'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteImage(image.id, image.image_path)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="image" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="image">Kuva</TabsTrigger>
                      <TabsTrigger value="table">Taulukko</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="image" className="mt-4">
                      <div className="relative group cursor-pointer">
                        <img
                          src={getImageUrl(image.image_path)}
                          alt={image.title}
                          className="w-full h-auto object-contain max-h-[600px] mx-auto"
                          onClick={() => setSelectedImage(getImageUrl(image.image_path))}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="table" className="mt-4">
                      {editingTableId === image.id ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">Muokkaa annostelutaulukkoa</h4>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => addTableRow()}>
                                <Plus className="h-4 w-4 mr-1" />
                                Lisää rivi
                              </Button>
                              <Button size="sm" onClick={() => saveTableData(image.id)}>
                                <Save className="h-4 w-4 mr-1" />
                                Tallenna
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => {
                                  setEditingTableId(null)
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
                          {image.table_data && image.table_data.length > 0 ? (
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
                                {image.table_data.map((row, index) => (
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
                              <p className="text-sm mt-2">Klikkaa "Muokkaa taulukkoa" lisätäksesi tiedot.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Lisätty: {new Date(image.created_at).toLocaleDateString('fi-FI')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Image preview dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-6xl max-h-[95vh]">
              <img
                src={selectedImage}
                alt="Annostelukuva"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}