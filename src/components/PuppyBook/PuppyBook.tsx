import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Book,
  Camera,
  Heart,
  Calendar,
  Award,
  Plus,
  MessageCircle,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Check,
  PenTool,
  Sparkles,
  Star,
  Users,
  Trophy,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/Navigation';
import { useUser } from '@/contexts/UserContext';

// Extracted components
import { PuppyBookSkeleton } from '@/components/features/puppy-book/PuppyBookSkeleton';
import { CreateBookPrompt } from '@/components/features/puppy-book/CreateBookPrompt';
import { PuppyBookNavigation } from '@/components/features/puppy-book/PuppyBookNavigation';
import { DEFAULT_MILESTONES } from '@/data/constants';

// Sub-components
import MonthlyTracker from './MonthlyTracker';
import Timeline from './Timeline';
import Milestones from './Milestones';
import MemoryGallery from './MemoryGallery';
import Leaderboard from './Leaderboard';
import WeeklyChallenges from './WeeklyChallenges';
import UserSpotlight from './UserSpotlight';
import WeightGrowthSection from './WeightGrowthSection';
import AnimatedHeader from './AnimatedHeader';
import FloatingActionButton from './FloatingActionButton';
import ShareDialog from './ShareDialog';
import SettingsDialog from './SettingsDialog';
import PuppyProfileEditor from './PuppyProfileEditor';
import PuppyBookSelector from './PuppyBookSelector';

// Utilities and Types
import { getMonthNumberFromAge, getDefaultBirthDate } from '@/utils/puppyAge';
import type { PuppyBook as PuppyBookType, TimelineEntry, Memory, Milestone, MemoryReaction, MemoryComment } from '@/types/dog';

// Pääkomponentti
const PuppyBook: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState('monthly');
  const [book, setBook] = useState<PuppyBookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showFloatingAction, setShowFloatingAction] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const memoryGalleryRef = React.useRef<(() => void) | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading) {
      setLoading(false);
    }
  }, [userLoading]);

  const handleRetry = () => {
    // Reload the page to retry user authentication
    window.location.reload();
  };

  const handleBookSelect = (bookId: string, bookData: PuppyBookType) => {
    setSelectedBookId(bookId);
    setBook(bookData);
  };

  // Calculate age-appropriate default month when book changes
  useEffect(() => {
    if (book?.birth_date) {
      const ageBasedMonth = getMonthNumberFromAge(book.birth_date);
      setSelectedMonth(ageBasedMonth);
    } else if (book) {
      // If no birth date, default to month 0
      setSelectedMonth(0);
    }
  }, [book]);

  const createBook = async (title: string, birthDate?: string, coverImageUrl?: string) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('puppy_books')
        .insert([
          {
            owner_id: user.id,
            title: title || 'Pennun elämäntarina',
            birth_date: birthDate || getDefaultBirthDate(),
            cover_image_url: coverImageUrl || null,
            theme: {
              colorScheme: 'warm',
              fontFamily: 'sans-serif'
            }
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating book:', error);
        toast({
          title: "Virhe",
          description: "Pentukirjan luominen epäonnistui",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setBook(data as unknown as PuppyBookData);
        toast({
          title: "Onnistui!",
          description: "Pentukirja luotu onnistuneesti! Voit nyt aloittaa pennun tarinan tallentamisen",
        });

        // Luo oletusarvoiset virstanpylväät
        await createDefaultMilestones(data.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createDefaultMilestones = async (bookId: string) => {
    const milestonesWithBookId = DEFAULT_MILESTONES.map(milestone => ({
      ...milestone,
      book_id: bookId
    }));

    await supabase
      .from('puppy_milestones')
      .insert(milestonesWithBookId);
  };

  if (loading || userLoading) {
    return <PuppyBookSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-sm mx-auto">
          <div className="mb-4 text-red-500">
            <Book className="w-12 h-12 mx-auto opacity-50" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Hups! Jotain meni pieleen</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Yritä uudelleen
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-gradient-to-br from-gradient-mint-light/20 via-gradient-peach-light/20 to-gradient-sky/20 flex items-center justify-center">
      <p className="text-gray-600">Kirjaudu sisään nähdäksesi pentukirjasi</p>
    </div>;
  }

  if (!book) {
    return <CreateBookPrompt onBookCreated={createBook} user={user} onBookSelect={handleBookSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-mint-light/20 via-gradient-peach-light/20 to-gradient-sky/20 page-with-navigation">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-center mb-6">
          <PuppyBookSelector
            user={user}
            selectedBookId={selectedBookId}
            onBookSelect={handleBookSelect}
          />
        </div>
      </div>
      <AnimatedHeader
        title="Pentu kasvaa – seuraa matkaa!"
        subtitle="Tallenna ainutlaatuisia hetkiä pennun matkalla"
        puppyName={book.title}
        birthDate={book.birth_date}
        puppyImageUrl={book.cover_image_url}
        onEditProfile={() => setShowProfileEditor(true)}
        bannerColor={(book.theme?.bannerColor as string) || 'orange'}
      />
      <PuppyBookNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <AnimatePresence mode="wait">
          {activeSection === 'monthly' && (
            <motion.div
              key="monthly"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MonthlyTracker
                bookId={book.id}
                birthDate={book.birth_date}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
            </motion.div>
          )}
          {activeSection === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Timeline bookId={book.id} />
            </motion.div>
          )}
          {activeSection === 'milestones' && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Milestones bookId={book.id} />
            </motion.div>
          )}
          {activeSection === 'growth' && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WeightGrowthSection bookId={book.id} birthDate={book.birth_date} />
            </motion.div>
          )}
          {activeSection === 'memories' && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MemoryGallery
                bookId={book.id}
                onRefresh={memoryGalleryRef}
                onAddMemory={() => setShowFloatingAction(true)}
                puppyProfile={{
                  name: book.title.replace('Pennun elämäntarina', '').replace('Pentukirja', '').trim() || 'Pentu',
                  birthDate: book.birth_date || getDefaultBirthDate(),
                  profileImage: book.cover_image_url
                }}
              />
            </motion.div>
          )}
          {activeSection === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          )}
          {activeSection === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WeeklyChallenges />
            </motion.div>
          )}
          {activeSection === 'spotlight' && (
            <motion.div
              key="spotlight"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserSpotlight />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FloatingActionButton
        bookId={book.id}
        showDialog={showFloatingAction}
        onShowDialogChange={setShowFloatingAction}
        onMemoryAdded={() => {
          if (memoryGalleryRef.current) {
            memoryGalleryRef.current();
          }
        }}
        onHealthRecordAdded={() => {
          // Refresh health records data if needed
          // Could trigger a refresh of timeline or monthly tracker
        }}
      />

      {/* Dialogs */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        bookTitle={book.title}
        bookId={book.id}
      />

      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        book={book}
        onBookUpdated={(updatedBook) => setBook({ ...book, ...updatedBook })}
      />

      <PuppyProfileEditor
        isOpen={showProfileEditor}
        onClose={() => setShowProfileEditor(false)}
        book={book}
        onBookUpdated={(updatedBook) => setBook({ ...book, ...updatedBook })}
      />
    </div>
  );
};

export default PuppyBook;
