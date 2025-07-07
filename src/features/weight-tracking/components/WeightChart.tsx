import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { WeightEntry } from '@/services/weightService'

interface WeightChartProps {
  weightData: WeightEntry[]
}

interface ChartDataPoint {
  date: string
  dateFormatted: string
  actualWeight: number
  avgGrowthLine: number
}

export default function WeightChart({ weightData }: WeightChartProps) {
  console.log('WeightChart received data:', weightData)
  
  if (weightData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Kasvukäyrä</CardTitle>
          <CardDescription>Pentusi painon kehitys ajan myötä</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <p>Ei vielä riittävästi mittauksia kasvukäyrän näyttämiseen.</p>
            <p className="text-sm mt-2">Lisää vähintään yksi painomittaus aloittaaksesi seurannan.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort data by date to ensure correct order
  const sortedData = [...weightData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  // Calculate weekly growth rate from the data
  let weeklyGrowth = 0.42 // Default growth rate kg/week for puppies
  if (sortedData.length >= 2) {
    const firstEntry = sortedData[0]
    const lastEntry = sortedData[sortedData.length - 1]
    const daysDiff = Math.max(1, (new Date(lastEntry.date).getTime() - new Date(firstEntry.date).getTime()) / (1000 * 60 * 60 * 24))
    const weightDiff = lastEntry.weight - firstEntry.weight
    weeklyGrowth = Math.max(0.1, (weightDiff / daysDiff) * 7) // Convert to weekly growth
  }
  
  console.log('Weekly growth calculated:', weeklyGrowth)
  
  // Create chart data with predictions
  const chartData: ChartDataPoint[] = sortedData.map((entry, index) => {
    const baseWeight = sortedData[0].weight
    const daysFromStart = (new Date(entry.date).getTime() - new Date(sortedData[0].date).getTime()) / (1000 * 60 * 60 * 24)
    const avgWeight = baseWeight + (weeklyGrowth * daysFromStart / 7)
    
    return {
      date: entry.date,
      dateFormatted: format(new Date(entry.date), 'dd.MM'),
      actualWeight: entry.weight,
      avgGrowthLine: Math.round(avgWeight * 100) / 100
    }
  })
  
  console.log('Generated chart data:', chartData)
  
  // Calculate stats
  const totalGrowth = sortedData.length > 1 ? sortedData[sortedData.length - 1].weight - sortedData[0].weight : 0
  const avgWeight = sortedData.reduce((sum, entry) => sum + entry.weight, 0) / sortedData.length
  
  console.log('Rendering chart with data points:', chartData.length)

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle className="text-xl">Kasvukäyrä</CardTitle>
            <CardDescription>Pentusi painon kehitys ajan myötä</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-white border-blue-500 text-blue-700">
              📈 Kasvu: {totalGrowth.toFixed(1)} kg
            </Badge>
            <Badge variant="outline" className="bg-white border-green-500 text-green-700">
              ⚖️ Keskiarvo: {avgWeight.toFixed(1)} kg
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile optimized chart container */}
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ 
                top: 5, 
                right: 10, 
                left: 10, 
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="dateFormatted" 
                fontSize={12}
                tickMargin={8}
              />
              <YAxis 
                fontSize={12}
                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip 
                labelFormatter={(label) => `Päivämäärä: ${label}`}
                formatter={(value: number, name: string) => [
                  `${value} kg`, 
                  name === 'actualWeight' ? 'Mitattu paino' : 'Keskikasvu'
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontSize: '12px',
                  paddingTop: '10px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="actualWeight" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Mitattu paino"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
              <Line 
                type="monotone" 
                dataKey="avgGrowthLine" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Keskikasvu"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Growth insights - mobile optimized */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
          <h4 className="font-semibold text-gray-800 mb-2 text-base">📊 Kasvutiedot</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Viikoittainen kasvu:</span>
              <span className="font-medium text-blue-700">{weeklyGrowth.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mittauksia yhteensä:</span>
              <span className="font-medium text-green-700">{sortedData.length} kpl</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}