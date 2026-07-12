import {
  ArrowRight,
  Armchair,
  Baby,
  BookOpen,
  Check,
  CookingPot,
  HeartHandshake,
  Laptop,
  MoreHorizontal,
  Puzzle,
  ShieldCheck,
  Shirt,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImpactCounter from '../components/ImpactCounter';
import ItemCard from '../components/ItemCard';
import SEO from '../components/SEO';
import StepTimeline from '../components/StepTimeline';
import { fallbackImpact, fallbackItems, fallbackNeeds } from '../data/mockData';
import { categories } from '../lib/constants';
import { buildOrganizationJsonLd, buildWebSiteJsonLd, DEFAULT_DESCRIPTION } from '../lib/seo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function HomePage() {
  const [items, setItems] = useState(fallbackItems);
  const [needs, setNeeds] = useState(fallbackNeeds);
  const [impact, setImpact] = useState(fallbackImpact);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadHome() {
      const [{ data: itemData }, { data: needData }, { data: impactData }] = await Promise.all([
        supabase.from('items').select('*').in('status', ['available', 'reserved']).order('created_at', { ascending: false }).limit(8),
        supabase.from('need_posts').select('*').in('status', ['open', 'offered']).order('created_at', { ascending: false }).limit(3),
        supabase.from('impact_stats').select('label,value').order('sort_order'),
      ]);
      if (itemData?.length) setItems(itemData);
      if (needData?.length) setNeeds(needData);
      if (impactData?.length) setImpact(impactData);
    }
    loadHome();
  }, []);

  const officialItems = items.filter((item) => item.post_type === 'official');
  const categoryIcons = [Shirt, BookOpen, Laptop, Baby, Armchair, Puzzle, CookingPot, MoreHorizontal];

  return (
    <main>
      <SEO
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]}
      />
      <section className="hero hero-full">
        <div className="container hero-grid hero-full-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><Sparkles size={14} /> Komunitas berbagi barang</span>
            <h1>Berbagi barang baik, dengan cara yang terasa ringan.</h1>
            <p>BaeBack mempertemukan barang layak pakai dengan orang yang benar-benar membutuhkannya—hangat, aman, dan tanpa biaya.</p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/barang">Jelajahi barang <ArrowRight size={17} /></Link>
              <Link className="btn btn-quiet" to="/donasikan">Saya ingin berbagi</Link>
            </div>
            <div className="hero-trust">
              <span><Check size={15} /> Selalu gratis</span>
              <span><ShieldCheck size={15} /> Komunitas terverifikasi</span>
              <span><HeartHandshake size={15} /> Berbasis kebutuhan</span>
            </div>
          </div>

          <div className="hero-editorial" aria-label="Pilihan barang BaeBack">
            <div className="hero-editorial-note"><span>Hari ini di BaeBack</span><strong>8 barang baru siap menemukan rumah keduanya.</strong></div>
            <Link to={`/barang/${items[0]?.id}`} className="hero-featured-card">
              <img src={items[0]?.image_url} alt={items[0]?.title} />
              <span className="free-label">Untuk dibagikan</span>
              <div><small>{items[0]?.category}</small><strong>{items[0]?.title}</strong><span>{items[0]?.location} · {items[0]?.condition}</span></div>
            </Link>
            <Link to={`/barang/${items[1]?.id}`} className="hero-side-card">
              <img src={items[1]?.image_url} alt={items[1]?.title} />
              <div><small>Baru dibagikan</small><strong>{items[1]?.title}</strong></div>
            </Link>
            <div className="hero-impact-seal"><HeartHandshake size={22} /><strong>1.240+</strong><span>barang kembali<br />bermanfaat</span></div>
          </div>
        </div>
      </section>

      <section className="home-strip">
        <div className="container home-strip-inner"><span>Bukan marketplace biasa.</span><p>Tak ada harga, tak ada checkout. Hanya barang baik, alasan yang jujur, dan manusia yang saling membantu.</p></div>
      </section>

      <section className="container section category-section">
        <div className="section-heading">
          <div><span className="eyebrow">Temukan yang kamu butuhkan</span><h2>Jelajahi berdasarkan kategori</h2></div>
          <Link className="text-link" to="/barang">Semua barang <ArrowRight size={16} /></Link>
        </div>
        <div className="category-grid">
          {categories.slice(0, 8).map((category, index) => {
            const Icon = categoryIcons[index];
            return <Link key={category} to={`/barang?category=${encodeURIComponent(category)}`} className="category-card"><span className="category-icon"><Icon size={21} /></span><span>{category}</span><ArrowRight size={15} /></Link>;
          })}
        </div>
      </section>

      <section className="section catalog-home">
        <div className="container">
          <div className="section-heading">
            <div><span className="eyebrow">Baru dibagikan</span><h2>Siap untuk cerita berikutnya</h2><p>Barang layak pakai dari orang-orang baik di sekitar kita.</p></div>
            <Link className="text-link" to="/barang">Lihat katalog <ArrowRight size={16} /></Link>
          </div>
          <div className="card-grid">{items.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} />)}</div>
        </div>
      </section>

      <section className="container section editorial-feature">
        <div className="editorial-feature-copy"><span className="eyebrow">Official charity</span><h2>Lebih terkurasi.<br /><em>Tetap sepenuh hati.</em></h2><p>Program resmi BaeBack bekerja sama dengan komunitas dan donatur terverifikasi untuk menyalurkan barang tepat sasaran.</p><Link className="btn btn-secondary" to="/barang">Lihat pilihan resmi <ArrowRight size={17} /></Link></div>
        <div className="editorial-feature-cards">{(officialItems.length ? officialItems : items).slice(0, 2).map((item) => <ItemCard key={item.id} item={item} />)}</div>
      </section>

      <section className="need-home">
        <div className="container need-home-grid">
          <div className="need-home-intro"><span className="eyebrow">Need Board</span><h2>Kamu mungkin punya<br />yang mereka cari.</h2><p>Kebutuhan ditulis langsung oleh komunitas agar bantuan kecil dapat sampai dengan lebih tepat.</p><Link className="btn btn-primary" to="/need-board">Buka Need Board <ArrowRight size={17} /></Link></div>
          <div className="need-home-list">
            {needs.map((need, index) => <Link to={`/need-board/${need.id}`} key={need.id} className="need-home-row"><span className="need-index">0{index + 1}</span><div><small>{need.category} · {need.location}</small><strong>{need.title}</strong></div><span className="need-row-status">{need.status === 'open' ? 'Masih dibutuhkan' : 'Ada tawaran'}</span><ArrowRight size={18} /></Link>)}
          </div>
        </div>
      </section>

      <section className="container section impact-section">
        <div className="impact-intro"><span className="eyebrow">Dampak bersama</span><h2>Satu barang bisa mengubah<br />lebih dari satu hari.</h2><p>Setiap angka adalah barang yang tak jadi terbuang dan seseorang yang mendapat manfaat baru.</p></div>
        <ImpactCounter stats={impact} />
      </section>

      <section className="container section how-section">
        <div className="section-heading"><div><span className="eyebrow">Cara kerjanya</span><h2>Sederhana dari awal sampai barang diterima.</h2></div></div>
        <StepTimeline steps={[
          { title: 'Bagikan dengan jujur', description: 'Unggah foto, kondisi, dan detail pengambilan yang jelas.' },
          { title: 'Pengajuan yang bermakna', description: 'Penerima menyampaikan kebutuhan dan rencana pengambilan.' },
          { title: 'Pilih dengan tenang', description: 'Pemberi meninjau dan memilih penerima yang paling sesuai.' },
          { title: 'Serahkan & lanjutkan cerita', description: 'Atur pengambilan, konfirmasi penerimaan, dan beri ulasan.' },
        ]} />
      </section>

      <section className="container final-cta">
        <span className="final-cta-icon"><HeartHandshake size={26} /></span>
        <div><span className="eyebrow">Mulai dari satu barang</span><h2>Ada sesuatu di rumahmu<br />yang bisa kembali berarti?</h2><p>Unggah dalam beberapa menit. Kami bantu mempertemukannya dengan orang yang tepat.</p></div>
        <div className="final-cta-actions"><Link className="btn btn-accent" to="/donasikan">Bagikan sekarang <ArrowRight size={17} /></Link><Link className="text-link" to="/need-board">Lihat kebutuhan komunitas</Link></div>
      </section>
    </main>
  );
}
