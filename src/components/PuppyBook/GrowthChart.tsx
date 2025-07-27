import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { SizeClass, CentilePoint } from '@/types/veterinary';

interface WeightPoint {
  age_weeks: number;
  weight_kg: number;
  date: string;
}

interface GrowthChartProps {
  weightPoints: WeightPoint[];
  initialSizeClass?: SizeClass;
}

const SIZE_CLASS_LABELS = {
  toy_small: 'Pieni/Toy (2-10kg)',
  medium: 'Keskikokoinen (10-25kg)', 
  large_giant: 'Suuri/Jättiläinen (25-70kg+)'
};

const GrowthChart: React.FC<GrowthChartProps> = ({ 
  weightPoints, 
  initialSizeClass = 'medium' 
}) => {
  const [sizeClass, setSizeClass] = useState<SizeClass>(initialSizeClass);
  const [centiles, setCentiles] = useState<CentilePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchCentiles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('growth_centiles')
          .select('*')
          .eq('size_class', sizeClass)
          .order('age_weeks');

        if (error) throw error;
        setCentiles(data || []);
      } catch (error) {
        console.error('Error fetching centiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCentiles();
  }, [sizeClass]);

  // Check for concerning weight changes
  useEffect(() => {
    if (weightPoints.length < 2 || centiles.length === 0) return;

    const checkCentileCrossing = () => {
      const latest = weightPoints[weightPoints.length - 1];
      const previous = weightPoints[weightPoints.length - 2];

      const getPercentile = (weight: number, ageWeeks: number) => {
        const centile = centiles.find(c => Math.abs(c.age_weeks - ageWeeks) <= 2);
        if (!centile) return null;

        if (weight <= centile.p3) return 3;
        if (weight <= centile.p10) return 10;
        if (weight <= centile.p50) return 50;
        if (weight <= centile.p90) return 90;
        return 97;
      };

      const latestPercentile = getPercentile(latest.weight_kg, latest.age_weeks);
      const previousPercentile = getPercentile(previous.weight_kg, previous.age_weeks);

      if (latestPercentile && previousPercentile) {
        const change = Math.abs(latestPercentile - previousPercentile);
        if (change >= 25) {
          setWarning(`Huomio: Paino on siirtynyt ${change} prosenttiyksikköä centile-viivojen välillä. Keskustele eläinlääkärin kanssa.`);
        } else {
          setWarning(null);
        }
      }
    };

    checkCentileCrossing();
  }, [weightPoints, centiles]);

  // Merge centile data with weight points for chart
  const chartData = centiles.map(centile => {
    const userWeight = weightPoints.find(point => 
      Math.abs(point.age_weeks - centile.age_weeks) <= 1
    );
    
    return {
      age_weeks: centile.age_weeks,
      p3: centile.p3,
      p10: centile.p10,
      p50: centile.p50,
      p90: centile.p90,
      p97: centile.p97,
      user_weight: userWeight?.weight_kg || null
    };
  });

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Ladataan kasvukäyrää...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Kasvukäyrä
          <Select value={sizeClass} onValueChange={(value: SizeClass) => setSizeClass(value)}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SIZE_CLASS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {warning && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}
        
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="age_weeks" 
                tickFormatter={(weeks) => `${weeks} vk`}
              />
              <YAxis 
                tickFormatter={(kg) => `${kg} kg`}
              />
              <Tooltip 
                labelFormatter={(weeks) => `Ikä: ${weeks} viikkoa`}
                formatter={(value: any, name: string) => {
                  const formatters: Record<string, string> = {
                    p3: '3. persentili',
                    p10: '10. persentili', 
                    p50: '50. persentili (keskiarvo)',
                    p90: '90. persentili',
                    p97: '97. persentili',
                    user_weight: 'Pennun paino'
                  };
                  return [`${value} kg`, formatters[name] || name];
                }}
              />
              
              {/* Centile bands */}
              <Area 
                type="monotone" 
                dataKey="p97" 
                stackId="1"
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.3}
                fill="hsl(var(--muted))" 
                fillOpacity={0.1} 
              />
              <Area 
                type="monotone" 
                dataKey="p90" 
                stackId="2"
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.4}
                fill="hsl(var(--muted))" 
                fillOpacity={0.15} 
              />
              <Area 
                type="monotone" 
                dataKey="p50" 
                stackId="3"
                stroke="hsl(var(--primary))" 
                strokeOpacity={0.6}
                fill="hsl(var(--primary))" 
                fillOpacity={0.1} 
              />
              <Area 
                type="monotone" 
                dataKey="p10" 
                stackId="4"
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.4}
                fill="hsl(var(--muted))" 
                fillOpacity={0.15} 
              />
              <Area 
                type="monotone" 
                dataKey="p3" 
                stackId="5"
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.3}
                fill="hsl(var(--muted))" 
                fillOpacity={0.1} 
              />
              
              {/* User weight line */}
              <Area 
                type="monotone" 
                dataKey="user_weight" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={3}
                fill="hsl(var(--destructive))" 
                fillOpacity={0.2}
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Viitearvo: Waltham Puppy Growth Charts. Huomio: Jos paino ylittää tai alittaa useita centile-viivoja, ota yhteyttä eläinlääkäriin.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrowthChart;