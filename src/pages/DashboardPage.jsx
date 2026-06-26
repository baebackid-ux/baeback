import { ArrowRight, CheckCircle2, Gift, Heart, Inbox, MessageCircle, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccountNav from '../components/AccountNav';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { fallbackItems, fallbackRequests } from '../data/mockData';
import { badgeLabels } from '../lib/constants';
import { getRequestStatusLabel } from '../lib/formatters';

export default function DashboardPage() {
  const { profile } = useAuth();
  const stats = [
    { label: 'Barang dibagikan', value: fallbackItems.length, icon: Gift },
    { label: 'Pengajuan aktif', value: fallbackRequests.length, icon: Inbox },
    { label: 'Barang diterima', value: 4, icon: CheckCircle2 },
    { label: 'Kindness points', value: profile?.kindness_points || 120, icon: Heart },
  ];

  return (
    <main className="account-page">
      <div className="container"><AccountNav /></div>
      <header className="container account-heading"><div><span className="eyebrow">Ruang aktivitasmu</span><h1>Selamat datang kembali,<br /><em>{profile?.full_name || 'Pengguna BaeBack'}.</em></h1><p>Lihat perjalanan barang, kelola pengajuan, dan lanjutkan kebaikanmu dari sini.</p></div><Link className="btn btn-primary" to="/donasikan"><Plus size={18} /> Bagikan barang</Link></header>

      <section className="container dashboard-stats">{stats.map(({ label, value, icon: Icon }) => <div className="stat-card" key={label}><span className="stat-icon"><Icon size={20} /></span><strong>{value}</strong><span>{label}</span></div>)}</section>

      <section className="container dashboard-layout">
        <aside className="profile-summary"><div className="profile-summary-top"><div className="avatar">{profile?.full_name?.[0] || 'B'}</div><div><h2>{profile?.full_name || 'Tamu BaeBack'}</h2><p>{profile?.location || 'Indonesia'}</p></div></div><StatusPill status="available">{badgeLabels[profile?.badge] || 'New Donor'}</StatusPill><div className="profile-progress"><div><span>Menuju Trusted Donor</span><strong>68%</strong></div><span><i /></span></div><div className="rating-row"><Star size={17} fill="currentColor" /> {profile?.rating_average || '4.8'} <span>rating komunitas</span></div><Link className="text-link" to="/profil">Lihat profil kontribusi <ArrowRight size={15} /></Link></aside>

        <div className="dashboard-main">
          <section><div className="section-heading compact"><div><span className="eyebrow">Barangmu</span><h2>Sedang kamu bagikan</h2></div><Link className="text-link" to="/barang">Lihat publik</Link></div><div className="mini-card-grid">{fallbackItems.slice(0, 2).map((item) => <ItemCard key={item.id} item={item} />)}</div></section>
          <section><div className="section-heading compact"><div><span className="eyebrow">Perlu perhatian</span><h2>Pengajuan terbaru</h2></div><Link className="text-link" to="/pengajuan">Kelola semua</Link></div>{fallbackRequests.length ? <div className="request-list">{fallbackRequests.map((request) => <article className="request-row" key={request.id}><span className="request-avatar">{request.requester_name?.[0] || 'P'}</span><div><small>{request.requester_name}</small><strong>{request.item_title}</strong><p>{request.reason}</p></div><StatusPill status={request.status}>{getRequestStatusLabel(request.status)}</StatusPill><Link to="/pengajuan" aria-label="Buka pengajuan"><ArrowRight size={18} /></Link></article>)}</div> : <EmptyState title="Belum ada pengajuan" description="Pengajuan akan tampil di sini setelah ada pengguna yang membutuhkan barangmu." />}</section>
          <section className="message-preview"><MessageCircle size={21} /><div><strong>Chat akan terbuka setelah pengajuan disetujui</strong><span>Jaga percakapan dan kesepakatan pengambilan tetap aman.</span></div></section>
        </div>
      </section>
    </main>
  );
}
