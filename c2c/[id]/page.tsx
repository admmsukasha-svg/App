import Link from 'next/link';
import { notFound } from 'next/navigation';
import { serverGet, money } from '@/lib/api';
import { meta } from '@/lib/seo';
import { Badge, SafeImg } from '@/components/ui';
import EntityActions from '@/components/public/EntityActions';

const load = (id: string) => /^[a-f\d]{24}$/i.test(id) ? serverGet<{ listing: any }>(`/api/c2c/${id}`, 30) : Promise.resolve(null);
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; const r = await load(id);
  return r ? meta(r.listing.title, (r.listing.description || r.listing.title).slice(0, 155), `/c2c/${id}`, { image: r.listing.img }) : meta('Listing not found', 'This listing is not available.', '/c2c', { noindex: true });
}
export default async function Listing({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; const r = await load(id);
  if (!r) notFound();
  const l = r.listing; const imgs: string[] = (l.images?.length ? l.images : l.img ? [l.img] : []).slice(0, 6);
  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted"><Link href="/c2c" className="hover:underline">C2C marketplace</Link> / {l.title}</nav>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3"><SafeImg src={imgs[0]} alt={l.title} className="aspect-[4/3] w-full rounded-xl" />{imgs.length > 1 && <div className="grid grid-cols-5 gap-2">{imgs.slice(1).map((i) => <SafeImg key={i} src={i} alt="" className="aspect-square w-full rounded-lg" />)}</div>}</div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{l.title}</h1><p className="text-2xl font-bold">{money(l.price, 'PKR')}</p>
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted">{l.city && <span>{l.city}</span>}{l.condition && <Badge>{l.condition}</Badge>}{l.user?.name && <span>Seller: {l.user.name.split(' ')[0]}</span>}</p>
          {l.user?.id && <EntityActions recipientId={l.user.id} refType="c2c" refId={l.id} subject={l.title} favorite={{ kind: 'c2c', ref: l.id }} report={{ type: 'c2c', id: l.id }} inquiryLabel="Chat with seller" />}
          <p className="whitespace-pre-line text-ink/90">{l.description}</p>
          <p className="text-xs text-muted">No escrow or buyer protection is offered. Meet in a safe public place and inspect the item before paying.</p>
        </div>
      </div>
    </div>
  );
}
