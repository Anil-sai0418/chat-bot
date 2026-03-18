import type { Metadata, Viewport } from 'next';

const siteConfig = {
  name: 'Vextron AI',
  title: 'Vextron AI - Intelligent Conversational Interface',
  description: 'Experience the next generation of conversational AI. State-of-the-art intelligence engineered for clarity, speed, and uncompromising performance.',
  url: 'https://vextron.ai',
  ogImage: 'https://vextron.ai/og-image.png',
  twitterHandle: '@vextronai',
  author: 'Vextron AI',
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: '%s | Vextron AI',
  },
  description: siteConfig.description,
  keywords: [
    'AI chat',
    'conversational AI',
    'chatbot',
    'intelligent assistant',
    'natural language processing',
    'machine learning',
    'Vextron',
    'AI assistant',
    'GPT alternative',
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  metadataBase: new URL(siteConfig.url),
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
        type: 'image/png',
      },
      {
        url: 'https://vextron.ai/og-image-square.png',
        width: 800,
        height: 800,
        alt: siteConfig.title,
        type: 'image/png',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  
  manifest: '/site.webmanifest',
  
  alternates: {
    canonical: siteConfig.url,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};
