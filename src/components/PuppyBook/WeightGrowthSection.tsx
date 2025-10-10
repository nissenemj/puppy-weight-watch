import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingUp, Calendar, Info, ExternalLink } from '@/utils/iconImports';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { WeightEntry } from '@/services/weightService';
import GrowthChart from './GrowthChart';
import WeightChart from '@/components/WeightChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface WeightGrowthSectionProps {
  bookId: string;
  birthDate?: string;
}

interface WeightPoint {
  age_weeks: number;
  weight_kg: number;
  date: string;
}

const WeightGrowthSection: React.FC<WeightGrowthSectionProps> = ({ 
  bookId, 
  birthDate 
}) => {
  const [loading, setLoading] = useState(true);
  const [weightPoints, setWeightPoints] = useState<WeightPoint[]>([]);
  const [dogId, setDogId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Hae käyttäjän painomittaukset
  const { data: weightEntries, error: weightError } = useWeightEntries(
    userId || '', 
    dogId || undefined
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        // Hae käyttäjän tiedot
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);

        // Hae pentukirjaan liittyvä koira
        const { data: book, error: bookError } = await supabase
          .from('puppy_books')
          .select('dog_id')
          .eq('id', bookId)
          .single();

        if (bookError) {
          console.error('Error loading book:', bookError);
          setLoading(false);
          return;
        }

        if (book?.dog_id) {
          setDogId(book.dog_id);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Virhe",
          description: "Tietojen lataaminen epäonnistui",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookId, toast]);

  // Muunna painomittaukset kasvukäyrää varten
  useEffect(() => {
    if (weightEntries && birthDate) {
      const birthDateObj = new Date(birthDate);
      const points: WeightPoint[] = weightEntries.map((entry: WeightEntry) => {
        const entryDate = new Date(entry.date);
        const ageInWeeks = Math.floor((entryDate.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 7));
        
        return {
          age_weeks: Math.max(0, ageInWeeks), // Varmista että ikä ei ole negatiivinen
          weight_kg: entry.weight,
          date: entry.date
        };
      });

      setWeightPoints(points.sort((a, b) => a.age_weeks - b.age_weeks));
      
      // Debug logging
      console.log('WeightGrowthSection - birthDate:', birthDate);
      console.log('WeightGrowthSection - dogId:', dogId);
      console.log('WeightGrowthSection - weightEntries:', weightEntries);
      console.log('WeightGrowthSection - converted weightPoints:', points);
    }
  }, [weightEntries, birthDate, dogId]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (weightError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Virhe painotietojen lataamisessa. Yritä myöhemmin uudelleen.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const latestWeight = weightPoints.length > 0 ? weightPoints[weightPoints.length - 1] : null;
  const totalGrowth = weightPoints.length > 1 ? 
    weightPoints[weightPoints.length - 1].weight_kg - weightPoints[0].weight_kg : 0;

  return (
    <div className="space-y-6">
      {/* Header ja tilastot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-sans font-bold text-gray-800 mb-2 flex items-center gap-3">
              <Scale className="w-8 h-8 text-orange-500" />
              Kasvuseuranta 📊
            </h2>
            <p className="text-gray-600">
              Seuraa pennun kasvua ja painonkehitystä
            </p>
          </div>
        </div>

        {/* Tilastokortit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Nykyinen paino
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-orange-600">
                {latestWeight ? `${latestWeight.weight_kg} kg` : 'Ei tietoa'}
              </div>
              {latestWeight && (
                <p className="text-xs text-gray-500 mt-1">
                  {latestWeight.age_weeks} viikon ikäisenä
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Kokonaiskasvu
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-600">
                {totalGrowth > 0 ? `+${totalGrowth.toFixed(1)} kg` : 'Ei tietoa'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Syntymästä tähän päivään
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Mittauksia
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-600">
                {weightPoints.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tallennettua painomittausta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Infolaatikko ja painonseuranta-linkki */}
        <div className="space-y-4 mb-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Vinkki:</strong> Painotiedot haetaan automaattisesti painonseuranta-sivulta. 
              Kaikki lisäämäsi painomittaukset näkyvät myös täällä pentukirjassa! 
              {!dogId && " Yhdistä koira pentukirjaasi nähdäksesi painotiedot."}
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center">
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link to="/weight-tracker" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Avaa painonseuranta
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Kasvukäyrä */}
      {weightPoints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GrowthChart weightPoints={weightPoints} />
        </motion.div>
      )}

      {/* Painokehityksen käyrä */}
      {weightEntries && weightEntries.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <WeightChart weightData={weightEntries} />
        </motion.div>
      )}

      {/* Jos ei painotietoja */}
      {weightPoints.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 text-center"
        >
          <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2">
            Ei vielä painomittauksia
          </h3>
          <p className="text-gray-400 mb-6">
            Aloita pennun painonseuranta lisäämällä ensimmäinen mittaus
          </p>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link to="/weight-tracker" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Siirry painonseurantaan
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default WeightGrowthSection;