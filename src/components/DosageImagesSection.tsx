import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Upload, Trash2, Eye } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface DosageImage {
  id: string
  title: string
  description?: string
  image_path: string
  food_brand?: string
  created_at: string
}

export default function DosageImagesSection() {
  const [dosageImages, setDosageImages] = useState<DosageImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
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

      const { data, error } = await supabase
        .from('dosage_images')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDosageImages(data || [])
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
        <CardTitle className="flex items-center justify-between">
          <span>Annostelukuvat</span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dosageImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-video relative group cursor-pointer">
                  <img
                    src={getImageUrl(image.image_path)}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onClick={() => setSelectedImage(getImageUrl(image.image_path))}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                  {image.food_brand && (
                    <p className="text-xs text-muted-foreground mb-2">{image.food_brand}</p>
                  )}
                  {image.description && (
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{image.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(image.created_at).toLocaleDateString('fi-FI')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteImage(image.id, image.image_path)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Image preview dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <img
                src={selectedImage}
                alt="Annostelukuva"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}