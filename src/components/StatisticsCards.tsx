
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Scale, TrendingUp, Calendar, Target } from 'lucide-react'
import { format, differenceInDays, subWeeks } from 'date-fns'
import { fi } from 'date-fns/locale'
import type { WeightEntry } from '@/services/weightService'

interface StatisticsCardsProps {
  entries: WeightEntry[]
}

export default function StatisticsCards({ entries }: StatisticsCardsProps) {
  const calculateStats = () => {
    if (entries.length === 0) {
      return {
        currentWeight: 0,
        weightChange: 0,
        totalEntries: 0,
        weeklyGrowthRate: 0,
        growthTrend: 'stable' as 'accelerating' | 'stable' | 'slowing',
        lastMeasurement: null,
        averageWeeklyGrowth: 0
      }
    }

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight
    const lastMeasurement = sortedEntries[sortedEntries.length - 1].date

    let weightChange = 0
    if (sortedEntries.length > 1) {
      const previousWeight = sortedEntries[sortedEntries.length - 2].weight
      weightChange = currentWeight - previousWeight
    }

    // Calculate weekly growth rates for trend analysis
    const weeklyGrowthRates = []
    for (let i = 1; i < sortedEntries.length; i++) {
      const current = sortedEntries[i]
      const previous = sortedEntries[i - 1]
      const daysDiff = differenceInDays(new Date(current.date), new Date(previous.date))
      
      if (daysDiff > 0) {
        const dailyGrowth = (current.weight - previous.weight) / daysDiff
        const weeklyGrowth = dailyGrowth * 7
        weeklyGrowthRates.push(weeklyGrowth)
      }
    }

    const averageWeeklyGrowth = weeklyGrowthRates.length > 0 
      ? weeklyGrowthRates.reduce((sum, rate) => sum + rate, 0) / weeklyGrowthRates.length 
      : 0

    // Determine growth trend by comparing recent vs older growth rates
    let growthTrend: 'accelerating' | 'stable' | 'slowing' = 'stable'
    if (weeklyGrowthRates.length >= 4) {
      const recentRates = weeklyGrowthRates.slice(-2)
      const olderRates = weeklyGrowthRates.slice(-4, -2)
      
      const recentAvg = recentRates.reduce((sum, rate) => sum + rate, 0) / recentRates.length
      const olderAvg = olderRates.reduce((sum, rate) => sum + rate, 0) / olderRates.length
      
      const changeDiff = recentAvg - olderAvg
      if (Math.abs(changeDiff) > 0.05) { // 50g per week threshold
        growthTrend = changeDiff > 0 ? 'accelerating' : 'slowing'
      }
    }

    return {
      currentWeight,
      weightChange,
      totalEntries: entries.length,
      weeklyGrowthRate: averageWeeklyGrowth,
      growthTrend,
      lastMeasurement,
      averageWeeklyGrowth
    }
  }

  const stats = calculateStats()

  const formatWeight = (weight: number) => {
    return weight.toFixed(1)
  }

  const formatWeightChange = (change: number) => {
    const sign = change > 0 ? '+' : ''
    return `${sign}${change.toFixed(1)} kg`
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'accelerating':
        return '📈'
      case 'slowing':
        return '📉'
      default:
        return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'accelerating':
        return 'text-green-600'
      case 'slowing':
        return 'text-orange-600'
      default:
        return 'text-blue-600'
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'accelerating':
        return 'Kiihtyvä kasvu'
      case 'slowing':
        return 'Hidastuva kasvu'
      default:
        return 'Tasainen kasvu'
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nykyinen paino</CardTitle>
          <Scale className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalEntries > 0 ? `${formatWeight(stats.currentWeight)} kg` : '0.0 kg'}
          </div>
          {stats.lastMeasurement && (
            <p className="text-xs text-muted-foreground">
              Mitattu {format(new Date(stats.lastMeasurement), 'dd.MM.yyyy', { locale: fi })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Painon muutos</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalEntries > 1 ? formatWeightChange(stats.weightChange) : '0.0 kg'}
          </div>
          <p className="text-xs text-muted-foreground">
            Edellisestä mittauksesta
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kasvutrendi</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getTrendColor(stats.growthTrend)}`}>
            {getTrendIcon(stats.growthTrend)}
          </div>
          <p className="text-xs text-muted-foreground">
            {getTrendText(stats.growthTrend)}
          </p>
          {stats.averageWeeklyGrowth > 0 && (
            <Badge variant="outline" className="mt-1 text-xs">
              {formatWeight(stats.averageWeeklyGrowth)} kg/viikko
            </Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mittaukset</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEntries}</div>
          <p className="text-xs text-muted-foreground">
            Yhteensä tallennettuja mittauksia
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
