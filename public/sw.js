// Service Worker for Puppy Weight Tracker
const CACHE_NAME = 'puppy-tracker-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { credentials: 'same-origin' })));
      })
      .catch(error => {
        console.log('Failed to cache static assets:', error);
      })
  );
  
  // Force activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Strategy 2: Cache First for images
    if (isImage(url.pathname)) {
      return await cacheFirst(request, IMAGE_CACHE);
    }
    
    // Strategy 3: Network First for API calls
    if (isApiCall(url.pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Strategy 4: Stale While Revalidate for pages
    return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    
  } catch (error) {
    console.log('Fetch failed:', error);
    return await handleOffline(request);
  }
}

// Caching strategies
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  return cachedResponse || await networkResponsePromise;
}

// Offline handling
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Try to find any cached version first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Return offline page for navigation requests
  if (request.destination === 'document') {
    const offlineResponse = await caches.match('/offline.html');
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // Fallback offline HTML
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Offline - Puppy Tracker</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              text-align: center; 
              padding: 2rem; 
              background: linear-gradient(135deg, #FF6B35 0%, #FF8E72 100%);
              color: white;
              min-height: 100vh;
              margin: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .offline-content {
              max-width: 400px;
              margin: 0 auto;
            }
            h1 { font-size: 2rem; margin-bottom: 1rem; }
            p { font-size: 1.1rem; margin-bottom: 1.5rem; }
            button {
              background: white;
              color: #FF6B35;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 1rem;
              font-weight: 600;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="offline-content">
            <h1>🐕 Offline</h1>
            <p>You're currently offline. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
  
  // For other requests, return a network error
  return new Response('Network error', {
    status: 408,
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Utility functions
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/);
}

function isImage(pathname) {
  return pathname.match(/\.(png|jpg|jpeg|gif|webp|svg)$/);
}

function isApiCall(pathname) {
  return pathname.startsWith('/api/') || 
         pathname.includes('supabase') ||
         pathname.includes('.json');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'weight-entry-sync') {
    event.waitUntil(syncWeightEntries());
  }
});

async function syncWeightEntries() {
  // This would sync any pending weight entries when back online
  console.log('Syncing weight entries...');
  // Implementation would depend on your data storage strategy
}

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  console.log('Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'puppy-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Puppy Tracker', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});