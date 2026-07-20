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
import { CardGridSkeleton, ItemCardSkeleton, SkeletonBlock } from '../components/Skeleton';
import { fallbackImpact, fallbackItems, fallbackNeeds } from '../data/mockData';
import { categories } from '../lib/constants';
import { buildFaqJsonLd, buildOrganizationJsonLd, buildWebSiteJsonLd, DEFAULT_DESCRIPTION } from '../lib/seo';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { getOptimizedImageUrl } from '../lib/formatters';

export default function HomePage() {
  const [items, setItems] = useState(isSupabaseConfigured ? [] : fallbackItems);
  const [needs, setNeeds] = useState(isSupabaseConfigured ? [] : fallbackNeeds);
  const [impact, setImpact] = useState(isSupabaseConfigured ? [] : fallbackImpact);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      question: 'Apa itu BaeBack?',
      answer: 'BaeBack adalah platform charity marketplace berbasis web yang memungkinkan masyarakat Indonesia untuk saling berbagi barang layak pakai secara gratis (Rp 0). Tidak diperbolehkan ada transaksi komersial di platform kami.'
    },
    {
      question: 'Bagaimana cara donasi barang di BaeBack?',
      answer: 'Anda cukup membuat akun, masuk ke dashboard, klik "Donasikan", unggah foto barang layak pakai, isi deskripsi, dan tentukan metode pengambilan (diambil langsung oleh penerima atau dikirim melalui kurir).'
    },
    {
      question: 'Apakah barang di BaeBack benar-benar gratis?',
      answer: 'Ya, semua barang yang terdaftar di BaeBack berharga Rp 0. Tidak ada biaya keanggotaan, potongan, atau biaya admin. Biaya kurir/pengiriman disepakati langsung secara transparan oleh pemberi dan penerima.'
    },
    {
      question: 'Bagaimana cara mengajukan barang yang saya butuhkan?',
      answer: 'Cari barang yang Anda butuhkan di katalog. Klik tombol "Ajukan ambil barang", isi alasan mengapa Anda membutuhkan barang tersebut beserta rencana waktu pengambilannya. Pemberi barang akan meninjau dan memilih pengaju yang paling sesuai.'
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadHome() {
      setLoading(true);
      try {
        const [{ data: itemData }, { data: needData }, { data: impactData }] = await Promise.all([
          supabase.from('items').select('*').in('status', ['available', 'reserved']).order('created_at', { ascending: false }).limit(8),
          supabase.from('need_posts').select('*').in('status', ['open', 'offered']).order('created_at', { ascending: false }).limit(3),
          supabase.from('impact_stats').select('label,value').order('sort_order'),
        ]);
        setItems(itemData ?? []);
        setNeeds(needData ?? []);
        setImpact(impactData ?? []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHome();
  }, []);

  const officialItems = items.filter((item) => item.post_type === 'official');
  const categoryIcons = [Shirt, BookOpen, Laptop, Baby, Armchair, Puzzle, CookingPot, MoreHorizontal];

  return (
    <main>
      <SEO
        title="Donasi Barang & Barang Gratis Semarang"
        description={DEFAULT_DESCRIPTION}
        path="/"
        jsonLd={[buildOrganizationJsonLd(), buildWebSiteJsonLd(), buildFaqJsonLd()]}
      />
      <section className="hero hero-full">
        <div className="container hero-grid hero-full-grid">
          <div className="hero-copy">
            <span className="hero-kicker"><Sparkles size={14} /> Komunitas berbagi barang</span>
            <h1>Donasi Barang Bekas & Berbagi Barang Gratis di Semarang</h1>
            <p>BaeBack mempertemukan donasi baju bekas dan barang layak pakai dari orang-orang baik dengan mereka yang membutuhkan di Semarang—100% gratis tanpa biaya.</p>
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
            <Link to={items[0]?.id ? `/barang/${items[0].id}` : '/donasikan'} className="hero-featured-card">
              <img src={getOptimizedImageUrl(items[0]?.image_url || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80', 600)} alt={items[0]?.title || 'Mari berbagi'} decoding="async" />
              <span className="free-label">Untuk dibagikan</span>
              <div><small>{items[0]?.category || 'BaeBack'}</small><strong>{items[0]?.title || 'Bagikan barang pertama Anda'}</strong><span>{items[0]?.location || 'Indonesia'} · {items[0]?.condition || 'Layak Pakai'}</span></div>
            </Link>
            <Link to={items[1]?.id ? `/barang/${items[1].id}` : '/barang'} className="hero-side-card">
              <img src={getOptimizedImageUrl(items[1]?.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80', 400)} alt={items[1]?.title || 'Mulai menjelajah'} decoding="async" />
              <div><small>Baru dibagikan</small><strong>{items[1]?.title || 'Bantu sesama di sekitar Anda'}</strong></div>
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
          {loading ? (
            <CardGridSkeleton count={4} />
          ) : (
            <div className="card-grid">{items.slice(0, 4).map((item) => <ItemCard key={item.id} item={item} />)}</div>
          )}
        </div>
      </section>

      <section className="container section editorial-feature">
        <div className="editorial-feature-copy"><span className="eyebrow">Official charity</span><h2>Lebih terkurasi.<br /><em>Tetap sepenuh hati.</em></h2><p>Program resmi BaeBack bekerja sama dengan komunitas dan donatur terverifikasi untuk menyalurkan barang tepat sasaran.</p><Link className="btn btn-secondary" to="/barang">Lihat pilihan resmi <ArrowRight size={17} /></Link></div>
        <div className="editorial-feature-cards">
          {loading ? (
            <>
              <ItemCardSkeleton index={0} />
              <ItemCardSkeleton index={1} />
            </>
          ) : (
            (officialItems.length ? officialItems : items).slice(0, 2).map((item) => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>

      <section className="need-home">
        <div className="container need-home-grid">
          <div className="need-home-intro"><span className="eyebrow">Need Board</span><h2>Kamu mungkin punya<br />yang mereka cari.</h2><p>Kebutuhan ditulis langsung oleh komunitas agar bantuan kecil dapat sampai dengan lebih tepat.</p><Link className="btn btn-primary" to="/need-board">Buka Need Board <ArrowRight size={17} /></Link></div>
          <div className="need-home-list">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="need-home-row skeleton-card" style={{ '--skeleton-index': index, border: 'none', background: 'transparent' }} aria-hidden="true">
                  <span className="need-index">0{index + 1}</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <SkeletonBlock className="skeleton-line skeleton-line--tiny" />
                    <SkeletonBlock className="skeleton-title" style={{ margin: 0, height: '16px', width: '80%' }} />
                  </div>
                  <SkeletonBlock className="skeleton-pill" />
                </div>
              ))
            ) : (
              needs.map((need, index) => <Link to={`/need-board/${need.id}`} key={need.id} className="need-home-row"><span className="need-index">0{index + 1}</span><div><small>{need.category} · {need.location}</small><strong>{need.title}</strong></div><span className="need-row-status">{need.status === 'open' ? 'Masih dibutuhkan' : 'Ada tawaran'}</span><ArrowRight size={18} /></Link>)
            )}
          </div>
        </div>
      </section>

      <section className="container section impact-section">
        <div className="impact-intro"><span className="eyebrow">Dampak bersama</span><h2>Satu barang bisa mengubah<br />lebih dari satu hari.</h2><p>Setiap angka adalah barang yang tak jadi terbuang dan seseorang yang mendapat manfaat baru.</p></div>
        {loading ? (
          <div className="impact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="impact-card skeleton-card" style={{ '--skeleton-index': index }} aria-hidden="true">
                <SkeletonBlock className="skeleton-icon skeleton-icon--stat" as="div" style={{ margin: '0 auto 12px' }} />
                <SkeletonBlock className="skeleton-stat-value" as="div" style={{ margin: '0 auto 8px', width: '64px', height: '32px' }} />
                <SkeletonBlock className="skeleton-line" as="div" style={{ margin: '0 auto', width: '96px', height: '14px' }} />
              </div>
            ))}
          </div>
        ) : (
          <ImpactCounter stats={impact} />
        )}
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

      <section className="container section faq-section" style={{ margin: '80px auto' }}>
        <div className="section-heading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="eyebrow">Pertanyaan Umum</span>
            <h2>Punya pertanyaan seputar BaeBack?</h2>
            <p style={{ margin: '10px auto 0' }}>Berikut adalah jawaban untuk beberapa pertanyaan yang paling sering diajukan.</p>
          </div>
        </div>
        <div className="faq-list" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                style={{
                  border: '1px solid var(--border-color, #eee)',
                  borderRadius: '12px',
                  backgroundColor: isOpen ? 'var(--bg-light, #fafafa)' : '#fff',
                  transition: 'all 0.2s ease',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: '1.05rem',
                    color: 'var(--text-main, #111)',
                    gap: '16px'
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    fontSize: '1.4rem',
                    transform: isOpen ? 'rotate(45deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    color: 'var(--color-primary, #0f766e)',
                    lineHeight: '1'
                  }}>
                    +
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: isOpen ? '200px' : '0',
                    opacity: isOpen ? '1' : '0',
                    transition: 'all 0.3s ease',
                    padding: isOpen ? '0 24px 20px 24px' : '0 24px',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: 'var(--text-muted, #555)'
                  }}
                >
                  <p style={{ margin: '0' }}>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container final-cta">
        <span className="final-cta-icon"><HeartHandshake size={26} /></span>
        <div><span className="eyebrow">Mulai dari satu barang</span><h2>Ada sesuatu di rumahmu<br />yang bisa kembali berarti?</h2><p>Unggah dalam beberapa menit. Kami bantu mempertemukannya dengan orang yang tepat.</p></div>
        <div className="final-cta-actions"><Link className="btn btn-accent" to="/donasikan">Bagikan sekarang <ArrowRight size={17} /></Link><Link className="text-link" to="/need-board">Lihat kebutuhan komunitas</Link></div>
      </section>
    </main>
  );
}
