import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import site from '@/data/sitePages.json';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
  noindex?: boolean;
  siteName?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'koiranpentu, painonseuranta, ruokalaskuri, pentulaskuri, koiran kasvu, ruokinta, annostelu',
  image = '/icons/icon-512x512.png',
  type = 'website',
  structuredData,
  noindex = false,
  siteName = 'Pentulaskuri'
}) => {
  const { pathname } = useLocation();
  const route = pathname.replace(/\/+$/, '') || '/';
  const pages: Record<string, { heading: string; description: string } | undefined> = site.pages;
  const page = pages[route];
  const canonical = page && !noindex ? site.origin + route : undefined;
  const pageTitle = title ?? page?.heading ?? siteName;
  const summary = description ?? page?.description ?? '';
  const fullTitle = pageTitle === siteName || pageTitle.endsWith(` | ${siteName}`)
    ? pageTitle : `${pageTitle} | ${siteName}`;
  const imageUrl = new URL(image, site.origin).href;

  return (
    <Helmet>
      {/* Canonical URL - critical for SEO */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={summary} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Pentulaskuri.com" />
      <meta name="robots" content={canonical ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'} />
      <meta name="language" content="fi" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Mobile optimization */}
      <meta name="theme-color" content="#FF6B35" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={summary} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="fi_FI" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={summary} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={pageTitle} />
      
      {/* Additional meta tags for mobile */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Pentulaskuri" />
      
      {/* Structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
