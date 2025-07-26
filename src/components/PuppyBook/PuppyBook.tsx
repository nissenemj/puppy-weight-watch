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
import Navigation from '@/components/Navigation';
import MonthlyTracker from './MonthlyTracker';
import Timeline from './Timeline';
import Milestones from './Milestones';
import MemoryGallery from './MemoryGallery';
import CommunityFeed from './CommunityFeed';
import Leaderboard from './Leaderboard';
import WeeklyChallenges from './WeeklyChallenges';
import UserSpotlight from './UserSpotlight';
import AnimatedHeader from './AnimatedHeader';
import FloatingActionButton from './FloatingActionButton';
import ShareDialog from './ShareDialog';
import SettingsDialog from './SettingsDialog';
import PuppyProfileEditor from './PuppyProfileEditor';
import happyPuppy from '@/assets/happy-puppy.png';
import pawPrints from '@/assets/paw-prints.png';
import puppyBookIcon from '@/assets/puppy-book-icon.png';
import welcomeIllustration from '@/assets/welcome-illustration.png';
import { calculatePuppyAge, getMonthNumberFromAge, getDefaultBirthDate } from '@/utils/puppyAge';

// Tyyppimäärittelyt
interface PuppyBookData {
  id: string;
  puppy_id?: string;
  owner_id: string;
  title: string;
  birth_date?: string;
  cover_image_url?: string;
  theme: any;
  privacy_settings: any;
  created_at: string;
  updated_at: string;
}

interface TimelineEntry {
  id: string;
  book_id: string;
  entry_type: string;
  title: string;
  description?: string;
  entry_date: string;
  metadata: any;
  is_highlight: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}

interface Memory {
  id: string;
  book_id: string;
  timeline_entry_id?: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  reactions?: MemoryReaction[];
  comments?: MemoryComment[];
}

interface MemoryReaction {
  id: string;
  memory_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

interface MemoryComment {
  id: string;
  memory_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

interface Milestone {
  id: string;
  book_id: string;
  title: string;
  description?: string;
  target_age_weeks?: number;
  completed: boolean;
  completed_at?: string;
  display_order: number;
  created_at: string;
}

// Pääkomponentti
const PuppyBook: React.FC = () => {
  const [activeSection, setActiveSection] = useState('monthly');
  const [book, setBook] = useState<PuppyBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showFloatingAction, setShowFloatingAction] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const memoryGalleryRef = React.useRef<(() => void) | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserPuppyBook();
  }, []);

  const loadUserPuppyBook = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: books, error } = await supabase
        .from('puppy_books')
        .select('*')
        .eq('owner_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error loading puppy book:', error);
        toast({
          title: "Virhe",
          description: "Pentukirjan lataaminen epäonnistui",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (books && books.length > 0) {
        setBook(books[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (title: string, birthDate?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('puppy_books')
        .insert([
          {
            owner_id: user.id,
            title: title || 'Pennun elämäntarina',
            birth_date: birthDate || getDefaultBirthDate(),
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
        setBook(data);
        toast({
          title: "Onnistui! 🎉",
          description: "Pentukirja luotu onnistuneesti! Voit nyt aloittaa pennun tarinan tallentamisen 🐕✨",
        });

        // Luo oletusarvoiset virstanpylväät
        await createDefaultMilestones(data.id);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createDefaultMilestones = async (bookId: string) => {
    const defaultMilestones = [
      {
        book_id: bookId,
        title: 'Ensimmäinen rokotus',
        description: 'Perusrokotukset aloitettu',
        target_age_weeks: 8,
        display_order: 1
      },
      {
        book_id: bookId,
        title: 'Peruskomennot',
        description: 'Istu, maahan, tule -komennot',
        target_age_weeks: 12,
        display_order: 2
      },
      {
        book_id: bookId,
        title: 'Sosiaalistaminen',
        description: 'Tutustuminen muihin koiriin ja ihmisiin',
        target_age_weeks: 16,
        display_order: 3
      },
      {
        book_id: bookId,
        title: 'Toinen rokotus',
        description: 'Rokotussarja täydennetty',
        target_age_weeks: 12,
        display_order: 4
      },
      {
        book_id: bookId,
        title: 'Hihnakävely',
        description: 'Opetellut kävelemään hihnassa',
        target_age_weeks: 20,
        display_order: 5
      }
    ];

    await supabase
      .from('puppy_milestones')
      .insert(defaultMilestones);
  };

  if (loading) {
    return <PuppyBookSkeleton />;
  }

  if (!book) {
    return <CreateBookPrompt onBookCreated={createBook} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-mint-light/20 via-gradient-peach-light/20 to-gradient-sky/20">
      <Navigation />
      <AnimatedHeader 
        title="Pentu kasvaa – seuraa matkaa!"
        subtitle="Tallenna ainutlaatuisia hetkiä ja jaa iloa yhteisön kanssa ✨"
        puppyName={book.title}
        birthDate={book.birth_date}
        puppyImageUrl={book.cover_image_url}
        onEditProfile={() => setShowProfileEditor(true)}
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
          {activeSection === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CommunityFeed />
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

// Latausskeleton
const PuppyBookSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-b-3xl mb-6"></div>
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg flex-1"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Kirjan luomisprompt
const CreateBookPrompt: React.FC<{
  onBookCreated: (title: string, birthDate?: string) => void;
}> = ({ onBookCreated }) => {
  const [title, setTitle] = useState('');
  const [birthDate, setBirthDate] = useState(getDefaultBirthDate());
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBook = async () => {
    setIsCreating(true);
    await onBookCreated(title, birthDate);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Söpöt taustakuviot */}
      <motion.img 
        src={pawPrints}
        alt=""
        className="absolute top-10 left-10 w-20 h-20 opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.img 
        src={pawPrints}
        alt=""
        className="absolute bottom-10 right-10 w-16 h-16 opacity-15"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative"
      >
        {/* Leikkisä ikoni */}
        <motion.div 
          className="relative mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.img 
            src={happyPuppy}
            alt="Onnellinen pentu"
            className="w-24 h-24 mx-auto rounded-full shadow-lg"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-sans font-bold text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Luo pentukirja! 🐶
        </motion.h2>
        <motion.p 
          className="text-gray-600 mb-6 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Aloita pennun ainutlaatuisen elämäntarinan tallentaminen ✨
        </motion.p>

        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Kirjan nimi (esim. Rexin elämäntarina)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pennun syntymäpäivä 🎂
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Syntymäpäivän perusteella järjestelmä ehdottaa iänmukaisia aktiviteetteja ja virstanpylväitä
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateBook}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
        >
          {isCreating ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Luodaan kirjaa...
            </div>
          ) : (
            'Luo pentukirja'
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

// Kirjan header
const PuppyBookHeader: React.FC<{
  book: PuppyBookData;
  onShareClick: () => void;
  onSettingsClick: () => void;
}> = ({ book, onShareClick, onSettingsClick }) => {
  return (
    <div className="relative bg-gradient-playful text-white overflow-hidden">
      {/* Söpöt taustakuviot */}
      <motion.img 
        src={pawPrints}
        alt=""
        className="absolute top-4 right-4 w-16 h-16 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.img 
        src={pawPrints}
        alt=""
        className="absolute bottom-4 left-4 w-12 h-12 opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-8">
        <motion.div 
          className="flex items-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {book.cover_image_url ? (
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30">
                <img 
                  src={book.cover_image_url} 
                  alt="Kirjan kansi"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white/30 bg-white/20 flex items-center justify-center">
                <img 
                  src={puppyBookIcon} 
                  alt="Pentukirja"
                  className="w-16 h-16"
                />
              </div>
            )}
          </motion.div>
          
          <div className="flex-1">
            <motion.h1 
              className="text-3xl font-playful font-bold mb-2 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {book.title} 🐕
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ❤️
              </motion.div>
            </motion.h1>
            <motion.p 
              className="text-white/80 font-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Luotu {new Date(book.created_at).toLocaleDateString('fi-FI')} ✨
            </motion.p>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShareClick}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Navigaatio
const PuppyBookNavigation: React.FC<{
  activeSection: string;
  onSectionChange: (section: string) => void;
}> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'monthly', label: 'Kuukaudet', icon: Calendar, emoji: '📅' },
    { id: 'timeline', label: 'Aikajana', icon: Calendar, emoji: '⏰' },
    { id: 'milestones', label: 'Virstanpylväät', icon: Award, emoji: '🏆' },
    { id: 'memories', label: 'Muistot', icon: Heart, emoji: '💖' },
    { id: 'community', label: 'Yhteisö', icon: Users, emoji: '👥' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSectionChange(section.id)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-6 py-4 font-medium transition-all rounded-t-lg
                ${activeSection === section.id
                  ? 'text-orange-600 border-b-3 border-orange-600 bg-gradient-to-t from-orange-50 to-orange-25 font-semibold'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
                }
              `}
            >
              <motion.div
                animate={activeSection === section.id ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ 
                  duration: 2,
                  repeat: activeSection === section.id ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="text-lg"
              >
                {section.emoji}
              </motion.div>
              <span className="font-playful">{section.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};









export default PuppyBook;