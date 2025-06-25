import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/_next/*',
          '/admin/*',
          '*.json',
          '*.xml',
        ],
      },
      // Google bot için özel kurallar
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 1,
      },
      // Bing bot için özel kurallar  
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://yksekeri.com/sitemap.xml',
    host: 'https://yksekeri.com',
  }
} 