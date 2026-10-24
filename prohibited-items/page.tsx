import PolicyPage, { loadPolicy } from '@/components/public/PolicyPage';
import { meta } from '@/lib/seo';

export const revalidate = 300;
export async function generateMetadata() {
  const { page } = await loadPolicy('prohibited-items');
  return meta('Prohibited Items Policy', (page?.body || '').replace(/\s+/g, ' ').slice(0, 155) || 'Prohibited Items Policy for MSUKASHA users.', '/prohibited-items');
}
export default function Page() { return <PolicyPage slug="prohibited-items" fallbackTitle="Prohibited Items Policy" />; }
