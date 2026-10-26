import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Camera as CameraIcon, PenLine, LockKeyhole, Globe, Settings as SettingsIcon, ArrowRight } from 'lucide-react';
import '@/styles/puppy-journal.css';
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

  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionQueries: Record<string, string> = { memories: 'muistot', monthly: 'kuukaudet', timeline: 'aikajana', milestones: 'virstanpylvaat', growth: 'kasvu' };
  const activeSection = Object.keys(sectionQueries).find(section => sectionQueries[section] === searchParams.get('osio')) || 'memories';
  const setActiveSection = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('osio', sectionQueries[section]);
    setSearchParams(next, { preventScrollReset: true });
  };
  const [book, setBook] = useState<PuppyBookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showFloatingAction, setShowFloatingAction] = useState(false);
  const [memoryType, setMemoryType] = useState<'photo' | 'text'>('text');
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

  useEffect(() => {
    setBook(null);
    setSelectedBookId('');
  }, [user?.id]);

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
        setBook(data as unknown as PuppyBookType);
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
    return <div className="puppy-journal"><section className="journal-create">
      <p className="journal-kicker">Oma pentukirja</p>
      <h1>Pennun pienet hetket talteen.</h1>
      <p>Kirjaudu sisään nähdäksesi pentukirjasi</p>
      <div className="journal-book-actions"><Link className="journal-button" to="/login">Kirjaudu sisään</Link><Link className="journal-button journal-button-secondary" to="/muistokirja">Katso esimerkkikirjaa</Link></div>
    </section></div>;
  }

  if (!book || book.owner_id !== user.id) {
    return <CreateBookPrompt onBookCreated={createBook} user={user} onBookSelect={handleBookSelect} />;
  }

  return (
    <div className="puppy-journal">
      <div className="journal-book-toolbar">
        <PuppyBookSelector user={user} selectedBookId={selectedBookId} onBookSelect={handleBookSelect} />
        <div className="journal-book-toolbar-actions"><button type="button" className="journal-text-link" onClick={() => setShowSettingsDialog(true)}><SettingsIcon size={16} aria-hidden="true" /> Kirjan asetukset</button></div>
      </div>
      <AnimatedHeader
        title="Pennun oma tarina"
        subtitle="Kuvia, muistoja ja pieniä suuria hetkiä yhteiseltä matkalta."
        puppyName={book.title}
        birthDate={book.birth_date}
        puppyImageUrl={book.cover_image_url}
        onEditProfile={() => setShowProfileEditor(true)}
        bannerColor={(book.theme?.bannerColor as string) || 'orange'}
      />
      <div className="journal-book-actions">
        <button type="button" className="journal-button" onClick={() => { setMemoryType('text'); setShowFloatingAction(true); }}><PenLine size={18} aria-hidden="true" /> Kirjoita muisto</button>
        <button type="button" className="journal-button journal-button-secondary" onClick={() => { setMemoryType('photo'); setShowFloatingAction(true); }}><CameraIcon size={18} aria-hidden="true" /> Lisää kuva</button>
        <p className="flex items-start gap-2">{book.privacy_settings?.visibility === 'public' ? <><Globe size={16} className="shrink-0 mt-1" aria-hidden="true" /> Kirjan asetuksissa näkyvyys on julkinen.</> : <><LockKeyhole size={16} className="shrink-0 mt-1" aria-hidden="true" /> Muistot kuuluvat omaan kirjaasi. Voit tarkistaa näkyvyyden kirjan asetuksista.</>}</p>
      </div>
      <PuppyBookNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <section id="puppy-book-content" className="journal-book-content" aria-label="Pentukirjan sisältö">
        <AnimatePresence mode="wait">
          {activeSection === 'monthly' && (
            <motion.div
              key="monthly"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <Timeline bookId={book.id} />
            </motion.div>
          )}
          {activeSection === 'milestones' && (
            <motion.div
              key="milestones"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <Milestones bookId={book.id} />
            </motion.div>
          )}
          {activeSection === 'growth' && (
            <motion.div
              key="growth"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <WeightGrowthSection bookId={book.id} birthDate={book.birth_date} />
            </motion.div>
          )}
          {activeSection === 'memories' && (
            <motion.div
              key="memories"
              initial={reduceMotion ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            >
              <MemoryGallery
                bookId={book.id}
                onRefresh={memoryGalleryRef}
                onAddMemory={() => { setMemoryType('text'); setShowFloatingAction(true); }}
                puppyProfile={{
                  name: book.title.replace('Pennun elämäntarina', '').replace('Pentukirja', '').trim() || 'Pentu',
                  birthDate: book.birth_date || getDefaultBirthDate(),
                  profileImage: book.cover_image_url
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <div className="journal-profile-footer rounded-lg mt-6"><p>Katso, miltä omista hetkistä koottu muistokirja voisi näyttää.</p><Link to="/muistokirja" className="journal-text-link">Muistokirjan esimerkki <ArrowRight size={16} aria-hidden="true" /></Link></div>
      <FloatingActionButton
        key={book.id}
        bookId={book.id}
        initialType={memoryType}
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
