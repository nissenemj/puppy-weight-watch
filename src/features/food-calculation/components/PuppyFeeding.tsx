import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PuppyFeeding() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Penturuokinta-opas</CardTitle>
        <CardDescription>Yleisiä ohjeita pennun ruokinnasta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Ikä 6-12 viikkoa</h4>
            <p className="text-sm text-blue-700">4 ateriaa päivässä, pehmeää ruokaa</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">Ikä 3-6 kuukautta</h4>
            <p className="text-sm text-green-700">3 ateriaa päivässä, siirtymä kuivaruokaan</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-2">Ikä 6+ kuukautta</h4>
            <p className="text-sm text-purple-700">2 ateriaa päivässä, aikuisen ruokinta</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}