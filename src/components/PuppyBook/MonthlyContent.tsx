import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  Stethoscope, 
  Users, 
  Camera,
  Edit3,
  CheckCircle,
  Clock,
  MapPin,
  Plus,
  Edit,
  Weight,
  Pill,
  Scale,
  TrendingUp,
  Activity
} from 'lucide-react';
import { calculatePuppyAge, getAgeAppropriateMilestones } from '@/utils/puppyAge';
import { AddHealthRecordDialog } from './AddHealthRecordDialog';
import { ImageUploader } from './ImageUploader';
import { LocationSelector } from './LocationSelector';
import { TimePicker } from './TimePicker';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VeterinaryGuidance } from './VeterinaryGuidance';
import { SourceBadges } from './SourceBadges';
import { AlertTriangle } from 'lucide-react';
import { useWeightEntries } from '@/hooks/useWeightEntries';

interface MonthlyContentProps {
  monthNumber: number;
  bookId: string;
  birthDate?: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  targetWeeks: number;
}

interface HealthRecord {
  type: 'vaccination' | 'deworming' | 'checkup';
  date: string;
  description: string;
  notes?: string;
}

interface DatabaseHealthRecord {
  id: string;
  book_id: string;
  entry_date: string;
  type: 'vaccination' | 'deworming' | 'checkup' | 'other';
  description: string;
  notes: string | null;
  veterinarian: string | null;
  weight_kg: number | null;
  time: string | null;
  medication_name: string | null;
  dosage: string | null;
  vaccine_brand: string | null;
  lot_number: string | null;
  reaction_observed: boolean | null;
  reaction_description: string | null;
  created_at: string;
  updated_at: string;
}

interface SocialEvent {
  date: string;
  type: 'friend' | 'training' | 'experience';
  title: string;
  description: string;
  photos?: string[];
}

interface LocationData {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface EntryData {
  images: string[];
  location?: LocationData;
  time?: string;
  notes: string;
}

const MonthlyContent: React.FC<MonthlyContentProps> = ({ monthNumber, bookId, birthDate }) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'health' | 'social' | 'weight'>('milestones');
  const [customTasks, setCustomTasks] = useState<{ [key: number]: string[] }>({});
  const [newTaskInput, setNewTaskInput] = useState('');
  const [userHealthRecords, setUserHealthRecords] = useState<DatabaseHealthRecord[]>([]);
  
  // State for managing entry data for each milestone/health/social item
  const [milestoneEntries, setMilestoneEntries] = useState<{ [key: string]: EntryData }>({});
  const [healthEntries, setHealthEntries] = useState<{ [key: string]: EntryData }>({});
  const [socialEntries, setSocialEntries] = useState<{ [key: string]: EntryData }>({});
  
  // State for database milestones and tasks
  const [dbMilestones, setDbMilestones] = useState<MilestoneItem[]>([]);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [loadingMilestones, setLoadingMilestones] = useState(true);
  const [dogId, setDogId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Hae käyttäjän painomittaukset
  const { data: weightEntries } = useWeightEntries(
    userId || '', 
    dogId || undefined
  );
  
  // Calculate current age if birth date is available
  const puppyAge = birthDate ? calculatePuppyAge(birthDate) : null;
  const currentWeeks = puppyAge?.weeks || 0;
  
  // Kuukausikohtaiset virstanpylväät
  const getMonthlyMilestones = (month: number): MilestoneItem[] => {
    const milestonesByMonth = {
      0: [
        { id: '0-1', title: 'Silmät auki', description: 'Silmät avautuvat 10-14 päivässä', completed: false, targetWeeks: 2 },
        { id: '0-2', title: 'Ensimmäiset askeleet', description: 'Alkaa kävelemään noin 3 viikon iässä', completed: false, targetWeeks: 3 }
      ],
      1: [
        { id: '1-1', title: 'Ensimmäinen haukahdus', description: 'Ääntely kehittyy', completed: false, targetWeeks: 6 },
        { id: '1-2', title: 'Hampaiden puhkeaminen', description: 'Maitohampaita alkaa tulla', completed: false, targetWeeks: 4 },
        { id: '1-3', title: 'Ensimmäinen rokotus', description: 'Perusrokotukset 7-9 viikon iässä', completed: false, targetWeeks: 8 }
      ],
      2: [
        { id: '2-1', title: 'Sosiaalistaminen alkaa', description: 'Turvallisia kohtaamissia muiden kanssa', completed: false, targetWeeks: 10 },
        { id: '2-2', title: 'Peruskomennot', description: 'Istu, maahan -komentojen opettelu', completed: false, targetWeeks: 12 }
      ],
      3: [
        { id: '3-1', title: 'Toinen rokotus', description: 'Rokotussarja täydennetään', completed: false, targetWeeks: 12 },
        { id: '3-2', title: 'Hihnakävely', description: 'Opetellaan kävelemään hihnassa', completed: false, targetWeeks: 14 }
      ]
    };
    
    return milestonesByMonth[month as keyof typeof milestonesByMonth] || [];
  };

  const getHealthGuidelines = (month: number): HealthRecord[] => {
    const healthByMonth = {
      0: [
        { type: 'deworming' as const, date: '', description: 'Ensimmäinen madotus 2 viikon iässä', notes: 'Toista 2 viikon välein' }
      ],
      1: [
        { type: 'vaccination' as const, date: '', description: 'Ensimmäinen rokotus (7-9 vk)', notes: 'Penikkatauti, parvo, maksatulehdus' },
        { type: 'deworming' as const, date: '', description: 'Madotus jatkuu 2 vk välein', notes: '10-12 viikon ikään asti' }
      ],
      2: [
        { type: 'vaccination' as const, date: '', description: 'Toinen rokotus (12-16 vk)', notes: 'Tehosteannos' },
        { type: 'deworming' as const, date: '', description: 'Madotus ennen rokotusta', notes: '1-2 viikkoa ennen rokotusta' }
      ],
      3: [
        { type: 'checkup' as const, date: '', description: 'Terveystarkastus', notes: 'Kasvun ja kehityksen seuranta' }
      ],
      4: [
        { type: 'vaccination' as const, date: '', description: 'Kolmas rokotus (16-20 vk)', notes: 'Viimeinen penturokotusten sarja' },
        { type: 'checkup' as const, date: '', description: 'Hammastarkastus', notes: 'Maitohampaiden vaihto alkaa' }
      ],
      5: [
        { type: 'checkup' as const, date: '', description: 'Kasvun seuranta', notes: 'Painon ja koon mittaus' }
      ],
      6: [
        { type: 'checkup' as const, date: '', description: 'Sterilisaatio/kastrointi arviointi', notes: 'Keskustelu eläinlääkärin kanssa' }
      ],
      7: [
        { type: 'checkup' as const, date: '', description: 'Puolivuotistarkastus', notes: 'Yleinen terveydentila' }
      ],
      8: [
        { type: 'checkup' as const, date: '', description: 'Hammashygienia', notes: 'Hampaiden puhdistuksen aloitus' }
      ],
      9: [
        { type: 'checkup' as const, date: '', description: 'Talvihoito', notes: 'Tassujenvälinen hoito' }
      ],
      10: [
        { type: 'deworming' as const, date: '', description: 'Aikuisen madotus', notes: 'Siirtyy harvempaan aikatauluun' }
      ],
      11: [
        { type: 'checkup' as const, date: '', description: 'Vuositarkastuksen valmistelu', notes: 'Ensimmäisen vuositarkastuksen valmistelu' }
      ],
      12: [
        { type: 'vaccination' as const, date: '', description: 'Ensimmäinen vuosirokotus', notes: 'Täysi terveystarkastus ja rokotteet' },
        { type: 'checkup' as const, date: '', description: 'Vuositarkastus', notes: 'Täydellinen terveystarkastus' }
      ]
    };

    return healthByMonth[month as keyof typeof healthByMonth] || [];
  };

  // Load milestone data from database
  const loadMilestones = async () => {
    try {
      setLoadingMilestones(true);
      const { data, error } = await supabase
        .from('puppy_milestones')
        .select('*')
        .eq('book_id', bookId)
        .eq('month_number', monthNumber);

      if (error) throw error;
      
      // Convert database milestones to our MilestoneItem format
      const dbMilestoneData = (data || []).map(milestone => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description || '',
        completed: milestone.completed || false,
        targetWeeks: milestone.target_age_weeks || 0
      }));
      
      setDbMilestones(dbMilestoneData);
    } catch (error) {
      console.error('Error loading milestones:', error);
      toast({
        title: "Virhe",
        description: "Virstanpylväiden lataaminen epäonnistui",
        variant: "destructive"
      });
    } finally {
      setLoadingMilestones(false);
    }
  };

  const loadHealthRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('book_id', bookId)
        .order('entry_date', { ascending: false });

      if (error) throw error;
      setUserHealthRecords((data as DatabaseHealthRecord[]) || []);
    } catch (error) {
      console.error('Error loading health records:', error);
    }
  };

  useEffect(() => {
    loadMilestones();
    loadHealthRecords();
    loadUserAndDogData();
  }, [bookId, monthNumber]);

  const loadUserAndDogData = async () => {
    try {
      // Hae käyttäjän tiedot
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      // Hae pentukirjaan liittyvä koira
      const { data: book, error: bookError } = await supabase
        .from('puppy_books')
        .select('dog_id')
        .eq('id', bookId)
        .single();

      if (bookError) {
        console.error('Error loading book:', bookError);
        return;
      }

      if (book?.dog_id) {
        setDogId(book.dog_id);
      }
    } catch (error) {
      console.error('Error loading user and dog data:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      vaccination: 'Rokotus',
      deworming: 'Madotus', 
      checkup: 'Tarkastus',
      other: 'Muu'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadgeVariant = (type: string): "default" | "destructive" | "secondary" | "outline" => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      vaccination: 'default',
      deworming: 'secondary',
      checkup: 'outline', 
      other: 'destructive'
    };
    return variants[type] || 'default';
  };

  const getSocializationTasks = (month: number): string[] => {
    // Age-based socialization tasks (more accurate than month-based)
    const getTasksByWeeks = (weeks: number): string[] => {
      if (weeks < 8) {
        return [
          "Esittele perheenjäseniä (aikuiset, lapset)",
          "Totuta kotiääniä (ovikello, TV, imuri)",
          "Lyhyitä kantokävelyjä turvallisilla alueilla",
          "Totuta erilaisiin pintoihin (matto, parketti, kylpy)",
          "Käytä nameja positiiviseen assosiaatioon"
        ];
      } else if (weeks < 12) {
        return [
          "Ensimmäiset kävelyt taluttimessa (rokotusten jälkeen)",
          "Tapaa rauhallisia aikuisia koiria",
          "Totuta liikenneääniä, autoja, pyöriä",
          "Tapaa 2-3 uutta ihmistä viikossa",
          "Harjoittele peruskomentoja (istu, tule)"
        ];
      } else if (weeks < 16) {
        return [
          "Osallistu pentukursseille (1-2 kertaa/vko)",
          "Kohtaa erilaisia ihmisiä (miehet, naiset, lapset)",
          "Vie kauppoihin (lemmikkiystävällisiin)",
          "Totuta erilaisiin pintoihin (ruoho, hiekka, lumi)",
          "Harjoittele hihnakävelyä"
        ];
      } else if (weeks < 20) {
        return [
          "Järjestä leikkitreffejä samanikäisten kanssa",
          "Esittele eläimiä (kissat, linnut) etäältä",
          "Autolla ajelu lyhyitä matkoja",
          "Käy julkisilla paikoilla (kahvilat, markkinat)",
          "Harjoittele yksinoloa (5-15 min)"
        ];
      } else {
        return [
          "Totuta yksinoloon (30-60 min)",
          "Jatka koiratapaamisia, opeta rajat",
          "Harjoittele erilaisia ääniä (ukkonen, ilmahälyttimet)",
          "Osallistu harrastuksiin (agility, tottelevaisuus)",
          "Syventämisharjoitukset (haku, noutaminen)"
        ];
      }
    };

    // Use age-based tasks if birth date is available, otherwise use month-based
    let baseTasks: string[];
    if (birthDate && currentWeeks > 0) {
      baseTasks = getTasksByWeeks(currentWeeks);
    } else {
      // Fallback to month-based tasks
      const tasksByMonth = {
        0: getTasksByWeeks(6),  // ~6 weeks average
        1: getTasksByWeeks(10), // ~10 weeks average
        2: getTasksByWeeks(14), // ~14 weeks average
        3: getTasksByWeeks(18)  // ~18 weeks average
      };
      baseTasks = tasksByMonth[month as keyof typeof tasksByMonth] || getTasksByWeeks(20);
    }
    
    // Add custom tasks
    const monthCustomTasks = customTasks[month] || [];
    return [...baseTasks, ...monthCustomTasks];
  };

  const addCustomTask = () => {
    if (newTaskInput.trim()) {
      setCustomTasks(prev => ({
        ...prev,
        [monthNumber]: [...(prev[monthNumber] || []), newTaskInput.trim()]
      }));
      setNewTaskInput('');
    }
  };

  // Helper functions for managing entry data
  const updateMilestoneEntry = (milestoneId: string, field: keyof EntryData, value: any) => {
    setMilestoneEntries(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId] || { images: [], notes: '' },
        [field]: value
      }
    }));
  };

  const updateHealthEntry = (healthId: string, field: keyof EntryData, value: any) => {
    setHealthEntries(prev => ({
      ...prev,
      [healthId]: {
        ...prev[healthId] || { images: [], notes: '' },
        [field]: value
      }
    }));
  };

  const updateSocialEntry = (socialId: string, field: keyof EntryData, value: any) => {
    setSocialEntries(prev => ({
      ...prev,
      [socialId]: {
        ...prev[socialId] || { images: [], notes: '' },
        [field]: value
      }
    }));
  };

  const getEntryData = (type: 'milestone' | 'health' | 'social', id: string): EntryData => {
    const entries = type === 'milestone' ? milestoneEntries : 
                   type === 'health' ? healthEntries : socialEntries;
    return entries[id] || { images: [], notes: '' };
  };

  // Save milestone completion to database
  const saveMilestone = async (milestoneId: string, entryData: EntryData) => {
    try {
      // Check if this is a database milestone
      const dbMilestone = dbMilestones.find(m => m.id === milestoneId);
      
      if (dbMilestone) {
        // Update existing database milestone
        const { error } = await supabase
          .from('puppy_milestones')
          .update({
            completed: !dbMilestone.completed,
            completed_at: !dbMilestone.completed ? new Date().toISOString() : null,
            completed_by: !dbMilestone.completed ? (await supabase.auth.getUser()).data.user?.id : null,
            completion_notes: entryData.notes,
            completion_images: entryData.images,
            completion_location: entryData.location ? JSON.parse(JSON.stringify(entryData.location)) : null,
            completion_time: entryData.time
          })
          .eq('id', milestoneId);

        if (error) throw error;
      } else {
        // Create new milestone from static data
        const staticMilestone = getMonthlyMilestones(monthNumber).find(m => m.id === milestoneId);
        if (!staticMilestone) return;

        const { error } = await supabase
          .from('puppy_milestones')
          .insert({
            book_id: bookId,
            title: staticMilestone.title,
            description: staticMilestone.description,
            target_age_weeks: staticMilestone.targetWeeks,
            month_number: monthNumber,
            completed: true,
            completed_at: new Date().toISOString(),
            completed_by: (await supabase.auth.getUser()).data.user?.id,
            completion_notes: entryData.notes,
            completion_images: entryData.images,
            completion_location: entryData.location ? JSON.parse(JSON.stringify(entryData.location)) : null,
            completion_time: entryData.time
          });

        if (error) throw error;
      }

      toast({
        title: "Tallennettu!",
        description: "Virstanpylväs on tallennettu onnistuneesti",
        variant: "default"
      });

      // Reload milestones to reflect changes
      await loadMilestones();
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast({
        title: "Virhe",
        description: "Virstanpylvään tallennus epäonnistui",
        variant: "destructive"
      });
    }
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const milestones = getMonthlyMilestones(monthNumber);
  const healthGuidelines = getHealthGuidelines(monthNumber);

  // Fun facts for each month
  const getFunFact = (month: number) => {
    const facts = {
      0: "💡 Tiesitkö? Pennut syntyvät sokaina ja kuuroina, mutta niiden hajuaisti toimii heti!",
      1: "🧠 Tiesitkö? 8 viikon iässä pennun aivot ovat kehittyneet 80% aikuisen koiran aivoista!",
      2: "🐕 Tiesitkö? Golden Retrieverit oppivat 'istu'-komennon keskimäärin 20% nopeammin kuin muut rodut!",
      3: "🦴 Tiesitkö? 12-16 viikon iässä pennut vaihtavat kaikki 28 maitohammastaan 42 pysyvään hampaaseen!",
      4: "🏃 Tiesitkö? 16 viikon iässä pentu voi juosta jo lyhyitä matkoja - ei liikaa, kasvulevyt ovat vielä pehmeät!",
      5: "📏 Tiesitkö? 5 kuukauden iässä pentu on saavuttanut noin 75% lopullisesta koostaan!",
      6: "🎯 Tiesitkö? Puolivuotiaana pentu pystyy jo keskittymään koulutukseen 15-20 minuuttia kerrallaan!",
      7: "🌍 Tiesitkö? 7 kuukauden iässä pentu tunnistaa yli 100 erilaista sanaa ja elettä!",
      8: "💪 Tiesitkö? 8 kuukauden iässä pentu on saavuttanut lähes täyden fyysisen koordinaationsa!",
      9: "🧘 Tiesitkö? 9 kuukauden iässä pentu alkaa rauhoittua ja stressinsietokyky paranee huomattavasti!",
      10: "🎉 Tiesitkö? 10 kuukauden iässä pentu on saavuttanut 90% lopullisesta älykkyyspotentiaalistaan!",
      11: "🌟 Tiesitkö? 11 kuukauden iässä pentu alkaa näyttää jo aikuisen persoonallisuutensa piirteitä!",
      12: "🎂 Tiesitkö? Vuoden iässä pentu muuttuu virallisesti nuoreksi aikuiseksi koiraksi!"
    };
    return facts[month as keyof typeof facts] || "💫 Tiesitkö? Joka päivä pennun kanssa on uusi oppimisseikkailu!";
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-sans font-bold text-gray-800 mb-2 flex items-center gap-3">
          {monthNumber === 0 ? 'Syntymä - 1 kuukausi' : `${monthNumber}. kuukausi`} 🐶
          {puppyAge && (
            <span className="text-sm font-normal text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Ikä: {puppyAge.ageString}
            </span>
          )}
        </h2>
        <p className="text-gray-600 mb-3">
          {monthNumber === 0 && "Pennun elämä alkaa - ensimmäiset viikot ovat täynnä kasvua ja oppimista"}
          {monthNumber === 1 && "Aktiivinen kasvu ja ensimmäiset sosiaaliset kokemukset"}
          {monthNumber === 2 && "Sosiaalistaminen ja peruskomentoja"}
          {monthNumber === 3 && "Itsenäistyminen ja hihnakävely"}
          {monthNumber > 3 && "Jatkuva oppiminen ja kehittyminen"}
          {puppyAge && currentWeeks > 0 && (
            <span className="block text-sm text-green-600 font-medium mt-1">
              Pentu on {currentWeeks} viikon ikäinen - {
                currentWeeks <= monthNumber * 4 + 4 
                  ? "täydellinen ikä näille aktiviteeteille!" 
                  : "jo vanhempi kuin kuukauden tavoite-ikä"
              } ✨
            </span>
          )}
        </p>
        
        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-chart-joy/10 to-chart-energy/10 p-4 rounded-xl border-l-4 border-chart-joy"
        >
          <p className="text-sm font-medium text-chart-energy">
            {getFunFact(monthNumber)}
          </p>
        </motion.div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'milestones', label: 'Virstanpylväät', icon: CheckCircle },
          { id: 'health', label: 'Terveys', icon: Stethoscope },
          { id: 'social', label: 'Sosiaalistaminen', icon: Users },
          { id: 'weight', label: 'Paino', icon: Scale }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'milestones' && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Kuukauden virstanpylväät ⭐
            </h3>
            {loadingMilestones ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : (
              <>
                {/* Render database milestones first */}
                {dbMilestones.map((milestone) => (
                  <div key={milestone.id} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          milestone.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {milestone.completed && <CheckCircle className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          Tavoite: {milestone.targetWeeks} viikkoa
                        </div>
                        {milestone.completed && (
                          <Badge variant="default" className="mt-2">
                            Saavutettu ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                    {milestone.completed && (
                      <div className="mt-3 pt-3 border-t border-orange-200 bg-green-50 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium">Virstanpylväs saavutettu!</p>
                        <p className="text-xs text-green-600 mt-1">Tämä merkintä on tallennettu aikajanalle</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Render static milestones that haven't been saved yet */}
                {milestones
                  .filter(staticMilestone => !dbMilestones.some(dbMilestone => 
                    staticMilestone.title === dbMilestone.title
                  ))
                  .map((milestone) => (
                    <div key={milestone.id} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            {/* Empty for uncompleted */}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            Tavoite: {milestone.targetWeeks} viikkoa
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <textarea
                          placeholder="Kirjoita muistiinpanoja tästä virstanpylväästä..."
                          className="w-full p-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                          rows={2}
                          value={getEntryData('milestone', milestone.id).notes}
                          onChange={(e) => updateMilestoneEntry(milestone.id, 'notes', e.target.value)}
                        />
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-4">
                            <ImageUploader
                              onImageAdded={(imageUrl) => {
                                const currentImages = getEntryData('milestone', milestone.id).images;
                                updateMilestoneEntry(milestone.id, 'images', [...currentImages, imageUrl]);
                              }}
                              images={getEntryData('milestone', milestone.id).images}
                              onImageRemoved={(imageUrl) => {
                                const currentImages = getEntryData('milestone', milestone.id).images;
                                updateMilestoneEntry(milestone.id, 'images', currentImages.filter(img => img !== imageUrl));
                              }}
                            />
                            <LocationSelector
                              onLocationAdded={(location) => updateMilestoneEntry(milestone.id, 'location', location)}
                              location={getEntryData('milestone', milestone.id).location}
                              onLocationRemoved={() => updateMilestoneEntry(milestone.id, 'location', undefined)}
                            />
                            <TimePicker
                              onTimeAdded={(time) => updateMilestoneEntry(milestone.id, 'time', time)}
                              time={getEntryData('milestone', milestone.id).time}
                              onTimeRemoved={() => updateMilestoneEntry(milestone.id, 'time', undefined)}
                            />
                          </div>
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              onClick={() => saveMilestone(milestone.id, getEntryData('milestone', milestone.id))}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              💾 Tallenna virstanpylväs
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                
                {dbMilestones.length === 0 && milestones.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Ei virstanpylväitä tälle kuukaudelle</p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'health' && (
          <motion.div
            key="health"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Terveys ja hoito 🏥
              </h3>
              <AddHealthRecordDialog bookId={bookId} onHealthRecordAdded={loadHealthRecords}>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Lisää merkintä
                </Button>
              </AddHealthRecordDialog>
            </div>

            {/* Veterinary Guidance */}
            <VeterinaryGuidance 
              ageWeeks={currentWeeks}
              showVaccinationWarning={currentWeeks < 16}
              showDewormingSchedule={currentWeeks <= 12}
              showReactionGuidance={true}
            />
            
            {/* Age-based recommendations */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-600">Ikäkauteen sopivia toimenpiteitä:</h4>
              {getHealthGuidelines(monthNumber).map((item, index) => (
                <Card key={index} className="border-l-4 border-l-blue-200 bg-blue-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          {item.description}
                        </h5>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        Suositus
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* User's actual health records */}
            {userHealthRecords.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-600">Tehdyt merkinnät:</h4>
                {userHealthRecords.map((record) => (
                  <Card key={record.id} className="border-l-4 border-l-green-200 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                             <Badge variant={getTypeBadgeVariant(record.type)}>
                               {getTypeLabel(record.type)}
                             </Badge>
                             <span className="text-sm text-gray-500">
                               {format(new Date(record.entry_date), 'dd.MM.yyyy', { locale: fi })}
                               {record.time && ` klo ${record.time.slice(0, 5)}`}
                             </span>
                           </div>
                           <h5 className="font-medium text-gray-900">{record.description}</h5>
                           
                           {/* Display medication and dosage */}
                           {(record.medication_name || record.dosage) && (
                             <div className="flex items-center gap-4 text-sm text-gray-600">
                               {record.medication_name && (
                                 <span className="flex items-center gap-1">
                                   <Pill className="w-3 h-3" />
                                   {record.medication_name}
                                 </span>
                               )}
                               {record.dosage && (
                                 <span className="text-gray-500">
                                   Annos: {record.dosage}
                                 </span>
                               )}
                             </div>
                           )}
                           
                            {/* Display AEFI information for vaccinations */}
                            {record.type === 'vaccination' && (
                              <div className="space-y-1">
                                {record.vaccine_brand && (
                                  <p className="text-sm text-gray-600">
                                    Rokotteen merkki: {record.vaccine_brand}
                                  </p>
                                )}
                                {record.lot_number && (
                                  <p className="text-sm text-gray-600">
                                    Erä-numero: {record.lot_number}
                                  </p>
                                )}
                                {record.reaction_observed && (
                                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                                    <p className="text-sm text-orange-800 font-medium flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      Rokotusreaktio havaittu (AEFI)
                                    </p>
                                    {record.reaction_description && (
                                      <p className="text-xs text-orange-600 mt-1">
                                        {record.reaction_description}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Display weight */}
                            {record.weight_kg && (
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Weight className="w-3 h-3" />
                                Paino: {record.weight_kg} kg
                              </p>
                            )}
                            
                            {record.veterinarian && (
                              <p className="text-sm text-gray-600">
                                Eläinlääkäri: {record.veterinarian}
                              </p>
                            )}
                            {record.notes && (
                              <p className="text-sm text-gray-600">{record.notes}</p>
                            )}
                         </div>
                         <Button variant="ghost" size="sm">
                           <Edit className="w-4 h-4" />
                         </Button>
                       </div>
                       <div className="mt-3 pt-3 border-t border-green-200">
                         <textarea
                           placeholder="Lisää muistiinpanoja..."
                           className="w-full p-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                           rows={2}
                           value={getEntryData('health', record.id).notes}
                           onChange={(e) => updateHealthEntry(record.id, 'notes', e.target.value)}
                         />
                         <div className="mt-2 space-y-2">
                           <div className="flex items-center gap-4">
                             <ImageUploader
                               onImageAdded={(imageUrl) => {
                                 const currentImages = getEntryData('health', record.id).images;
                                 updateHealthEntry(record.id, 'images', [...currentImages, imageUrl]);
                               }}
                               images={getEntryData('health', record.id).images}
                               onImageRemoved={(imageUrl) => {
                                 const currentImages = getEntryData('health', record.id).images;
                                 updateHealthEntry(record.id, 'images', currentImages.filter(img => img !== imageUrl));
                               }}
                             />
                             <LocationSelector
                               onLocationAdded={(location) => updateHealthEntry(record.id, 'location', location)}
                               location={getEntryData('health', record.id).location}
                               onLocationRemoved={() => updateHealthEntry(record.id, 'location', undefined)}
                             />
                             <TimePicker
                               onTimeAdded={(time) => updateHealthEntry(record.id, 'time', time)}
                               time={getEntryData('health', record.id).time}
                               onTimeRemoved={() => updateHealthEntry(record.id, 'time', undefined)}
                             />
                           </div>
                         </div>
                       </div>
                     </CardContent>
                   </Card>
                ))}
              </div>
            )}

            {userHealthRecords.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-3">Ei vielä terveysmerkintöjä</p>
                  <p className="text-sm text-gray-500">
                    Lisää ensimmäinen merkintä yllä olevalla painikkeella
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Source References */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <SourceBadges categories={['vaccination', 'deworming']} />
            </div>
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Sosiaalistaminen ja ystävät 👥
            </h3>
            
            {/* Kuukausikohtainen sosiaalistamisohje */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">
                    {monthNumber === 0 && "Totuttaminen kotiympäristöön (8-12 viikkoa)"}
                    {monthNumber === 1 && "Laajempi sosiaalistaminen (12-16 viikkoa)"}
                    {monthNumber === 2 && "Syventäminen (4-6 kuukautta)"}
                    {monthNumber >= 3 && "Vahvistaminen ja ylläpito (6+ kuukautta)"}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3">
                    {monthNumber === 0 && "Perheeseen kiinnittyminen ja perusäänet. Keskity turvallisiin kokemuksiin kotona."}
                    {monthNumber === 1 && "Ulkoilut ja uudet ympäristöt. Rokotusten jälkeen laajempi sosiaalistaminen."}
                    {monthNumber === 2 && "Uudet paikat ja pinnat. Monimuotoisia kokemuksia hallitusti."}
                    {monthNumber >= 3 && "Monimuotoiset tilanteet ja eroahdistuksen ehkäisy. Säännöllinen ylläpito."}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {monthNumber === 0 && "3-5 kertaa/päivä, 5-10 min"}
                      {monthNumber === 1 && "Päivittäin 10-15 min"}
                      {monthNumber === 2 && "4-5 kertaa/vko, 15-20 min"}
                      {monthNumber >= 3 && "Päivittäin 20-30 min"}
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-700 text-sm font-medium">⚠️ Varoituksia:</p>
                    <p className="text-yellow-600 text-xs mt-1">
                      {monthNumber === 0 && "Vältä koirapuistoja ennen rokotuksia. Jos pelkää, lopeta heti."}
                      {monthNumber === 1 && "Valvo kohtaamisia. Valitse rauhalliset koirat."}
                      {monthNumber === 2 && "Tarkkaile väsymystä. Pennut tarvitsevat lepoa."}
                      {monthNumber >= 3 && "Hormonimuutokset voivat vaikuttaa - ole kärsivällinen."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sosiaalistamistehtävät */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Kuukauden sosiaalistamistehtävät 📝</h4>
              <div className="space-y-3">
                 {getSocializationTasks(monthNumber).map((task, index) => {
                   const taskId = `task-${monthNumber}-${index}`;
                   return (
                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                       <input 
                         type="checkbox" 
                         className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                         checked={completedTasks[taskId] || false}
                         onChange={() => toggleTask(taskId)}
                       />
                       <div className="flex-1">
                         <p className={`text-sm ${completedTasks[taskId] ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                           {task}
                         </p>
                       </div>
                     </div>
                   );
                 })}
              </div>
              
              {/* Lisää oma tehtävä */}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-3">Lisää oma sosiaalistamistehtävä</h5>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Esim. Tapaa naapurin koira..."
                    className="flex-1 p-2 text-sm border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
                  />
                  <button
                    onClick={addCustomTask}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Lisää
                  </button>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Viikoittainen tavoite:</h5>
                <p className="text-blue-700 text-sm">
                  {monthNumber === 0 && "1-2 uutta ihmistä, tutut äänet ja pinnat"}
                  {monthNumber === 1 && "2-3 uutta kokemusta, ensimmäiset kontaktit koirien kanssa"}
                  {monthNumber === 2 && "Uusia paikkoja ja pintoja, eläinkontaktit"}
                  {monthNumber >= 3 && "Viikoittain uusia haasteita, ylläpito"}
                </p>
              </div>
            </div>

            {/* Sosiaalistamismuistiinpanot */}
            <div className="bg-pink-50 rounded-xl p-6 border border-pink-100">
              <h4 className="font-semibold text-gray-800 mb-3">Tämän kuukauden kokemukset 📖</h4>
              <textarea
                placeholder="Kirjoita tähän kuukauden sosiaalistamiskokemuksia: Kenen kanssa pentu leikki? Mitkä tilanteet menivät hyvin? Mihin tarvitaan vielä harjoitusta?"
                className="w-full p-3 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                rows={4}
                value={getEntryData('social', `month-${monthNumber}`).notes}
                onChange={(e) => updateSocialEntry(`month-${monthNumber}`, 'notes', e.target.value)}
              />
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-4">
                  <ImageUploader
                    onImageAdded={(imageUrl) => {
                      const currentImages = getEntryData('social', `month-${monthNumber}`).images;
                      updateSocialEntry(`month-${monthNumber}`, 'images', [...currentImages, imageUrl]);
                    }}
                    images={getEntryData('social', `month-${monthNumber}`).images}
                    onImageRemoved={(imageUrl) => {
                      const currentImages = getEntryData('social', `month-${monthNumber}`).images;
                      updateSocialEntry(`month-${monthNumber}`, 'images', currentImages.filter(img => img !== imageUrl));
                    }}
                  />
                  <LocationSelector
                    onLocationAdded={(location) => updateSocialEntry(`month-${monthNumber}`, 'location', location)}
                    location={getEntryData('social', `month-${monthNumber}`).location}
                    onLocationRemoved={() => updateSocialEntry(`month-${monthNumber}`, 'location', undefined)}
                  />
                  <TimePicker
                    onTimeAdded={(time) => updateSocialEntry(`month-${monthNumber}`, 'time', time)}
                    time={getEntryData('social', `month-${monthNumber}`).time}
                    onTimeRemoved={() => updateSocialEntry(`month-${monthNumber}`, 'time', undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Ystävärekisteri */}
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
              <h4 className="font-semibold text-gray-800 mb-3">Ystävärekisteri 💕</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center text-purple-600 hover:border-purple-400 hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <span className="block font-medium text-sm">Lisää koirakaveri</span>
                  <span className="text-xs">Nimi, rotu, mitä leikittiin</span>
                </button>
                <button className="border-2 border-dashed border-purple-300 rounded-xl p-4 text-center text-purple-600 hover:border-purple-400 hover:bg-purple-100 transition-colors">
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <span className="block font-medium text-sm">Lisää ihmisystävä</span>
                  <span className="text-xs">Kuka, missä tavattiin</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'weight' && (
          <motion.div
            key="weight"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Painonseuranta 📊
            </h3>
            
            {/* Kuukauden painotiedot */}
            {weightEntries && weightEntries.length > 0 ? (
              <div className="space-y-4">
                {/* Tilastokortit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Scale className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-700">Viimeisin paino</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {weightEntries[weightEntries.length - 1]?.weight} kg
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-700">Kasvu yhteensä</p>
                          <p className="text-2xl font-bold text-green-800">
                            {weightEntries.length > 1 
                              ? `+${(weightEntries[weightEntries.length - 1]?.weight - weightEntries[0]?.weight).toFixed(1)} kg`
                              : 'Ei tietoa'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-orange-600" />
                        <div>
                          <p className="text-sm font-medium text-orange-700">Mittauksia</p>
                          <p className="text-2xl font-bold text-orange-800">
                            {weightEntries.length} kpl
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Kuukauden painomittaukset */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Kuukauden mittaukset</h4>
                    <div className="space-y-2">
                      {weightEntries
                        .filter(entry => {
                          if (!birthDate) return true;
                          const entryDate = new Date(entry.date);
                          const birthDateObj = new Date(birthDate);
                          const ageInWeeks = Math.floor((entryDate.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 7));
                          const monthStart = monthNumber * 4;
                          const monthEnd = (monthNumber + 1) * 4;
                          return ageInWeeks >= monthStart && ageInWeeks < monthEnd;
                        })
                        .slice(-5) // Näytä viimeisimmät 5 mittausta
                        .map((entry, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Scale className="w-4 h-4 text-blue-500" />
                              <div>
                                <p className="font-medium text-gray-800">{entry.weight} kg</p>
                                <p className="text-sm text-gray-500">
                                  {new Date(entry.date).toLocaleDateString('fi-FI')}
                                </p>
                              </div>
                            </div>
                            {index > 0 && (
                              <div className="text-sm text-gray-500">
                                {(() => {
                                  const previousWeight = weightEntries[index - 1]?.weight;
                                  const change = entry.weight - previousWeight;
                                  return change > 0 
                                    ? `+${change.toFixed(1)} kg` 
                                    : `${change.toFixed(1)} kg`;
                                })()}
                              </div>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>

                {/* Painoseurannan vinkki */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Scale className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-800 mb-1">💡 Painonseurannan vinkki</h5>
                        <p className="text-sm text-blue-700">
                          Säännöllinen punnitseminen auttaa huomaamaan kasvun muutokset ajoissa. 
                          Kaikki painonseuranta-sivulla lisäämäsi mittaukset näkyvät automaattisesti myös täällä pentukirjassa!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Ei painotietoja */
              <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-8 text-center">
                  <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-500 mb-2">
                    Ei vielä painomittauksia
                  </h4>
                  <p className="text-gray-400 mb-4">
                    Aloita pennun painonseuranta lisäämällä ensimmäinen mittaus painonseuranta-sivulla
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      💡 Siirry painonseurantaan
                    </Badge>
                    <span className="text-sm text-gray-500">tai</span>
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      🔗 Yhdistä koira pentukirjaan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kuukausikohtaiset painon odotusarvot */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h5 className="font-medium text-green-800 mb-3">Kuukauden painokehitys</h5>
                <div className="space-y-2 text-sm text-green-700">
                  {monthNumber === 0 && (
                    <>
                      <p>• Syntymäpaino: 150-600g (rodusta riippuen)</p>
                      <p>• 1 viikko: kaksinkertainen syntymäpaino</p>
                      <p>• 1 kuukausi: 4-6x syntymäpaino</p>
                    </>
                  )}
                  {monthNumber === 1 && (
                    <>
                      <p>• Nopea kasvu: 100-200g viikossa</p>
                      <p>• Paino noin 2-4 kg (pienistä suuriin rotuihin)</p>
                      <p>• Ensimmäinen rokotus: punnitseminen tärkeää</p>
                    </>
                  )}
                  {monthNumber === 2 && (
                    <>
                      <p>• Jatkuva kasvu: 150-300g viikossa</p>
                      <p>• Paino noin 4-8 kg riippuen rodusta</p>
                      <p>• Toinen rokotus: seuraa painon kehitystä</p>
                    </>
                  )}
                  {monthNumber === 3 && (
                    <>
                      <p>• Hidastuva kasvu: 100-250g viikossa</p>
                      <p>• Paino noin 6-12 kg riippuen rodusta</p>
                      <p>• Aikuispainon arviointi mahdollista</p>
                    </>
                  )}
                  {monthNumber >= 4 && (
                    <>
                      <p>• Tasaantuva kasvu: noin {monthNumber < 8 ? '100-200g' : '50-150g'} viikossa</p>
                      <p>• Paino lähestyy aikuispainoa</p>
                      <p>• Seuraa kasvukäyriä säännöllisesti</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonthlyContent;