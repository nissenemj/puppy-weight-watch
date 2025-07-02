
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

export default function SafetyNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Static example news for demonstration
  const exampleNews: NewsItem[] = [
    {
      title: "Evira varoittaa: Tietyt koiranruokamerkit vedetty myynnistä",
      description: "Ruokavirasto on vetänyt myynnistä useita koiranruokamerkkejä mahdollisten terveysriskien vuoksi. Kyse on erityisesti kuivaruoista, joissa on havaittu poikkeavia salmonella-pitoisuuksia.",
      url: "#",
      publishedAt: "2024-12-15T10:00:00Z",
      source: "Yle Uutiset"
    },
    {
      title: "Huomio koiranomistajat: Kiinalaiset herkkupalat aiheuttavat munuaisongelmia",
      description: "Eläinlääkärit varoittavat tietyistä kiinalaisista kuivalihaherkkujen käytöstä, koska ne on yhdistetty vakaviin munuaissairauksiin koirilla.",
      url: "#",
      publishedAt: "2024-12-10T14:30:00Z",
      source: "MTV Uutiset"
    },
    {
      title: "Raakaruokatuotteiden salmonellariski: Näin suojaat lemmikkisi",
      description: "Tuore tutkimus osoittaa, että raakaruokatuotteissa voi esiintyä salmonellaa. Asiantuntijat antavat ohjeet turvalliseen käsittelyyn ja varastointiin.",
      url: "#",
      publishedAt: "2024-12-05T09:15:00Z",
      source: "Helsingin Sanomat"
    },
    {
      title: "Allergiaruokien takaisinveto: Tarkista onko koirasi ruoka listalla",
      description: "Allergikoirille tarkoitetuissa ruoissa on havaittu merkkiaineiden pilaantumista. Lista takaisinvedettävistä tuotteista julkaistu viranomaisten toimesta.",
      url: "#",
      publishedAt: "2024-11-28T16:45:00Z",
      source: "Suomen Eläinlääkärilehti"
    },
    {
      title: "Varoitus: Viheralruoan mukana levinneet myrkytystapaukset",
      description: "Useat koirat ovat sairastuneet viheralruoan käytön jälkeen. Tutkijat epäilevät myrkyllisten kasvien sekoittumista tuotantoprosessissa.",
      url: "#",
      publishedAt: "2024-11-20T11:20:00Z",
      source: "Koira-lehti"
    }
  ]

  const loadNews = () => {
    setLoading(true)
    setError(null)
    
    // Simulate loading delay
    setTimeout(() => {
      setNews(exampleNews)
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    loadNews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-6 w-6" />
          Ajankohtaiset turvallisuusuutiset
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-4">
            <p className="text-red-700">Ladataan uutisia...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 p-4 rounded-lg border border-red-300 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadNews}
              className="mt-2"
            >
              Yritä uudelleen
            </Button>
          </div>
        )}
        
        {news.length > 0 && (
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-red-900 text-sm leading-tight">
                    {item.title}
                  </h3>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {item.source}
                  </Badge>
                </div>
                
                <p className="text-red-700 text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.publishedAt)}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <ExternalLink className="h-3 w-3" />
                    Esimerkkiuutinen
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-red-100 p-3 rounded-lg border border-red-300 mt-4">
              <p className="text-xs text-red-800">
                <strong>Huomio:</strong> Seuraa aina virallisia tiedotuskanavia ja ota yhteyttä eläinlääkäriin, 
                jos epäilet lemmikkisi syöneen vaarallista ruokaa. Nämä ovat esimerkkiuutisia havainnollistamaan järjestelmän toimintaa.
              </p>
            </div>
          </div>
        )}
        
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-4">
            <p className="text-red-700 text-sm">Ei uusia turvallisuusuutisia tällä hetkellä.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
