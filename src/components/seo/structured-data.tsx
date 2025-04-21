import { useLocation } from 'react-router-dom';

interface StructuredDataProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  datePublished?: string;
  dateModified?: string;
}

export function StructuredData({
  title = 'Vayu - Breathe, Flow and Conquer',
  description = 'Experience the power of vibration and sound-guided breathing, scientifically proven to enhance your mental clarity, reduce stress, and boost your overall well-being.',
  image = 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2200&q=80',
  type = 'website',
  datePublished,
  dateModified
}: StructuredDataProps) {
  const location = useLocation();
  const currentUrl = `https://vayu-prana.com${location.pathname}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'website' ? 'WebSite' : 'Article',
    url: currentUrl,
    name: title,
    description,
    image,
    publisher: {
      '@type': 'Organization',
      name: 'Vayu',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vayu-prana.com/logo.png'
      }
    },
    ...(type === 'article' && {
      datePublished,
      dateModified: dateModified || datePublished
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}