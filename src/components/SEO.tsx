import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Koiranpennun Painonseuranta',
  description = 'Seuraa koiranpentusi kasvua ja kehitystä helposti. Laskuri ruokamäärille, painoseuranta ja annostelutaulukot.',
  keywords = 'koiranpentu, painonseuranta, ruokalaskuri, pentulaskuri, koiran kasvu, ruokinta, annostelu',
  image = '/icons/icon-512x512.png',
  url = window.location.href,
  type = 'website',
  structuredData
}) => {
  const fullTitle = title === 'Koiranpennun Painonseuranta' ? title : `${title} | Koiranpennun Painonseuranta`;

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Koiranpennun Painonseuranta App" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="fi" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Mobile optimization */}
      <meta name="theme-color" content="#FF6B35" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Koiranpennun Painonseuranta" />
      <meta property="og:locale" content="fi_FI" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      
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