import PolicyPage, { loadPolicy } from '@/components/public/PolicyPage';
import { meta } from '@/lib/seo';

export const revalidate = 300;
export async function generateMetadata() {
  const { page } = await loadPolicy('seller-guidelines');
  return meta('Seller Guidelines', (page?.body || '').replace(/\s+/g, ' ').slice(0, 155) || 'Seller Guidelines for MSUKASHA users.', '/seller-guidelines');
}
export default function Page() { return <PolicyPage slug="seller-guidelines" fallbackTitle="Seller Guidelines" />; }
