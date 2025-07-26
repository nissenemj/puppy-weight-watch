import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Book } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import DogSelector from '@/components/DogSelector';

interface Dog {
  id: string;
  name: string;
  breed?: string;
  weight_kg?: number;
  age_years?: number;
  activity_level?: string;
  health_conditions?: string[];
}

interface PuppyBook {
  id: string;
  owner_id: string;
  dog_id: string;
  title: string;
  birth_date?: string;
  cover_image_url?: string;
  theme: any;
  privacy_settings: any;
  created_at: string;
  updated_at: string;
  dogs?: Dog | null;
}

interface PuppyBookSelectorProps {
  user: User;
  selectedBookId?: string;
  onBookSelect: (bookId: string, book: PuppyBook) => void;
}

export default function PuppyBookSelector({ user, selectedBookId, onBookSelect }: PuppyBookSelectorProps) {
  const [books, setBooks] = useState<PuppyBook[]>([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [selectedDogId, setSelectedDogId] = useState<string>('');
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadBooks();
    }
  }, [user?.id]);

  const loadBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('puppy_books')
        .select(`
          *,
          dogs!puppy_books_dog_id_fkey (
            id,
            name,
            breed,
            weight_kg,
            age_years,
            activity_level,
            health_conditions
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setBooks((data as any) || []);
      
      // Auto-select first book if none selected AND no book is currently selected
      if (data && data.length > 0 && !selectedBookId && !books.some(b => b.id === selectedBookId)) {
        onBookSelect(data[0].id, data[0] as any);
      }
    } catch (error) {
      console.error('Error loading puppy books:', error);
      toast({
        title: "Virhe",
        description: "Pentukirjojen lataaminen epäonnistui",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDogSelect = (dogId: string, dog: Dog) => {
    setSelectedDogId(dogId);
    setSelectedDog(dog);
  };

  const addBook = async () => {
    if (!newBookTitle.trim() || !selectedDogId) return;

    try {
      const { data, error } = await supabase
        .from('puppy_books')
        .insert({
          owner_id: user.id,
          dog_id: selectedDogId,
          title: newBookTitle,
          theme: {
            colorScheme: 'warm',
            fontFamily: 'sans-serif'
          },
          privacy_settings: {
            visibility: 'private',
            allowComments: true
          }
        })
        .select(`
          *,
          dogs!puppy_books_dog_id_fkey (
            id,
            name,
            breed,
            weight_kg,
            age_years,
            activity_level,
            health_conditions
          )
        `)
        .single();

      if (error) throw error;

      const newBook = data as any;
      setBooks([...books, newBook]);
      onBookSelect(newBook.id, newBook);
      setNewBookTitle('');
      setSelectedDogId('');
      setSelectedDog(null);
      setIsAddingBook(false);
      
      toast({
        title: "Pentukirja luotu!",
        description: `${newBook.title} on nyt valittu aktiiviseksi pentukirjaksi.`
      });
    } catch (error) {
      console.error('Error adding puppy book:', error);
      toast({
        title: "Virhe",
        description: "Pentukirjan luominen epäonnistui",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-muted h-10 rounded-md"></div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedBookId || ''} 
        onValueChange={(value) => {
          const book = books.find(b => b.id === value);
          if (book) onBookSelect(value, book);
        }}
      >
        <SelectTrigger className="min-w-[200px]">
          <SelectValue placeholder="Valitse pentukirja" />
        </SelectTrigger>
        <SelectContent>
          {books.map((book) => (
            <SelectItem key={book.id} value={book.id}>
              <div className="flex flex-col">
                <span>{book.title}</span>
                {book.dogs && (
                  <span className="text-xs text-muted-foreground">
                    {book.dogs.name} {book.dogs.breed && `(${book.dogs.breed})`}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Book className="h-5 w-5" />
              Luo uusi pentukirja
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bookTitle" className="text-gray-900 dark:text-white">Pentukirjan nimi *</Label>
              <Input
                id="bookTitle"
                value={newBookTitle}
                onChange={(e) => setNewBookTitle(e.target.value)}
                placeholder="esim. Bella pentukirja"
              />
            </div>
            <div>
              <Label className="text-gray-900 dark:text-white">Valitse koira *</Label>
              <DogSelector
                user={user}
                selectedDogId={selectedDogId}
                onDogSelect={handleDogSelect}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={addBook} 
                disabled={!newBookTitle.trim() || !selectedDogId}
                className="flex-1 text-white"
              >
                Luo pentukirja
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingBook(false)}
                className="flex-1 text-gray-900 dark:text-white"
              >
                Peruuta
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}