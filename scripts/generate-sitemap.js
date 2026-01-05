import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://pentulaskuri.com';
const TODAY = new Date().toISOString().split('T')[0];

const routes = [
    // Main Pages
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/weight-tracker', priority: '0.9', changefreq: 'weekly' },
    { path: '/calculator', priority: '0.9', changefreq: 'weekly' },
    { path: '/guides', priority: '0.9', changefreq: 'weekly' },
    { path: '/puppy-book', priority: '0.8', changefreq: 'weekly' },

    // Guide Sub-Pages
    { path: '/guides/puppy-guide', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/socialization', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/safety', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/feeding', priority: '0.8', changefreq: 'monthly' },
    { path: '/guides/relaxation-protocol', priority: '0.8', changefreq: 'monthly' }, // NEW

    // Legacy Info Routes (Backward Compatibility)
    { path: '/info', priority: '0.6', changefreq: 'monthly' },
    { path: '/info/puppy-guide', priority: '0.6', changefreq: 'monthly' },
    { path: '/info/feeding-data', priority: '0.6', changefreq: 'monthly' },
    { path: '/info/food-types', priority: '0.6', changefreq: 'monthly' },
    { path: '/info/socialization-guide', priority: '0.6', changefreq: 'monthly' },
    { path: '/info/safety', priority: '0.6', changefreq: 'monthly' },

    // Contact
    { path: '/contact', priority: '0.5', changefreq: 'monthly' },

    // Legal Pages
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    { path: '/cookies', priority: '0.3', changefreq: 'yearly' },
    { path: '/accessibility', priority: '0.3', changefreq: 'yearly' },
];

const generateSitemap = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap generated at ${outputPath}`);
    console.log(`Total URLs: ${routes.length}`);
};

generateSitemap();
