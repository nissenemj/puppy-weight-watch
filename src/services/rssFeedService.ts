export interface NewsItem {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'varoitus' | 'tiedote' | 'tutkimus' | 'yleinen';
}

export interface RSSFeed {
  url: string;
  name: string;
  priority: number;
  updateInterval: number; // minutes
}

// Primary feeds (high relevance)
export const PRIMARY_FEEDS: RSSFeed[] = [
  {
    url: 'https://yle.fi/rss/t/18-35138/fi', // Yle Terveys
    name: 'Yle Terveys',
    priority: 1,
    updateInterval: 15
  },
  {
    url: 'https://yle.fi/rss/t/18-819/fi', // Yle Tiede
    name: 'Yle Tiede',
    priority: 1,
    updateInterval: 15
  },
  {
    url: 'https://yle.fi/rss/uutiset/paauutiset', // Yle Pääuutiset
    name: 'Yle Pääuutiset',
    priority: 1,
    updateInterval: 15
  },
  {
    url: 'https://www.iltalehti.fi/rss/uutiset.xml', // Iltalehti
    name: 'Iltalehti Uutiset',
    priority: 1,
    updateInterval: 30
  }
];

// Secondary feeds (general monitoring)
export const SECONDARY_FEEDS: RSSFeed[] = [
  {
    url: 'https://yle.fi/rss/t/18-35354/fi', // Yle Luonto
    name: 'Yle Luonto',
    priority: 2,
    updateInterval: 30
  },
  {
    url: 'https://yle.fi/rss/t/18-34837/fi', // Yle Kotimaa
    name: 'Yle Kotimaa',
    priority: 2,
    updateInterval: 120
  },
  {
    url: 'https://yle.fi/rss/uutiset/tuoreimmat', // Yle Tuoreimmat
    name: 'Yle Tuoreimmat',
    priority: 3,
    updateInterval: 120
  }
];

// Keywords for filtering dog-related content
const DOG_KEYWORDS = [
  'koira', 'koiranruoka', 'lemmikki', 'eläinlääkäri',
  'ruokamyrkytys', 'ruokavirasto', 'eläinten terveys',
  'pentu', 'koiran ravitsemus', 'eläinrehu', 'varoitus'
];

// CORS proxy options with fallbacks
const CORS_PROXIES = [
  {
    name: 'corsproxy.io',
    getUrl: (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    parseResponse: async (response: Response) => response.text(),
  },
  {
    name: 'allorigins',
    getUrl: (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    parseResponse: async (response: Response) => response.text(),
  },
  {
    name: 'cors.sh',
    getUrl: (url: string) => `https://cors.sh/${url}`,
    parseResponse: async (response: Response) => response.text(),
  },
];

// Try fetching with multiple CORS proxies
async function fetchWithCorsProxy(url: string): Promise<string | null> {
  for (const proxy of CORS_PROXIES) {
    try {
      const proxyUrl = proxy.getUrl(url);
      const response = await fetch(proxyUrl, {
        headers: {
          'x-cors-api-key': 'temp_' + Date.now(), // Some proxies need this
        },
      });

      if (response.ok) {
        const content = await proxy.parseResponse(response);
        if (content && content.includes('<item>')) {
          return content;
        }
      }
    } catch {
      // Try next proxy
      continue;
    }
  }
  return null;
}

// RSS Feed parsing function
export async function fetchRSSFeed(url: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const xmlText = await fetchWithCorsProxy(url);

    if (!xmlText) {
      console.warn(`Ei saatu RSS-syötettä (${sourceName}) - kaikki proxyt epäonnistuivat`);
      return [];
    }

    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.warn(`RSS-syötteen jäsentäminen epäonnistui (${sourceName})`);
      return [];
    }

    const items = xmlDoc.querySelectorAll('item');
    const articles: NewsItem[] = Array.from(items).map((item) => ({
      title: item.querySelector('title')?.textContent || '',
      description: item.querySelector('description')?.textContent || '',
      url: item.querySelector('link')?.textContent || '',
      publishedAt: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
      source: sourceName,
      priority: 'low' as const,
      category: 'yleinen' as const,
    }));

    return articles;
  } catch (error) {
    console.error(`RSS-syötteen haku epäonnistui (${sourceName}):`, error);
    return [];
  }
}

// Filter articles for dog-related content
export function filterDogRelatedArticles(articles: NewsItem[]): NewsItem[] {
  return articles.filter(article => {
    const content = (article.title + ' ' + article.description).toLowerCase();
    return DOG_KEYWORDS.some(keyword => content.includes(keyword));
  });
}

// Categorize articles by priority and type
export function categorizeArticles(articles: NewsItem[]): NewsItem[] {
  return articles.map(article => {
    const content = (article.title + ' ' + article.description).toLowerCase();
    
    // Critical warnings
    if (content.includes('varoitus') || content.includes('myrkytys') || 
        content.includes('takaisinveto') || content.includes('kielto')) {
      return { ...article, priority: 'critical' as const, category: 'varoitus' as const };
    }
    
    // Important notifications
    if (content.includes('ruokavirasto') || content.includes('eläinlääkäri') ||
        content.includes('suositus')) {
      return { ...article, priority: 'high' as const, category: 'tiedote' as const };
    }
    
    // Research results
    if (content.includes('tutkimus') || content.includes('tiede') ||
        content.includes('ravitsemus') || content.includes('terveys')) {
      return { ...article, priority: 'medium' as const, category: 'tutkimus' as const };
    }
    
    // General news
    return { ...article, priority: 'low' as const, category: 'yleinen' as const };
  });
}


// Fetch all feeds and combine results
export async function fetchAllFeeds(): Promise<NewsItem[]> {
  const allFeeds = [...PRIMARY_FEEDS, ...SECONDARY_FEEDS];
  const allArticles: NewsItem[] = [];
  
  for (const feed of allFeeds) {
    try {
      const feedArticles = await fetchRSSFeed(feed.url, feed.name);
      const filtered = filterDogRelatedArticles(feedArticles);
      const categorized = categorizeArticles(filtered);
      allArticles.push(...categorized);
    } catch (error) {
      console.error(`Error fetching feed ${feed.name}:`, error);
    }
  }
  
  // Sort by priority and date
  allArticles.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  
  return allArticles;
}

// Get priority color for UI
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 border-red-300 text-red-800';
    case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
    case 'medium': return 'bg-blue-100 border-blue-300 text-blue-800';
    case 'low': return 'bg-gray-100 border-gray-300 text-gray-800';
    default: return 'bg-gray-100 border-gray-300 text-gray-800';
  }
}

// Get category badge text
export function getCategoryBadgeText(category: string): string {
  switch (category) {
    case 'varoitus': return 'VAROITUS';
    case 'tiedote': return 'Tiedote';
    case 'tutkimus': return 'Tutkimus';
    case 'yleinen': return 'Uutinen';
    default: return 'Uutinen';
  }
}