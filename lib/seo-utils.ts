/**
 * SEO Utility Functions
 * Helper functions for SEO-related tasks across the application
 */

export const seoConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://vextron.ai',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Vextron AI',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@vextronai',
  facebookPage: process.env.NEXT_PUBLIC_FACEBOOK_PAGE || 'vextronai',
  linkedinPage: process.env.NEXT_PUBLIC_LINKEDIN_PAGE || 'vextronai',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  googleSearchConsoleId: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID,
  orgName: process.env.NEXT_PUBLIC_ORG_NAME || 'Vextron AI',
  orgEmail: process.env.NEXT_PUBLIC_ORG_EMAIL,
  orgPhone: process.env.NEXT_PUBLIC_ORG_PHONE,
};

/**
 * Generate a canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  return `${seoConfig.baseUrl}${path}`;
}

/**
 * Generate Open Graph tags for a page
 */
export interface OpenGraphConfig {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  url?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateOpenGraphTags(config: OpenGraphConfig) {
  return {
    openGraph: {
      type: config.type || 'website',
      locale: 'en_US',
      url: config.url || seoConfig.baseUrl,
      siteName: seoConfig.siteName,
      title: config.title,
      description: config.description,
      images: config.image ? [{ url: config.image, width: 1200, height: 630 }] : undefined,
      ...(config.type === 'article' && {
        authors: config.author ? [config.author] : undefined,
        publishedTime: config.publishedTime,
        modifiedTime: config.modifiedTime,
      }),
    },
  };
}

/**
 * Generate Twitter Card tags
 */
export interface TwitterCardConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  image?: string;
  creator?: string;
}

export function generateTwitterCardTags(config: TwitterCardConfig) {
  return {
    twitter: {
      card: config.card || 'summary_large_image',
      title: config.title,
      description: config.description,
      images: config.image ? [config.image] : undefined,
      creator: config.creator || seoConfig.twitterHandle,
    },
  };
}

/**
 * Generate structured data (JSON-LD) for a page
 */
export function generateStructuredData(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      ...data,
    }),
  };
}

/**
 * Generate breadcrumb schema
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${seoConfig.baseUrl}${item.path}`,
    })),
  };
}

/**
 * Generate article schema
 */
export interface ArticleConfig {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
}

export function generateArticleSchema(config: ArticleConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.headline,
    description: config.description,
    image: config.image,
    author: {
      '@type': 'Organization',
      name: config.author || seoConfig.orgName,
      url: seoConfig.baseUrl,
    },
    datePublished: config.datePublished,
    dateModified: config.dateModified || config.datePublished,
    publisher: {
      '@type': 'Organization',
      name: seoConfig.orgName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.baseUrl}/logo.png`,
        width: 800,
        height: 60,
      },
    },
  };
}

/**
 * Generate local business schema
 */
export interface LocalBusinessConfig {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  sameAs?: string[];
}

export function generateLocalBusinessSchema(config: LocalBusinessConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: config.name,
    description: config.description,
    address: {
      '@type': 'PostalAddress',
      ...config.address,
    },
    telephone: config.phone,
    email: config.email,
    url: config.website || seoConfig.baseUrl,
    sameAs: config.sameAs,
  };
}

/**
 * Generate FAQ schema
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Generate social media URLs
 */
export function generateSocialUrls() {
  return {
    twitter: `https://twitter.com/${seoConfig.twitterHandle.replace('@', '')}`,
    facebook: `https://facebook.com/${seoConfig.facebookPage}`,
    linkedin: `https://linkedin.com/company/${seoConfig.linkedinPage}`,
  };
}

/**
 * Format date for schema.org
 */
export function formatSchemaDate(date: Date): string {
  return date.toISOString();
}

/**
 * Get meta tags for social sharing
 */
export function getSocialShareMetaTags(config: {
  title: string;
  description: string;
  image?: string;
  url?: string;
}) {
  return {
    ...generateOpenGraphTags({
      title: config.title,
      description: config.description,
      image: config.image,
      url: config.url,
    }),
    ...generateTwitterCardTags({
      title: config.title,
      description: config.description,
      image: config.image,
    }),
  };
}
