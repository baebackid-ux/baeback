import { Flag, Gift, Heart, MapPin, ShieldCheck, Star } from 'lucide-react';
import AccountNav from '../components/AccountNav';
import SEO from '../components/SEO';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { badgeLabels } from '../lib/constants';

export default function ProfilePage() {
  const { profile } = useAuth();
  return (
    <main className="account-page profile-page"><SEO title="Profil" noindex /><div className="container"><AccountNav /></div><div className="container profile-layout"><aside className="profile-card"><div className="avatar large">{profile?.full_name?.[0] || 'B'}</div><span className="profile-verified"><ShieldCheck size={14} /> Terverifikasi</span><h1>{profile?.full_name || 'Pengguna BaeBack'}</h1><p className="profile-location"><MapPin size={16} /> {profile?.location || 'Indonesia'}</p><p>{profile?.bio || 'Anggota komunitas yang percaya bahwa barang baik layak mendapat cerita kedua.'}</p><div className="profile-badges"><StatusPill status="available">{badgeLabels[profile?.badge] || 'New Donor'}</StatusPill></div><div className="rating-row"><Star size={17} fill="currentColor" /> {profile?.rating_average || 4.8} <span>dari komunitas</span></div></aside><div className="profile-content"><span className="eyebrow">Profil kontribusi</span><h2>Dampak yang tumbuh<br /><em>bersama komunitas.</em></h2><section className="dashboard-stats"><div className="stat-card"><Heart size={21} /><strong>{profile?.kindness_points || 120}</strong><span>Kindness points</span></div><div className="stat-card"><Gift size={21} /><strong>8</strong><span>Barang dibagikan</span></div><div className="stat-card"><Star size={21} /><strong>{profile?.rating_average || 4.8}</strong><span>Rating</span></div><div className="stat-card"><Flag size={21} /><strong>0</strong><span>Laporan aktif</span></div></section><section className="contribution-story"><div><span>JUN 2026</span><i /></div><article><small>Kontribusi terbaru</small><h3>Membagikan Paket Buku Pelajaran SMA</h3><p>Barang sedang menunggu pengajuan dari penerima yang sesuai.</p></article></section></div></div></main>
  );
}
