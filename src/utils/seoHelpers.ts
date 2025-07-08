// SEO utility functions

export const generateMetaDescription = (content: string, maxLength = 160) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength - 3).trim() + '...';
};

export const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[äåá]/g, 'a')
    .replace(/[ö]/g, 'o')
    .replace(/[ü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

export const getCanonicalUrl = (path: string) => {
  const baseUrl = 'https://ckwwxuytetyaaxfcvozvb.supabase.co';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const createPageTitle = (title: string, siteName = 'Koiranpennun Painonseuranta') => {
  if (title === siteName) return title;
  return `${title} | ${siteName}`;
};

// Common structured data generators
export const createImageObject = (src: string, alt: string, width?: number, height?: number) => ({
  "@type": "ImageObject",
  "url": src,
  "description": alt,
  ...(width && { "width": width }),
  ...(height && { "height": height })
});

export const createPersonSchema = (name: string, url?: string) => ({
  "@type": "Person",
  "name": name,
  ...(url && { "url": url })
});

export const createOrganizationSchema = (name: string, url?: string, logo?: string) => ({
  "@type": "Organization",
  "name": name,
  ...(url && { "url": url }),
  ...(logo && { "logo": createImageObject(logo, `${name} logo`) })
});