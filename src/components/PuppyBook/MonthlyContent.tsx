import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';

interface MonthlyContentProps {
  monthNumber: number;
  bookId: string;
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

interface SocialEvent {
  date: string;
  type: 'friend' | 'training' | 'experience';
  title: string;
  description: string;
  photos?: string[];
}

const MonthlyContent: React.FC<MonthlyContentProps> = ({ monthNumber, bookId }) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'health' | 'social'>('milestones');
  
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
      ]
    };

    return healthByMonth[month as keyof typeof healthByMonth] || [];
  };

  const getSocializationTasks = (month: number): string[] => {
    const tasksByMonth = {
      0: [
        "Esittele perheenjäseniä (aikuiset, lapset)",
        "Totuta ääniä (ovikello, TV, imuri)",
        "Lyhyitä kantokävelyjä turvallisilla alueilla",
        "Tapaa 1-2 uutta ihmistä viikossa",
        "Käytä nameja positiiviseen assosiaatioon"
      ],
      1: [
        "Ensimmäiset kävelyt taluttimessa (rokotusten jälkeen)",
        "Tapaa rauhallisia aikuisia koiria",
        "Totuta liikenneääniä, autoja, pyöriä",
        "Osallistu pentukursseille (1-2 kertaa/vko)",
        "Kohtaa erilaisia ihmisiä (miehet, naiset, lapset)"
      ],
      2: [
        "Vie kauppoihin (lemmikkiystävällisiin)",
        "Autolla ajelu",
        "Totuta erilaisiin pintoihin (ruoho, hiekka, lumi)",
        "Järjestä leikkitreffejä samanikäisten kanssa",
        "Esittele eläimiä (kissat, linnut) etäältä"
      ],
      3: [
        "Käy julkisilla paikoilla (kahvilat, markkinat)",
        "Totuta yksinoloon (lyhyet ajat)",
        "Jatka koiratapaamisia, opeta rajat",
        "Harjoittele erilaisia ääniä (ukkonen, ilmahälyttimet)",
        "Osallistu harrastuksiin (agility, tottelevaisuus)"
      ]
    };

    return tasksByMonth[month as keyof typeof tasksByMonth] || [
      "Jatka sosiaalistamista uusissa ympäristöissä",
      "Säännölliset kohtaamiset muiden koirien kanssa",
      "Harjoittele erilaisia tilanteita"
    ];
  };

  const milestones = getMonthlyMilestones(monthNumber);
  const healthRecords = getHealthGuidelines(monthNumber);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-sans font-bold text-gray-800 mb-2 flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-500" />
          {monthNumber === 0 ? 'Syntymä - 1 kuukausi' : `${monthNumber}. kuukausi`} 🐶
        </h2>
        <p className="text-gray-600">
          {monthNumber === 0 && "Pennun elämä alkaa - ensimmäiset viikot ovat täynnä kasvua ja oppimista"}
          {monthNumber === 1 && "Aktiivinen kasvu ja ensimmäiset sosiaaliset kokemukset"}
          {monthNumber === 2 && "Sosiaalistaminen ja peruskomentoja"}
          {monthNumber === 3 && "Itsenäistyminen ja hihnakävely"}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
        {[
          { id: 'milestones', label: 'Virstanpylväät', icon: CheckCircle },
          { id: 'health', label: 'Terveys', icon: Stethoscope },
          { id: 'social', label: 'Sosiaalistaminen', icon: Users }
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
            {milestones.map((milestone) => (
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
                  </div>
                  <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-orange-200">
                  <textarea
                    placeholder="Kirjoita muistiinpanoja tästä virstanpylväästä..."
                    className="w-full p-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                    rows={2}
                  />
                  <div className="mt-2 flex items-center gap-2">
                    <button className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700">
                      <Camera className="w-3 h-3" />
                      Lisää kuva
                    </button>
                    <button className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700">
                      <MapPin className="w-3 h-3" />
                      Lisää sijainti
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Terveys ja hoito 🏥
            </h3>
            {healthRecords.map((record, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.type === 'vaccination' ? 'bg-blue-100 text-blue-600' :
                      record.type === 'deworming' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <Stethoscope className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{record.description}</h4>
                    {record.notes && (
                      <p className="text-gray-600 text-sm mt-1">{record.notes}</p>
                    )}
                    <div className="mt-3 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Päivämäärä</label>
                        <input
                          type="date"
                          className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Eläinlääkäri</label>
                        <input
                          type="text"
                          placeholder="Dr. Koiraystävä"
                          className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs text-gray-500 mb-1">Muistiinpanot</label>
                      <textarea
                        placeholder="Miten hoito meni? Erityisiä huomioita?"
                        className="w-full p-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                {getSocializationTasks(monthNumber).map((task, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <p className="text-gray-800 text-sm">{task}</p>
                    </div>
                  </div>
                ))}
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
              />
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                  <Camera className="w-3 h-3" />
                  Lisää kuvia
                </button>
                <button className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                  <Heart className="w-3 h-3" />
                  Merkitse suosikki
                </button>
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
      </AnimatePresence>
    </div>
  );
};

export default MonthlyContent;