import PolicyPage, { loadPolicy } from '@/components/public/PolicyPage';
import { meta } from '@/lib/seo';

export const revalidate = 300;
export async function generateMetadata() {
  const { page } = await loadPolicy('verification-policy');
  return meta('Verification Policy', (page?.body || '').replace(/\s+/g, ' ').slice(0, 155) || 'Verification Policy for MSUKASHA users.', '/verification-policy');
}
export default function Page() { return <PolicyPage slug="verification-policy" fallbackTitle="Verification Policy" />; }
