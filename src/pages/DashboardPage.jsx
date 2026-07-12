import { ArrowRight, Gift, Heart, Inbox, MessageCircle, Plus, Search, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountNav from '../components/AccountNav';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import SEO from '../components/SEO';
import StatusPill from '../components/StatusPill';
import { DashboardSkeleton } from '../components/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { fallbackItems, fallbackNeeds, fallbackRequests } from '../data/mockData';
import { badgeLabels } from '../lib/constants';
import { getRequestStatusLabel } from '../lib/formatters';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState('ringkasan');
  const [dashboardData, setDashboardData] = useState({
    items: isSupabaseConfigured ? [] : fallbackItems.slice(0, 3),
    requests: isSupabaseConfigured ? [] : fallbackRequests.slice(0, 3),
    favorites: isSupabaseConfigured ? [] : fallbackItems.slice(0, 2),
    needs: isSupabaseConfigured ? [] : fallbackNeeds.slice(0, 2),
    loading: isSupabaseConfigured,
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return undefined;

    let mounted = true;

    async function loadDashboard() {
      setDashboardData((current) => ({ ...current, loading: true }));

      const [itemsResult, requestsResult, favoritesResult, needsResult] = await Promise.all([
        supabase.from('items').select('id,title,category,condition,location,pickup_method,status,post_type,image_url,description,requirements,created_at').eq('donor_id', user.id).order('created_at', { ascending: false }).limit(6),
        supabase.from('pickup_requests').select('id,item_id,requester_id,reason,status,planned_pickup_at,created_at,item:items(title, donor_id, image_url),requester:profiles(full_name)').order('created_at', { ascending: false }).limit(12),
        supabase.from('favorites').select('item:items(id,title,category,condition,location,pickup_method,status,post_type,image_url,description,requirements,created_at)').eq('user_id', user.id).limit(6),
        supabase.from('need_posts').select('id,title,category,location,urgency,status,description,created_at').eq('requester_id', user.id).order('created_at', { ascending: false }).limit(6),
      ]);

      if (!mounted) return;

      const ownedItems = itemsResult.data ?? [];
      const visibleRequests = requestsResult.data ?? [];
      const savedItems = (favoritesResult.data ?? []).map((entry) => entry.item).filter(Boolean);
      const userNeeds = needsResult.data ?? [];
 
      setDashboardData({
        items: ownedItems,
        requests: visibleRequests.filter((request) => request.requester_id === user.id || request.item?.donor_id === user.id),
        favorites: savedItems,
        needs: userNeeds,
        loading: false,
      });
    }
 
    loadDashboard().catch(() => {
      if (!mounted) return;
      setDashboardData({
        items: isSupabaseConfigured ? [] : fallbackItems.slice(0, 3),
        requests: isSupabaseConfigured ? [] : fallbackRequests.slice(0, 3),
        favorites: isSupabaseConfigured ? [] : fallbackItems.slice(0, 2),
        needs: isSupabaseConfigured ? [] : fallbackNeeds.slice(0, 2),
        loading: false,
      });
    });

    return () => {
      mounted = false;
    };
  }, [user]);

  const stats = [
    { label: 'Barang dibagikan', value: dashboardData.items.length, icon: Gift },
    { label: 'Pengajuan aktif', value: dashboardData.requests.length, icon: Inbox },
    { label: 'Disimpan', value: dashboardData.favorites.length, icon: Search },
    { label: 'Kindness points', value: profile?.kindness_points || 120, icon: Heart },
  ];

  const quickActions = [
    { to: '/donasikan', label: 'Bagikan barang', description: 'Unggah barang yang masih layak pakai.', icon: Plus },
    { to: '/barang', label: 'Jelajahi barang', description: 'Cari barang yang bisa kamu ajukan.', icon: Search },
    { to: '/need-board', label: 'Lihat kebutuhan', description: 'Tawarkan barang yang cocok untuk kebutuhan.', icon: MessageCircle },
  ];

  const recentItems = dashboardData.items;
  const recentRequests = dashboardData.requests;
  const recentFavorites = dashboardData.favorites;
  const recentNeeds = dashboardData.needs;
  const isNewUser = !recentItems.length && !recentRequests.length && !recentFavorites.length && !recentNeeds.length;

  const tabs = [
    { key: 'ringkasan', label: 'Ringkasan', count: stats.length },
    { key: 'barang', label: 'Barang', count: recentItems.length },
    { key: 'pengajuan', label: 'Pengajuan', count: recentRequests.length },
    { key: 'favorit', label: 'Favorit', count: recentFavorites.length },
    { key: 'kebutuhan', label: 'Kebutuhan', count: recentNeeds.length },
  ];

  function renderTabEmpty(title, description, action, icon = Search) {
    const Icon = icon;
    return (
      <EmptyState
        title={title}
        description={description}
        action={action}
        icon={<Icon size={28} aria-hidden="true" />}
      />
    );
  }

  function renderSummaryEmpty() {
    return (
      <EmptyState
        title="Dashboard masih kosong"
        description="Mulai dari satu langkah kecil: bagikan barang, simpan barang yang menarik, atau lihat kebutuhan yang cocok di sekitar kamu."
        action={(
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/donasikan">Bagikan barang</Link>
            <Link className="btn btn-secondary" to="/barang">Cari barang</Link>
          </div>
        )}
      />
    );
  }

  function renderTabContent() {
    if (activeTab === 'ringkasan') {
      if (isNewUser) return renderSummaryEmpty();

      return (
        <>
          <section>
            <div className="section-heading compact"><div><span className="eyebrow">Aksi cepat</span><h2>Lanjutkan dari sini</h2></div></div>
            <div className="card-grid">
              {quickActions.map(({ to, label, description, icon: Icon }) => (
                <Link className="stat-card" to={to} key={label}>
                  <Icon size={21} />
                  <strong>{label}</strong>
                  <span>{description}</span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <div className="section-heading compact"><div><span className="eyebrow">Barangmu</span><h2>Sedang kamu bagikan</h2></div><Link className="text-link" to="/barang">Lihat publik</Link></div>
            {recentItems.length ? <div className="mini-card-grid">{recentItems.map((item) => <ItemCard key={item.id} item={item} />)}</div> : renderTabEmpty('Belum ada barang dibagikan', 'Barang yang kamu unggah akan tampil di sini. Mulai dengan menambahkan satu barang yang masih layak pakai.', <Link className="btn btn-primary" to="/donasikan">Bagikan barang</Link>, Gift)}
          </section>

          <section>
            <div className="section-heading compact"><div><span className="eyebrow">Tersimpan</span><h2>Barang favoritmu</h2></div><Link className="text-link" to="/daftar-minat">Kelola daftar</Link></div>
            {recentFavorites.length ? <div className="mini-card-grid">{recentFavorites.map((item) => <ItemCard key={item.id} item={item} />)}</div> : renderTabEmpty('Belum ada barang disimpan', 'Simpan barang yang menarik perhatianmu agar mudah kembali nanti.', <Link className="btn btn-primary" to="/barang">Cari Barang</Link>, Search)}
          </section>

          <section>
            <div className="section-heading compact"><div><span className="eyebrow">Perlu perhatian</span><h2>Pengajuan terbaru</h2></div><Link className="text-link" to="/pengajuan">Kelola semua</Link></div>
            {recentRequests.length ? <div className="request-list">{recentRequests.map((request) => <article className="request-row" key={request.id}><span className="request-avatar">{request.requester_name?.[0] || 'P'}</span><div><small>{request.requester_name || 'Pengguna'}</small><strong>{request.item_title}</strong><p>{request.reason}</p></div><StatusPill status={request.status}>{getRequestStatusLabel(request.status)}</StatusPill><Link to="/pengajuan" aria-label="Buka pengajuan"><ArrowRight size={18} /></Link></article>)}</div> : renderTabEmpty('Belum ada pengajuan', 'Saat ada pengajuan untuk barangmu, semuanya akan tampil di sini.', <Link className="btn btn-primary" to="/barang">Lihat barang publik</Link>, Inbox)}
          </section>

          <section>
            <div className="section-heading compact"><div><span className="eyebrow">Kebutuhan aktif</span><h2>Need Board terdekat</h2></div><Link className="text-link" to="/need-board">Lihat semua</Link></div>
            {recentNeeds.length ? <div className="mini-card-grid">{recentNeeds.map((need) => <article className="stat-card" key={need.id}><MessageCircle size={20} /><strong>{need.title}</strong><span>{need.location} · {need.urgency}</span></article>)}</div> : renderTabEmpty('Belum ada kebutuhan yang kamu buat', 'Jika kamu menulis kebutuhan, ringkasannya akan muncul di sini supaya mudah dipantau.', <Link className="btn btn-primary" to="/need-board">Tulis kebutuhan</Link>, MessageCircle)}
          </section>

          <section className="message-preview"><MessageCircle size={21} /><div><strong>Chat akan terbuka setelah pengajuan disetujui</strong><span>Jaga percakapan dan kesepakatan pengambilan tetap aman.</span></div></section>

          {isSupabaseConfigured && (
            <section className="dashboard-data-note">
              <Search size={18} />
              <div>
                <strong>Data terhubung ke Supabase</strong>
                <span>Dashboard ini membaca barang, pengajuan, favorit, dan kebutuhan milik akunmu langsung dari database.</span>
              </div>
            </section>
          )}
        </>
      );
    }

    if (activeTab === 'barang') {
      return recentItems.length ? (
        <div className="mini-card-grid">{recentItems.map((item) => <ItemCard key={item.id} item={item} />)}</div>
      ) : renderTabEmpty('Belum ada barang dibagikan', 'Kamu belum punya barang aktif untuk ditampilkan. Unggah satu barang dan mulai dari sana.', <Link className="btn btn-primary" to="/donasikan">Bagikan barang</Link>, Gift);
    }

    if (activeTab === 'pengajuan') {
      return recentRequests.length ? (
        <div className="request-list">{recentRequests.map((request) => <article className="request-row" key={request.id}><span className="request-avatar">{request.requester_name?.[0] || 'P'}</span><div><small>{request.requester_name || 'Pengguna'}</small><strong>{request.item_title}</strong><p>{request.reason}</p></div><StatusPill status={request.status}>{getRequestStatusLabel(request.status)}</StatusPill><Link to="/pengajuan" aria-label="Buka pengajuan"><ArrowRight size={18} /></Link></article>)}</div>
      ) : renderTabEmpty('Belum ada pengajuan', 'Saat orang mulai mengajukan barangmu, daftar ini akan terisi otomatis.', <Link className="btn btn-primary" to="/barang">Lihat barang publik</Link>, Inbox);
    }

    if (activeTab === 'favorit') {
      return recentFavorites.length ? (
        <div className="mini-card-grid">{recentFavorites.map((item) => <ItemCard key={item.id} item={item} />)}</div>
      ) : renderTabEmpty('Daftar minat masih kosong', 'Simpan barang yang menarik perhatianmu agar bisa dibandingkan nanti.', <Link className="btn btn-primary" to="/barang">Cari Barang</Link>, Search);
    }

    return recentNeeds.length ? (
      <div className="mini-card-grid">{recentNeeds.map((need) => <article className="stat-card" key={need.id}><MessageCircle size={20} /><strong>{need.title}</strong><span>{need.location} · {need.urgency}</span></article>)}</div>
    ) : renderTabEmpty('Belum ada kebutuhan', 'Buat kebutuhan baru atau lihat kebutuhan komunitas untuk menemukan barang yang cocok.', <Link className="btn btn-primary" to="/need-board">Buka Need Board</Link>, MessageCircle);
  }

  return (
    <main className="account-page">
      <SEO title="Dashboard" noindex />
      <div className="container"><AccountNav /></div>
      <header className="container account-heading">
        <div>
          <span className="eyebrow">Ruang aktivitasmu</span>
          <h1>Selamat datang kembali,<br /><em>{profile?.full_name || 'Pengguna BaeBack'}.</em></h1>
          <p>Lihat ringkasan kontribusi, pengajuan terbaru, dan aksi berikutnya dari satu tempat.</p>
          {!isSupabaseConfigured && <p className="detail-reassurance">Mode demo aktif. Data yang tampil adalah contoh agar alurnya tetap bisa diuji tanpa database.</p>}
        </div>
        <div className="dashboard-hero-actions">
          <StatusPill status="available">{badgeLabels[profile?.badge] || 'New Donor'}</StatusPill>
          <Link className="btn btn-primary" to="/donasikan"><Plus size={18} /> Bagikan barang</Link>
        </div>
      </header>

      <section className="container dashboard-stats">{stats.map(({ label, value, icon: Icon }) => <div className="stat-card" key={label}><span className="stat-icon"><Icon size={20} /></span><strong>{value}</strong><span>{label}</span></div>)}</section>

      <section className="container dashboard-tabs-wrap">
        <div className="dashboard-tabs" role="tablist" aria-label="Tab dashboard akun">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`dashboard-tab ${activeTab === tab.key ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={activeTab === tab.key}
            >
              <span>{tab.label}</span>
              <small>{tab.count}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="container dashboard-layout">
        <aside className="profile-summary">
          <div className="profile-summary-top">
            <div className="avatar">{profile?.full_name?.[0] || 'B'}</div>
            <div>
              <h2>{profile?.full_name || 'Tamu BaeBack'}</h2>
              <p>{profile?.location || 'Indonesia'}</p>
            </div>
          </div>
          <StatusPill status="available">{badgeLabels[profile?.badge] || 'New Donor'}</StatusPill>
          <div className="profile-progress">
            <div><span>Menuju Trusted Donor</span><strong>68%</strong></div>
            <span><i /></span>
          </div>
          <div className="rating-row"><Star size={17} fill="currentColor" /> {profile?.rating_average || '4.8'} <span>rating komunitas</span></div>
          <Link className="text-link" to="/profil">Lihat profil kontribusi <ArrowRight size={15} /></Link>
        </aside>

        <div className="dashboard-main">
          {dashboardData.loading && isSupabaseConfigured ? (
            <DashboardSkeleton />
          ) : (
            <div className="content-reveal">{renderTabContent()}</div>
          )}
        </div>
      </section>
    </main>
  );
}
