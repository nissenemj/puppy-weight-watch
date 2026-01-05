// Structured data helpers for SEO optimization
import puppyLogo from '@/assets/puppy-logo.png';

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Koiranpennun Painonseuranta",
  "description": "Koiranpentujen kasvun ja kehityksen seurantapalvelu",
  "url": window.location.origin,
  "logo": `${window.location.origin}${puppyLogo}`,
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Finnish"
  }
});

export const createWebApplicationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Koiranpennun Painonseuranta",
  "description": "Seuraa koiranpentusi kasvua ja kehitystä helposti. Laskuri ruokamäärille, painoseuranta ja annostelutaulukot.",
  "url": window.location.origin,
  "applicationCategory": "PetCareApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Painonseuranta",
    "Ruokalaskuri",
    "Annostelutaulukot",
    "Kasvukäyrät",
    "Pentun kehityksen seuranta"
  ]
});

export const createCalculatorSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pentulaskuri - Ruokamäärä",
  "description": "Laske koiranpentusi päivittäinen ruokamäärä painon, iän ja rodun perusteella. Ilmainen työkalu koiranpennun ruokinnan suunnitteluun.",
  "url": `${window.location.origin}/calculator`,
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Ruokamäärän laskenta",
    "Ikäkohtaiset suositukset",
    "Rotukohtaiset erot",
    "Annostelutaulukot",
    "Painonseuranta integraatio"
  ]
});

export const createWeightTrackingSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Painonseuranta",
  "description": "Seuraa koiranpentusi painon kehitystä ja kasvua",
  "url": window.location.origin,
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "EUR"
  },
  "featureList": [
    "Painon kirjaaminen",
    "Kasvukäyrät",
    "Kehityksen seuranta",
    "Visuaaliset graafit"
  ]
});

export const createFAQSchema = (faqs: Array<{ question: string, answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const createBreadcrumbSchema = (breadcrumbs: Array<{ name: string, url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const createArticleSchema = (title: string, description: string, image?: string, datePublished?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "image": image ? (image.startsWith('http') ? image : `${window.location.origin}${image}`) : undefined,
  "author": {
    "@type": "Organization",
    "name": "Koiranpennun Painonseuranta",
    "url": window.location.origin
  },
  "publisher": {
    "@type": "Organization",
    "name": "Koiranpennun Painonseuranta",
    "logo": {
      "@type": "ImageObject",
      "url": `${window.location.origin}/icon-512x512.png` // using existing icon as logo
    }
  },
  "datePublished": datePublished || new Date().toISOString(),
  "dateModified": new Date().toISOString()
});