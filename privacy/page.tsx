import PolicyPage, { loadPolicy } from '@/components/public/PolicyPage';
import { meta } from '@/lib/seo';

export const revalidate = 300;
export async function generateMetadata() {
  const { page } = await loadPolicy('privacy-policy');
  return meta('Privacy Policy', (page?.body || '').replace(/\s+/g, ' ').slice(0, 155) || 'Privacy Policy for MSUKASHA users.', '/privacy');
}
export default function Page() { return <PolicyPage slug="privacy-policy" fallbackTitle="Privacy Policy" />; }
