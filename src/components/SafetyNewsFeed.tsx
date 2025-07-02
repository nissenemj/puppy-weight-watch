
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

  const fetchSafetyNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Käytetään News API:a hakemaan koiranruokaan liittyviä turvallisuusuutisia
      const keywords = 'koiranruoka OR lemmikkiruoka OR "pet food" OR "dog food" AND (turvallisuus OR varoitus OR veto OR takaisinveto OR "food recall" OR safety)'
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=fi&sortBy=publishedAt&pageSize=10`,
        {
          headers: {
            'X-API-Key': 'YOUR_NEWS_API_KEY' // Tämä pitää korvata oikealla API-avaimella
          }
        }
      )
      
      if (!response.ok) {
        throw new Error('Uutisten haku epäonnistui')
      }
      
      const data = await response.json()
      setNews(data.articles?.slice(0, 5) || [])
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Uutisten lataus epäonnistui. Yritä myöhemmin uudelleen.')
      
      // Näytetään esimerkkiuutisia demonstraatiota varten
      setNews([
        {
          title: "SMAAK koiranruoka vedetty myynnistä terveysriskien vuoksi",
          description: "Musti ja Mirri on vetänyt myynnistä SMAAK Herkkä kala viljaton -koiranruokaa terveysongelmien vuoksi.",
          url: "#",
          publishedAt: "2023-11-15T10:00:00Z",
          source: "Yle Uutiset"
        },
        {
          title: "Eviran varoitus: Kiinalainen koiranruoka sisältää vaarallisia aineita",
          description: "Ruokavirasto varoittaa tiettyjen kiinalaisten koiranruokien käytöstä mahdollisten terveysriskien vuoksi.",
          url: "#",
          publishedAt: "2023-10-22T14:30:00Z",
          source: "MTV Uutiset"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSafetyNews()
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
              onClick={fetchSafetyNews}
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
                  
                  {item.url !== "#" && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900"
                    >
                      Lue lisää
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
            
            <div className="bg-red-100 p-3 rounded-lg border border-red-300 mt-4">
              <p className="text-xs text-red-800">
                <strong>Huomio:</strong> Seuraa aina virallisia tiedotuskanavia ja ota yhteyttä eläinlääkäriin, 
                jos epäilet lemmikkisi syöneen vaarallista ruokaa.
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
