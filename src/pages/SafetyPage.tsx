
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import SafetyNewsFeed from '@/components/SafetyNewsFeed'

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-14">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Turvallisuus ja suositukset
          </h1>
        </div>

        {/* News Feed */}
        <div className="mb-8">
          <SafetyNewsFeed />
        </div>

        {/* Veterinary Advice */}
        <Card className="mb-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-6 w-6" />
              Eläinlääkärin neuvon korvaamattomuus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 leading-relaxed mb-4">
              Tämä raportti ja sen pohjalta kehitettävä sovellus ovat työkaluja ja oppaita, eivätkä ne koskaan korvaa 
              ammattilaisen antamaa yksilöllistä neuvontaa. Koiranpennun omistajaa tulee aina kannustaa keskustelemaan 
              ruokinnasta hoitavan eläinlääkärin kanssa.
            </p>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-green-800">Eläinlääkäri osaa arvioida:</h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Pennun yksilöllisen kasvukäyrän</li>
                <li>• Kuntoluokan ja kehityksen</li>
                <li>• Mahdolliset erityistarpeet</li>
                <li>• Rotukohtaiset erityispiirteet</li>
                <li>• Mahdolliset terveysriskit</li>
              </ul>
            </div>
            
            <div className="bg-green-100 p-4 rounded-lg border border-green-300 mt-4">
              <h4 className="font-semibold text-green-800 mb-2">Erityisen tärkeää konsultoida eläinlääkäriä:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Jos pennulla on diagnosoituja terveysongelmia</li>
                <li>• Jos pentu kuuluu jättirotuun</li>
                <li>• Jos kasvu poikkeaa normaalista</li>
                <li>• Erikoisruokavaliota tarvittaessa</li>
              </ul>
            </div>
          </CardContent>
        </Card>



        {/* Nutritional Considerations */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Ravitsemukselliset huomiot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Kriittiset ravintoaineet pennuille:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Proteiini:</strong> Lihaksiston ja kudosten kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Kalsium ja fosfori:</strong> Luuston kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>DHA:</strong> Aivojen ja näön kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Energia:</strong> Nopean kasvun tukemiseen</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Varoitukset:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span>Liiallinen kalsium voi aiheuttaa luusto-ongelmia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span>Liiallinen energia kiihdyttää kasvua epänormaalisti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span>Puutteellinen ravitsemus hidastaa kehitystä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600">⚠️</span>
                    <span>Suurirodun pennuille erityishuomiot</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">Yhteenveto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 leading-relaxed">
              Pentukoiran ruokinta on monimutkainen aihe, joka vaatii huolellista harkintaa ja usein ammattilaisen 
              ohjausta. Teknologiset työkalut voivat auttaa tiedon keräämisessä ja päätöksenteossa, mutta ne eivät 
              koskaan korvaa eläinlääkärin ammattitaitoa tai omistajan vastuuta seurata lemmikin vointia. 
              Vastuullinen pentukoiran ruokinta yhdistää tieteellisen tiedon, käytännön kokemuksen ja 
              yksilöllisen harkinnan.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Link to="/info/feeding-data">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edellinen: Annostelutiedot
            </Button>
          </Link>
          <Link to="/info">
            <Button>
              Takaisin etusivulle
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
