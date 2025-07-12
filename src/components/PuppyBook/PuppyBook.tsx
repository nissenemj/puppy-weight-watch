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
  PenTool
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

// Tyyppimäärittelyt
interface PuppyBookData {
  id: string;
  puppy_id?: string;
  owner_id: string;
  title: string;
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
  const [activeSection, setActiveSection] = useState('timeline');
  const [book, setBook] = useState<PuppyBookData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const createBook = async (title: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('puppy_books')
        .insert([
          {
            owner_id: user.id,
            title: title || 'Pennun elämäntarina',
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
          title: "Onnistui!",
          description: "Pentukirja luotu onnistuneesti",
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Navigation />
      <PuppyBookHeader book={book} />
      <PuppyBookNavigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <AnimatePresence mode="wait">
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
              <MemoryGallery bookId={book.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FloatingActionButton bookId={book.id} />
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
  onBookCreated: (title: string) => void;
}> = ({ onBookCreated }) => {
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBook = async () => {
    setIsCreating(true);
    await onBookCreated(title);
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Luo pentukirja
          </h2>
          <p className="text-gray-600">
            Aloita pennun ainutlaatuisen elämäntarinan tallentaminen
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Kirjan nimi (esim. Rexin elämäntarina)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
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
const PuppyBookHeader: React.FC<{book: PuppyBookData}> = ({ book }) => {
  return (
    <div className="relative bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex items-center space-x-6">
          {book.cover_image_url && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={book.cover_image_url} 
                alt="Kirjan kansi"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-white/80">
              Luotu {new Date(book.created_at).toLocaleDateString('fi-FI')}
            </p>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 rounded-xl backdrop-blur-sm"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
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
    { id: 'timeline', label: 'Aikajana', icon: Calendar },
    { id: 'milestones', label: 'Virstanpylväät', icon: Award },
    { id: 'memories', label: 'Muistot', icon: Heart }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <motion.button
              key={section.id}
              whileHover={{ y: -2 }}
              onClick={() => onSectionChange(section.id)}
              className={`
                flex-shrink-0 flex items-center space-x-2 px-6 py-4 font-medium transition-all
                ${activeSection === section.id
                  ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500'
                }
              `}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Aikajana
const Timeline: React.FC<{bookId: string}> = ({ bookId }) => {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimelineEntries();
  }, [bookId]);

  const loadTimelineEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_entries')
        .select('*')
        .eq('book_id', bookId)
        .order('entry_date', { ascending: false });

      if (error) {
        console.error('Error loading timeline entries:', error);
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Pennun aikajana</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
        >
          Lisää merkintä
        </motion.button>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Ei merkintöjä vielä</h3>
          <p className="text-gray-500">Aloita pennun tarinan tallentaminen lisäämällä ensimmäinen merkintä</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-pink-400"></div>
          
          <div className="space-y-8">
            {entries.map((entry, index) => (
              <TimelineEntryCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Timeline entry card
const TimelineEntryCard: React.FC<{entry: TimelineEntry; index: number}> = ({ entry, index }) => {
  const getIcon = () => {
    switch (entry.entry_type) {
      case 'milestone': return Award;
      case 'weight': return Calendar;
      case 'health': return Heart;
      default: return Camera;
    }
  };

  const getGradient = () => {
    switch (entry.entry_type) {
      case 'milestone': return 'bg-gradient-to-r from-yellow-400 to-orange-400';
      case 'weight': return 'bg-gradient-to-r from-green-400 to-blue-400';
      case 'health': return 'bg-gradient-to-r from-red-400 to-pink-400';
      default: return 'bg-gradient-to-r from-pink-400 to-purple-400';
    }
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative flex items-start space-x-6"
    >
      <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full shadow-lg ${getGradient()}`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{entry.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(entry.entry_date).toLocaleDateString('fi-FI')}
              </p>
            </div>
            {entry.is_highlight && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Tärkeä hetki
              </span>
            )}
          </div>
          
          {entry.description && (
            <p className="text-gray-600 mb-4">{entry.description}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Virstanpylväät
const Milestones: React.FC<{bookId: string}> = ({ bookId }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMilestones();
  }, [bookId]);

  const loadMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('book_id', bookId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading milestones:', error);
        return;
      }

      setMilestones(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestoneCompletion = async (milestoneId: string, completed: boolean) => {
    try {
      const updateData = completed 
        ? { completed: true, completed_at: new Date().toISOString() }
        : { completed: false, completed_at: null };

      const { error } = await supabase
        .from('puppy_milestones')
        .update(updateData)
        .eq('id', milestoneId);

      if (error) {
        console.error('Error updating milestone:', error);
        return;
      }

      // Päivitä local state
      setMilestones(prev => prev.map(m => 
        m.id === milestoneId 
          ? { ...m, ...updateData }
          : m
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
    </div>;
  }

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pennun kehitys</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Kokonaisedistyminen</span>
            <span className="text-sm font-bold text-orange-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-orange-400 to-pink-400 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <MilestoneCard 
              key={milestone.id} 
              milestone={milestone} 
              index={index}
              onToggleCompletion={toggleMilestoneCompletion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Virstanpylväskortti
const MilestoneCard: React.FC<{
  milestone: Milestone; 
  index: number;
  onToggleCompletion: (milestoneId: string, completed: boolean) => void;
}> = ({ milestone, index, onToggleCompletion }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        flex items-center p-4 rounded-xl border-2 transition-all duration-300
        ${milestone.completed 
          ? 'bg-green-50 border-green-200' 
          : 'bg-orange-50 border-orange-200'
        }
      `}
    >
      <div className={`
        flex items-center justify-center w-12 h-12 rounded-full mr-4
        ${milestone.completed 
          ? 'bg-green-500' 
          : 'bg-orange-500'
        }
      `}>
        {milestone.completed ? (
          <Check className="w-6 h-6 text-white" />
        ) : (
          <Award className="w-6 h-6 text-white" />
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{milestone.title}</h3>
        {milestone.description && (
          <p className="text-sm text-gray-600">{milestone.description}</p>
        )}
        {milestone.target_age_weeks && (
          <p className="text-xs text-gray-500 mt-1">
            Tavoite-ikä: {milestone.target_age_weeks} viikkoa
          </p>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onToggleCompletion(milestone.id, !milestone.completed)}
        className={`px-4 py-2 rounded-lg font-medium ${
          milestone.completed
            ? 'bg-gray-500 text-white hover:bg-gray-600'
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {milestone.completed ? 'Peruuta' : 'Merkitse valmiiksi'}
      </motion.button>
    </motion.div>
  );
};

// Muistogalleria
const MemoryGallery: React.FC<{bookId: string}> = ({ bookId }) => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, [bookId]);

  const loadMemories = async () => {
    try {
      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading memories:', error);
        return;
      }

      setMemories(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-xl" />)}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Muistot</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
        >
          Lisää muisto
        </motion.button>
      </div>
      
      {memories.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Ei muistoja vielä</h3>
          <p className="text-gray-500">Tallenna ensimmäinen muistosi pennustasi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memories.map((memory, index) => (
            <MemoryCard key={memory.id} memory={memory} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

// Muistokortti
const MemoryCard: React.FC<{memory: Memory; index: number}> = ({ memory, index }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {memory.content_url && memory.content_type === 'image' && (
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={memory.content_url} 
            alt={memory.caption || 'Muisto'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {new Date(memory.created_at).toLocaleDateString('fi-FI')}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {memory.caption && (
          <p className="text-gray-800 mb-4 leading-relaxed">
            {memory.caption}
          </p>
        )}
        
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {memory.tags.map((tag) => (
              <span 
                key={tag}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">0</span>
            </motion.button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">0</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Kelluva toimintopainike
const FloatingActionButton: React.FC<{bookId: string}> = ({ bookId }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            <ActionButton
              icon={Camera}
              label="Lisää kuva"
              onClick={() => {
                console.log('Add image');
                setIsOpen(false);
              }}
            />
            <ActionButton
              icon={PenTool}
              label="Kirjoita muisto"
              onClick={() => {
                console.log('Add text memory');
                setIsOpen(false);
              }}
            />
            <ActionButton
              icon={Award}
              label="Merkitse virstanpylväs"
              onClick={() => {
                console.log('Add milestone');
                setIsOpen(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300
          ${isOpen 
            ? 'bg-gray-500 rotate-45' 
            : 'bg-gradient-to-r from-orange-500 to-pink-500'
          }
        `}
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </div>
  );
};

// Toimintopainike
const ActionButton: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  onClick: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center space-x-3 bg-white rounded-full shadow-lg px-4 py-3 text-gray-700 hover:text-orange-600"
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    </motion.button>
  );
};

export default PuppyBook;