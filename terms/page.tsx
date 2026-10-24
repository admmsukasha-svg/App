import PolicyPage, { loadPolicy } from '@/components/public/PolicyPage';
import { meta } from '@/lib/seo';

export const revalidate = 300;
export async function generateMetadata() {
  const { page } = await loadPolicy('terms-of-service');
  return meta('Terms of Service', (page?.body || '').replace(/\s+/g, ' ').slice(0, 155) || 'Terms of Service for MSUKASHA users.', '/terms');
}
export default function Page() { return <PolicyPage slug="terms-of-service" fallbackTitle="Terms of Service" />; }
