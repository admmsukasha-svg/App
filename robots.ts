import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/dashboard', '/admin', '/api', '/login', '/register', '/verify-email', '/reset-password', '/forgot-password', '/report'] }], sitemap: `${SITE.url}/sitemap.xml` };
}
