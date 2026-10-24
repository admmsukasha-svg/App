import type { MetadataRoute } from 'next';
import { serverTry } from '@/lib/api';
import { SEGMENTS, SITE } from '@/lib/constants';

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const u = (p: string) => `${SITE.url}${p}`;
  const staticPaths = ['', '/products', '/suppliers', '/categories', '/c2c', '/rfq', '/join-as-supplier', '/advertise', '/help', '/contact', '/about', '/terms', '/privacy', '/seller-guidelines', '/prohibited-items', '/verification-policy', '/report'];
  const entries: MetadataRoute.Sitemap = [...staticPaths.map((p) => ({ url: u(p) })), ...Object.keys(SEGMENTS).map((s) => ({ url: u(`/suppliers/for/${s}`) }))];
  const [prods, sups, c2c] = await Promise.all([
    serverTry<{ products: any[] }>('/api/products?limit=100', { products: [] }, 3600),
    serverTry<{ suppliers: any[] }>('/api/suppliers?limit=100', { suppliers: [] }, 3600),
    serverTry<{ listings: any[] }>('/api/c2c?limit=100', { listings: [] }, 3600)
  ]);
  prods.products.forEach((p) => entries.push({ url: u(`/products/${p.slug || p.id}`), lastModified: p.updatedAt }));
  sups.suppliers.forEach((s) => entries.push({ url: u(`/suppliers/${s.slug}`) }));
  c2c.listings.forEach((l) => entries.push({ url: u(`/c2c/${l.id}`), lastModified: l.updatedAt }));
  return entries;
}
