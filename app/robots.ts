import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/user/',
          '/admin/',
          '/auth/',
          '/checkout/success/',
          '/_next/',
          '/private/',
          '*.json',
          '/test*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/user/',
          '/admin/',
          '/auth/',
          '/checkout/success/',
          '/private/'
        ],
      }
    ],
    sitemap: 'https://dazno.de/sitemap.xml',
    host: 'https://dazno.de'
  }
} 