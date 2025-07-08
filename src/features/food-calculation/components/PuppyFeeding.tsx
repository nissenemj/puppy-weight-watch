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
          <div className="p-4 bg-gradient-cool rounded-xl">
            <h4 className="font-semibold text-card-foreground mb-2">Ikä 6-12 viikkoa</h4>
            <p className="text-sm text-muted-foreground">4 ateriaa päivässä, pehmeää ruokaa</p>
          </div>
          <div className="p-4 bg-gradient-warm rounded-xl">
            <h4 className="font-semibold text-card-foreground mb-2">Ikä 3-6 kuukautta</h4>
            <p className="text-sm text-muted-foreground">3 ateriaa päivässä, siirtymä kuivaruokaan</p>
          </div>
          <div className="p-4 bg-gradient-purple rounded-xl">
            <h4 className="font-semibold text-card-foreground mb-2">Ikä 6+ kuukautta</h4>
            <p className="text-sm text-muted-foreground">2 ateriaa päivässä, aikuisen ruokinta</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}