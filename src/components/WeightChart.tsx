
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { fi } from 'date-fns/locale'
import type { WeightEntry } from '@/services/weightService'

interface WeightChartProps {
  weightData: WeightEntry[]
}

interface ChartDataPoint {
  date: string
  dateFormatted: string
  actualWeight?: number
  avgGrowthLine?: number
}

export default function WeightChart({ weightData }: WeightChartProps) {
  console.log('WeightChart received data:', weightData)
  
  if (weightData.length === 0) {
    console.log('No weight data available')
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500">
        Ei painotietoja käytettävissä
      </div>
    )
  }

  if (weightData.length === 1) {
    console.log('Only one data point, showing simple view')
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500">
        Tarvitaan vähintään 2 mittausta kaavion näyttämiseen
      </div>
    )
  }

  const generateChartData = (data: WeightEntry[]): ChartDataPoint[] => {
    if (data.length < 2) return []

    // Calculate average weekly growth
    const firstEntry = data[0]
    const lastEntry = data[data.length - 1]
    const firstDate = parseISO(firstEntry.date)
    const lastDate = parseISO(lastEntry.date)
    const totalWeeks = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    const totalGrowth = lastEntry.weight - firstEntry.weight
    const weeklyGrowth = totalWeeks > 0 ? totalGrowth / totalWeeks : 0

    console.log('Weekly growth calculated:', weeklyGrowth)

    // Generate chart data points for actual data only
    const chartData: ChartDataPoint[] = []

    data.forEach((entry) => {
      const date = parseISO(entry.date)
      chartData.push({
        date: entry.date,
        dateFormatted: format(date, 'dd.MM', { locale: fi }),
        actualWeight: entry.weight,
        avgGrowthLine: firstEntry.weight + (weeklyGrowth * ((date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 7)))
      })
    })

    const sortedData = chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    console.log('Generated chart data:', sortedData)
    return sortedData
  }

  const chartData = generateChartData(weightData)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'actualWeight' && `Mitattu paino: ${entry.value?.toFixed(1)} kg`}
              {entry.dataKey === 'avgGrowthLine' && `Keskikasvu: ${entry.value?.toFixed(1)} kg`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  console.log('Rendering chart with data points:', chartData.length)

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="dateFormatted" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={['dataMin - 0.5', 'dataMax + 0.5']}
            label={{ value: 'Paino (kg)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Actual weight line */}
          <Line
            type="monotone"
            dataKey="actualWeight"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            name="Mitattu paino"
            connectNulls={false}
          />
          
          {/* Average growth trend line */}
          <Line
            type="monotone"
            dataKey="avgGrowthLine"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Keskikasvukäyrä"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
