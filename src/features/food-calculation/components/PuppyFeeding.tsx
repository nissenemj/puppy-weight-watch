import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function PuppyFeeding() {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl animate-fade-in hover-scale">
      <CardHeader>
        <CardTitle className="text-xl">🐕 Penturuokinta-opas</CardTitle>
        <CardDescription>Yleisiä ohjeita pennun ruokinnasta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="p-4 bg-gradient-cool rounded-xl text-white">
            <h4 className="font-semibold mb-2">Ikä 6-12 viikkoa</h4>
            <p className="text-sm text-white/90">4 ateriaa päivässä, pehmeää ruokaa</p>
          </div>
          <div className="p-4 bg-gradient-warm rounded-xl text-white">
            <h4 className="font-semibold mb-2">Ikä 3-6 kuukautta</h4>
            <p className="text-sm text-white/90">3 ateriaa päivässä, siirtymä kuivaruokaan</p>
          </div>
          <div className="p-4 bg-gradient-purple rounded-xl text-white">
            <h4 className="font-semibold mb-2">Ikä 6+ kuukautta</h4>
            <p className="text-sm text-white/90">2 ateriaa päivässä, aikuisen ruokinta</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}