
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Clock, ExternalLink, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchAllFeeds, getPriorityColor, getCategoryBadgeText, type NewsItem } from '@/services/rssFeedService'

export default function SafetyNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadNews = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const articles = await fetchAllFeeds()
      setNews(articles)
      setLastUpdated(new Date())
    } catch (err) {
      setError('Uutisten lataaminen epäonnistui. Tarkista internetyhteytesi.')
      console.error('Error loading news:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNews()
    
    // Set up automatic refresh every 15 minutes for critical feeds
    const interval = setInterval(loadNews, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
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
        <CardTitle className="flex items-center justify-between text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Ajankohtaiset turvallisuusuutiset
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-red-600">
                Päivitetty: {lastUpdated.toLocaleTimeString('fi-FI')}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={loadNews}
              disabled={loading}
              className="text-red-700 hover:text-red-800"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
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
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(item.priority)}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm leading-tight flex-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryBadgeText(item.category)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {item.source}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm mb-3 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs opacity-75">
                    <Clock className="h-3 w-3" />
                    {formatDate(item.publishedAt)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {item.priority === 'critical' && (
                      <div className="flex items-center gap-1 text-xs font-medium">
                        <AlertTriangle className="h-3 w-3" />
                        Kriittinen varoitus
                      </div>
                    )}
                    
                    {item.url && item.url !== '#' && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Lue lisää
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mt-4">
              <p className="text-xs text-amber-800">
                <strong>Huomio:</strong> Tämä järjestelmä hakee uutisia useista luotettavista lähteistä. 
                Seuraa aina virallisia tiedotuskanavia ja ota yhteyttä eläinlääkäriin kiireellisissä tilanteissa. 
                RSS-syötteiden käyttö tapahtuu lähteiden käyttöehtojen mukaisesti.
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
