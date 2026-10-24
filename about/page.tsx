import { meta } from '@/lib/seo';
import PolicyPage from '@/components/public/PolicyPage';
export const metadata = meta('About MSUKASHA', 'MSUKASHA is a Pakistan-based B2B marketplace and C2C classifieds platform at an early launch stage.', '/about');
export const revalidate = 300;
export default function About() { return <PolicyPage slug="about" fallbackTitle="About MSUKASHA" />; }
