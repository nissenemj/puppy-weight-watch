import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, parseISO, subDays, subWeeks, subMonths } from 'date-fns'
import { Calendar, TrendingUp, Target, Award, Brain, Activity } from 'lucide-react'
import type { WeightEntry } from '@/services/weightService'
import { calculateGrowthPrediction, estimateBreedCategory, getGrowthPhaseColor } from '@/utils/growthPrediction'
import GrowthPredictionPanel from '@/components/GrowthPredictionPanel'

interface WeightChartProps {
  weightData: WeightEntry[]
  birthDate?: Date
  breed?: string
}

interface ChartDataPoint {
  date: string
  timestamp: number
  dateFormatted: string
  actualWeight: number
  avgGrowthLine: number
  milestone?: string
  upperBound?: number
  lowerBound?: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
    payload: ChartDataPoint
  }>
  label?: string | number
}

type TimeRange = '1m' | '3m' | '6m' | '1y' | 'all'

const TIME_RANGES = {
  '1m': { label: '1 kuukausi', days: 30 },
  '3m': { label: '3 kuukautta', days: 90 },
  '6m': { label: '6 kuukautta', days: 180 },
  '1y': { label: '1 vuosi', days: 365 },
  'all': { label: 'Kaikki', days: 0 }
}

export default function EnhancedWeightChart({ weightData, birthDate, breed }: WeightChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('3m')

  // Calculate puppy birth date if not provided (estimate from first entry)
  const estimatedBirthDate = useMemo(() => {
    if (birthDate) return birthDate
    if (weightData.length === 0) return new Date()

    // Estimate birth date assuming first measurement at ~8 weeks old
    const firstEntry = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
    const estimatedBirth = new Date(firstEntry.date)
    estimatedBirth.setDate(estimatedBirth.getDate() - 56) // Subtract 8 weeks
    return estimatedBirth
  }, [birthDate, weightData])

  // Filter data based on time range
  const filterDataByTimeRange = (data: WeightEntry[], range: TimeRange) => {
    if (range === 'all') return data

    const cutoffDate = new Date()
    switch (range) {
      case '1m': cutoffDate.setMonth(cutoffDate.getMonth() - 1); break
      case '3m': cutoffDate.setMonth(cutoffDate.getMonth() - 3); break
      case '6m': cutoffDate.setMonth(cutoffDate.getMonth() - 6); break
      case '1y': cutoffDate.setFullYear(cutoffDate.getFullYear() - 1); break
    }

    return data.filter(entry => new Date(entry.date) >= cutoffDate)
  }

  const filteredData = filterDataByTimeRange(weightData, timeRange)
  const sortedData = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate current age in months
  const currentAgeMonths = useMemo(() => {
    if (sortedData.length === 0) return 0
    const lastEntry = sortedData[sortedData.length - 1]
    const ageMs = new Date(lastEntry.date).getTime() - estimatedBirthDate.getTime()
    return Math.floor(ageMs / (1000 * 60 * 60 * 24 * 30.44))
  }, [sortedData, estimatedBirthDate])

  // Estimate breed category if not specified
  const breedCategory = useMemo(() => {
    if (sortedData.length === 0) return undefined
    const lastEntry = sortedData[sortedData.length - 1]
    const ageWeeks = (new Date(lastEntry.date).getTime() - estimatedBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    return estimateBreedCategory(lastEntry.weight, ageWeeks)
  }, [sortedData, estimatedBirthDate])

  // Calculate growth prediction using Gompertz model (or veterinary fallback)
  const growthPrediction = useMemo(() => {
    if (sortedData.length < 2) return null
    return calculateGrowthPrediction(sortedData, estimatedBirthDate, breedCategory)
  }, [sortedData, estimatedBirthDate, breedCategory])

  // Calculate weekly growth rate from prediction
  const weeklyGrowth = growthPrediction?.currentWeeklyGrowthRate || 0.42

  // Add milestones based on weight ranges
  const getMilestone = (weight: number): string | undefined => {
    if (weight >= 1 && weight < 2) return "Ensimmäinen kuukausi"
    if (weight >= 5 && weight < 7) return "Rokotusikä"
    if (weight >= 10 && weight < 12) return "Hihnakävelyikä"
    if (weight >= 15 && weight < 18) return "Nuoruuskasvupiikki"
    return undefined
  }

  // Create enhanced chart data including predictions
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!growthPrediction) {
      // Fallback to simple linear if no prediction available
      return sortedData.map((entry) => {
        const entryDate = parseISO(entry.date)
        return {
          date: entry.date,
          timestamp: entryDate.getTime(),
          dateFormatted: format(entryDate, 'dd.MM'),
          actualWeight: entry.weight,
          avgGrowthLine: entry.weight, // Simple line
          milestone: getMilestone(entry.weight)
        }
      })
    }

    // Map prediction data to chart format
    const allData: ChartDataPoint[] = []

    // Add actual measurements
    growthPrediction.predictions.forEach(point => {
      if (!point.isPrediction) {
        const entryDate = parseISO(point.date)
        allData.push({
          date: point.date,
          timestamp: entryDate.getTime(),
          dateFormatted: format(entryDate, 'dd.MM'),
          actualWeight: point.weight,
          avgGrowthLine: 0,
          milestone: getMilestone(point.weight)
        })
      }
    })

    // Add predicted values (only showing next 3 months)
    const futureLimit = new Date()
    futureLimit.setMonth(futureLimit.getMonth() + 3)

    growthPrediction.predictions.forEach(point => {
      if (point.isPrediction && new Date(point.date) <= futureLimit) {
        const entryDate = parseISO(point.date)
        const existing = allData.find(d => d.date === point.date)
        if (existing) {
          existing.avgGrowthLine = point.weight
        } else {
          allData.push({
            date: point.date,
            timestamp: entryDate.getTime(),
            dateFormatted: format(entryDate, 'dd.MM'),
            actualWeight: 0,
            avgGrowthLine: point.weight,
            milestone: undefined
          })
        }
      }
    })

    return allData.sort((a, b) => a.timestamp - b.timestamp)
  }, [growthPrediction, sortedData])

  // Calculate chart domain for Y-axis
  const allWeights = chartData
    .map(d => [d.actualWeight, d.avgGrowthLine, d.upperBound, d.lowerBound])
    .flat()
    .filter((w): w is number => typeof w === 'number' && !isNaN(w) && w > 0)
  const minWeight = allWeights.length > 0 ? Math.max(0, Math.min(...allWeights) - 0.5) : 0
  const maxWeight = allWeights.length > 0 ? Math.max(...allWeights) + 0.5 : 10
  const yAxisDomain = [minWeight, maxWeight]

  // Calculate insights
  const totalGrowth = sortedData.length > 1 ? sortedData[sortedData.length - 1].weight - sortedData[0].weight : 0
  const avgWeight = sortedData.reduce((sum, entry) => sum + entry.weight, 0) / sortedData.length
  const recentTrend = growthPrediction?.currentWeeklyGrowthRate ||
    (sortedData.length >= 3 ? (sortedData[sortedData.length - 1].weight - sortedData[sortedData.length - 3].weight) / 2 : 0)

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-border rounded-xl shadow-lg">
          <p className="font-semibold text-foreground mb-2">
            {format(new Date(Number(label)), 'dd.MM.yyyy')}
          </p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value.toFixed(1)} kg</span>
            </div>
          ))}
          {data.milestone && (
            <div className="mt-2 p-2 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">{data.milestone}</span>
              </div>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  if (weightData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Interaktiivinen Kasvukäyrä
          </CardTitle>
          <CardDescription>Pentusi painon kehitys ajan myötä</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Aloita painonseuranta</p>
            <p className="text-sm">Lisää ensimmäinen painomittaus nähdäksesi kasvukäyrän</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Älykäs Kasvukäyrä & Ennuste
            </CardTitle>
            <CardDescription>
              Polynomiregressio-pohjainen ennuste {growthPrediction ? `(R² ${(growthPrediction.r2 * 100).toFixed(0)}%)` : ''}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              Kasvu: {totalGrowth.toFixed(1)} kg
            </Badge>
            <Badge variant="outline" className="bg-gradient-to-r from-secondary/10 to-secondary/20 border-secondary/30">
              <Target className="h-3 w-3 mr-1" />
              Keskiarvo: {avgWeight.toFixed(1)} kg
            </Badge>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2 pt-4">
          {Object.entries(TIME_RANGES).map(([key, range]) => (
            <Button
              key={key}
              variant={timeRange === key ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(key as TimeRange)}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Enhanced Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground))" 
                opacity={0.2} 
              />
              <XAxis 
                dataKey="timestamp" 
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => format(new Date(value), 'dd.MM')}
                fontSize={11}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                fontSize={11}
                domain={yAxisDomain}
                tickFormatter={(value) => `${Number(value).toFixed(1)} kg`}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '15px'
                }}
              />

              {/* Confidence interval area (if available) */}
              {growthPrediction && chartData.some((d) => d.upperBound) && (
                <>
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stackId="1"
                    stroke="none"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                    name="Luotettavuusväli"
                  />
                  <Area
                    type="monotone"
                    dataKey="lowerBound"
                    stackId="2"
                    stroke="none"
                    fill="hsl(var(--background))"
                    fillOpacity={1}
                  />
                </>
              )}

              {/* Actual weight line with gradient */}
              <Line
                type="monotone"
                dataKey="actualWeight"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                name="Mitattu paino"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: 'hsl(var(--primary))', stroke: 'white', strokeWidth: 2 }}
                connectNulls={false}
              />

              {/* Predicted growth line */}
              <Line
                type="monotone"
                dataKey="avgGrowthLine"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                strokeDasharray="8 4"
                name={growthPrediction ? "Ennuste (polynomiregressio)" : "Kasvutrendi"}
                dot={false}
                activeDot={{ r: 5, fill: 'hsl(var(--secondary))' }}
                connectNulls={true}
              />

              {/* Add reference lines for milestones */}
              {chartData.some(d => d.milestone) && (
                <ReferenceLine 
                  y={15} 
                  stroke="hsl(var(--accent))" 
                  strokeDasharray="4 4" 
                  opacity={0.5}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* Growth Prediction Panel */}
        {growthPrediction && (
          <div className="mt-6">
            <GrowthPredictionPanel
              prediction={growthPrediction}
              currentWeight={sortedData[sortedData.length - 1]?.weight || 0}
              currentAgeMonths={currentAgeMonths}
              breedCategory={breedCategory?.category}
            />
          </div>
        )}

        {/* Enhanced Insights Panel */}
        {!growthPrediction && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-primary/10">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Kasvuanalyysi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Kokonaiskasvu</div>
                  <div className="font-bold text-lg text-primary">{totalGrowth.toFixed(1)} kg</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Keskipaino</div>
                  <div className="font-bold text-lg text-secondary">{avgWeight.toFixed(1)} kg</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Mittauksia</div>
                  <div className="font-bold text-lg text-accent">{sortedData.length} kpl</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Lisää vähintään 2 mittausta nähdäksesi ennusteen
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}