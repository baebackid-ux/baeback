import { ArrowRight, Flag, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import StatusPill from '../components/StatusPill';
import { StatCardSkeleton } from '../components/Skeleton';
import { fallbackItems } from '../data/mockData';
import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AdminPage() {
  const reports = [
    { id: 'report-1', title: 'Barang tidak sesuai kondisi', status: 'submitted' },
    { id: 'report-2', title: 'Indikasi penyalahgunaan akun', status: 'reviewing' },
  ];

  const [stats, setStats] = useState({
    itemsFulfilledThisWeek: 0,
    topCategories: [],
    activeDonorsLast30Days: 0,
    loading: false,
  });

  useEffect(() => {
    async function loadStats() {
      setStats((s) => ({ ...s, loading: true }));
      if (!isSupabaseConfigured) {
        // fallback: derive from fallbackItems
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const itemsWeek = fallbackItems.filter((it) => new Date(it.created_at) >= oneWeekAgo && it.status === 'received');
        const items30 = fallbackItems.filter((it) => new Date(it.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
        const categoryCounts = items30.reduce((acc, it) => { acc[it.category] = (acc[it.category] || 0) + 1; return acc; }, {});
        const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
        const activeDonors = new Set(items30.map((it) => it.donor_id)).size || 75;
        setStats({ itemsFulfilledThisWeek: itemsWeek.length, topCategories, activeDonorsLast30Days: activeDonors, loading: false });
        return;
      }

      try {
        // fetch recent items (limit to reasonable number)
        const { data: itemsData, error: itemsError } = await supabase.from('items').select('id,category,created_at,donor_id,status').order('created_at', { ascending: false }).limit(1000);
        if (itemsError) throw itemsError;

        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const itemsFulfilledRes = await supabase.from('items').select('id').gte('updated_at', oneWeekAgo).eq('status', 'received');
        const itemsFulfilledThisWeek = itemsFulfilledRes.data ? itemsFulfilledRes.data.length : 0;

        const items30 = itemsData ? itemsData.filter((it) => new Date(it.created_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) : [];
        const categoryCounts = items30.reduce((acc, it) => { acc[it.category] = (acc[it.category] || 0) + 1; return acc; }, {});
        const topCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));
        const activeDonors = new Set(items30.map((it) => it.donor_id)).size;

        setStats({ itemsFulfilledThisWeek, topCategories, activeDonorsLast30Days: activeDonors, loading: false });
      } catch (err) {
        console.error('Failed to load admin stats', err.message || err);
        setStats((s) => ({ ...s, loading: false }));
      }
    }

    loadStats();
  }, []);

  return (
    <main className="admin-page">
      <div className="container admin-topbar"><span><ShieldCheck size={16} /> Ruang pengelola</span><span>Admin BaeBack</span></div>
      <div className="container page-heading split-heading">
        <div>
          <span className="eyebrow">Ikhtisar hari ini</span>
          <h1>Komunitas yang sehat<br /><em>dimulai dari sini.</em></h1>
          <p>Kelola postingan resmi, tinjau laporan, dan jaga pengalaman berbagi tetap aman.</p>
        </div>
        <Link className="btn btn-primary" to="/donasikan">
          <UploadCloud size={18} />
          Buat official post
        </Link>
      </div>
      <section className="container dashboard-stats">
        <div className="stat-card">
          <ShieldCheck size={21} />
          <strong>{stats.itemsFulfilledThisWeek}</strong>
          <span>Barang tersalurkan minggu ini</span>
        </div>
        <div className="stat-card">
          <Flag size={21} />
          <strong>{reports.length}</strong>
          <span>Report perlu ditinjau</span>
        </div>
        <div className="stat-card"><Users size={21} /><strong>{stats.activeDonorsLast30Days}</strong><span>Donatur aktif (30 hari)</span></div>
      </section>
      <section className="container section admin-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">Official charity</span><h2>Postingan resmi</h2></div><Link className="text-link" to="/barang">Lihat semua <ArrowRight size={15} /></Link>
        </div>
        <div className="card-grid">
          {fallbackItems.filter((item) => item.post_type === 'official').map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="container section admin-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">Insight</span><h2>Kategori teratas (30 hari)</h2></div>
        </div>
        <div className="card-grid">
          {stats.loading ? (
            Array.from({ length: 3 }, (_, index) => <StatCardSkeleton key={index} index={index} />)
          ) : stats.topCategories.length ? (
            stats.topCategories.map((c) => (
              <div className="stat-card content-reveal" key={c.name}>
                <strong>{c.count}</strong>
                <span>{c.name}</span>
              </div>
            ))
          ) : (
            <p style={{ gridColumn: '1 / -1' }}>Tidak ada data kategori.</p>
          )}
        </div>
      </section>
      <section className="container section admin-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">Keamanan</span><h2>Report yang perlu ditinjau</h2></div>
        </div>
        <div className="request-list">
          {reports.map((report) => (
            <article className="request-row" key={report.id}>
              <div className="request-main"><span className="request-avatar"><Flag size={16} /></span><div><small>Laporan komunitas</small><strong>{report.title}</strong></div></div>
              <StatusPill status={report.status}>Perlu ditinjau</StatusPill>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
