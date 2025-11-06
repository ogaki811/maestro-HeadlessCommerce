import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/mypage',
          '/checkout',
          '/order-complete',
          '/cart',
        ],
      },
    ],
    sitemap: 'https://smartsample.example.com/sitemap.xml',
  };
}
