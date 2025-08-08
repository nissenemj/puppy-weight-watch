
import React from 'react'
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, FileText, AlertTriangle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import InfoCard from '@/components/InfoCard'
import InfoSection from '@/components/InfoSection'
import BackToTopButton from '@/components/BackToTopButton'
import SafetyNewsFeed from '@/components/SafetyNewsFeed'
import heroImage from '@/assets/welcome-illustration.png'

export default function SafetyPage() {
  return (
    <MobileOptimizedLayout>
    <div className="min-h-screen bg-background page-with-navigation w-full overflow-x-hidden">
      <Navigation />
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-full min-w-0">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={heroImage} 
              alt="Turvallisuus-opas" 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4">
            🛡️ Turvallisuus ja suositukset
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tärkeät turvallisuusohjeet ja ajankohtaiset uutiset koiranruokinnasta
          </p>
        </div>

        {/* News Feed */}
        <div className="mb-8">
          <SafetyNewsFeed />
        </div>

        <InfoCard
          title="Eläinlääkärin neuvon korvaamattomuus"
          variant="warm"
          icon={<Shield className="h-6 w-6" />}
          className="mb-8"
        >
          <div className="space-y-4">
            <p className="text-card-foreground leading-relaxed mb-4">
              Tämä raportti ja sen pohjalta kehitettävä sovellus ovat työkaluja ja oppaita, eivätkä ne koskaan korvaa 
              ammattilaisen antamaa yksilöllistä neuvontaa. Koiranpennun omistajaa tulee aina kannustaa keskustelemaan 
              ruokinnasta hoitavan eläinlääkärin kanssa.
            </p>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-card-foreground">Eläinlääkäri osaa arvioida:</h3>
              <ul className="text-sm text-card-foreground/90 space-y-2">
                <li>• Pennun yksilöllisen kasvukäyrän</li>
                <li>• Kuntoluokan ja kehityksen</li>
                <li>• Mahdolliset erityistarpeet</li>
                <li>• Rotukohtaiset erityispiirteet</li>
                <li>• Mahdolliset terveysriskit</li>
              </ul>
            </div>
            
            <div className="bg-card-foreground/20 p-4 rounded-xl border border-card-foreground/30 mt-4">
              <h4 className="font-semibold text-card-foreground mb-2">Erityisen tärkeää konsultoida eläinlääkäriä:</h4>
              <ul className="text-sm text-card-foreground/90 space-y-1">
                <li>• Jos pennulla on diagnosoituja terveysongelmia</li>
                <li>• Jos pentu kuuluu jättirotuun</li>
                <li>• Jos kasvu poikkeaa normaalista</li>
                <li>• Erikoisruokavaliota tarvittaessa</li>
              </ul>
            </div>
          </div>
        </InfoCard>



        <InfoCard
          title="Ravitsemukselliset huomiot"
          description="Kriittiset ravintoaineet ja varoitukset pennun ruokinnassa"
          className="mb-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground">Kriittiset ravintoaineet pennuille:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Proteiini:</strong> Lihaksiston ja kudosten kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Kalsium ja fosfori:</strong> Luuston kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>DHA:</strong> Aivojen ja näön kehitykseen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span><strong>Energia:</strong> Nopean kasvun tukemiseen</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-card-foreground">Varoitukset:</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">⚠️</span>
                    <span>Liiallinen kalsium voi aiheuttaa luusto-ongelmia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">⚠️</span>
                    <span>Liiallinen energia kiihdyttää kasvua epänormaalisti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">⚠️</span>
                    <span>Puutteellinen ravitsemus hidastaa kehitystä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive">⚠️</span>
                    <span>Suurirodun pennuille erityishuomiot</span>
                  </li>
                </ul>
              </div>
            </div>
        </InfoCard>

        <InfoCard
          title="Yhteenveto"
          variant="accent"
          className="mb-8"
        >
          <p className="text-card-foreground leading-relaxed">
            Pentukoiran ruokinta on monimutkainen aihe, joka vaatii huolellista harkintaa ja usein ammattilaisen 
            ohjausta. Teknologiset työkalut voivat auttaa tiedon keräämisessä ja päätöksenteossa, mutta ne eivät 
            koskaan korvaa eläinlääkärin ammattitaitoa tai omistajan vastuuta seurata lemmikin vointia. 
            Vastuullinen pentukoiran ruokinta yhdistää tieteellisen tiedon, käytännön kokemuksen ja 
            yksilöllisen harkinnan.
          </p>
        </InfoCard>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Link to="/info/feeding-data">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edellinen: Annostelutiedot
            </Button>
          </Link>
          <Link to="/info">
            <Button className="w-full sm:w-auto">
              Takaisin etusivulle
            </Button>
          </Link>
        </div>
        
        <BackToTopButton />
      </div>
    </div>
    </MobileOptimizedLayout>
  )
}
