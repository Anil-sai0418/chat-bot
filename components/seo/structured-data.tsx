import { ReactNode } from 'react';

interface StructuredDataProps {
  data: Record<string, any>;
}

export function StructuredData({ data }: StructuredDataProps): ReactNode {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vextron AI',
    url: 'https://vextron.ai',
    logo: 'https://vextron.ai/logo.png',
    description: 'Experience the next generation of conversational AI. State-of-the-art intelligence engineered for clarity, speed, and uncompromising performance.',
    sameAs: [
      'https://twitter.com/vextronai',
      'https://facebook.com/vextronai',
      'https://linkedin.com/company/vextronai',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      url: 'https://vextron.ai/support',
    },
  };

  return <StructuredData data={schema} />;
}

export function WebApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Vextron AI',
    description: 'Experience the next generation of conversational AI',
    url: 'https://vextron.ai',
    applicationCategory: 'Productivity',
    offers: {
      '@type': 'Offer',
      price: 'Free',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
    },
  };

  return <StructuredData data={schema} />;
}

export function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Vextron AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vextron AI is a state-of-the-art conversational interface engineered for clarity, speed, and uncompromising performance. It provides intelligent assistance for coding, analysis, and creative tasks.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Vextron AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Vextron AI offers free access with a Pro Plan available for advanced features.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I get started?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Simply sign up for an account, and you can start chatting with Vextron AI immediately.',
        },
      },
    ],
  };

  return <StructuredData data={schema} />;
}
