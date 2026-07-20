import { useEffect, useState } from 'react';
import { Flag, Gift, Heart, MapPin, ShieldCheck, Star } from 'lucide-react';
import AccountNav from '../components/AccountNav';
import SEO from '../components/SEO';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { badgeLabels } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { SkeletonBlock } from '../components/Skeleton';
import { useDelayedLoading } from '../lib/useDelayedLoading';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    itemsCount: 0,
    latestItem: null,
    loading: true,
  });
  const showSkeleton = useDelayedLoading(stats.loading, 200);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    async function fetchProfileStats() {
      try {
        const { count, error: countError } = await supabase
          .from('items')
          .select('*', { count: 'exact', head: true })
          .eq('donor_id', user.id);
        if (countError) throw countError;

        const { data: latestItems, error: latestError } = await supabase
          .from('items')
          .select('title, status, created_at')
          .eq('donor_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
        if (latestError) throw latestError;

        if (!mounted) return;
        setStats({
          itemsCount: count || 0,
          latestItem: latestItems?.[0] || null,
          loading: false,
        });
      } catch (err) {
        console.error('Error fetching profile stats:', err);
        if (mounted) {
          setStats((curr) => ({ ...curr, loading: false }));
        }
      }
    }

    fetchProfileStats();
    return () => {
      mounted = false;
    };
  }, [user]);

  const formattedDate = stats.latestItem
    ? new Date(stats.latestItem.created_at)
        .toLocaleDateString('id-ID', {
          month: 'short',
          year: 'numeric',
        })
        .toUpperCase()
    : '';

  return (
    <main className="account-page profile-page">
      <SEO title="Profil" noindex />
      <div className="container">
        <AccountNav />
      </div>
      <div className="container profile-layout">
        <aside className="profile-card">
          <div className="avatar large">{profile?.full_name?.[0] || 'B'}</div>
          <span className="profile-verified">
            <ShieldCheck size={14} /> Terverifikasi
          </span>
          <h1>{profile?.full_name || 'Pengguna BaeBack'}</h1>
          <p className="profile-location">
            <MapPin size={16} /> {profile?.location || 'Indonesia'}
          </p>
          <p>
            {profile?.bio || 'Anggota komunitas yang percaya bahwa barang baik layak mendapat cerita kedua.'}
          </p>
          <div className="profile-badges">
            <StatusPill status="available">
              {badgeLabels[profile?.badge] || 'New Donor'}
            </StatusPill>
          </div>
          <div className="rating-row">
            <Star size={17} fill="currentColor" /> {profile?.rating_average ?? 0} <span>dari komunitas</span>
          </div>
        </aside>

        <div className="profile-content">
          <span className="eyebrow">Profil kontribusi</span>
          <h2>
            Dampak yang tumbuh
            <br />
            <em>bersama komunitas.</em>
          </h2>
          <section className="dashboard-stats">
            <div className="stat-card">
              <Heart size={21} />
              <strong>{profile?.kindness_points ?? 0}</strong>
              <span>Kindness points</span>
            </div>
            <div className="stat-card">
              <Gift size={21} />
              <strong>{showSkeleton ? <SkeletonBlock style={{ width: '28px', height: '24px', display: 'inline-block', borderRadius: '4px' }} /> : stats.loading ? '...' : stats.itemsCount}</strong>
              <span>Barang dibagikan</span>
            </div>
            <div className="stat-card">
              <Star size={21} />
              <strong>{profile?.rating_average ?? 0}</strong>
              <span>Rating</span>
            </div>
            <div className="stat-card">
              <Flag size={21} />
              <strong>0</strong>
              <span>Laporan aktif</span>
            </div>
          </section>

          {showSkeleton ? (
            <section className="contribution-story">
              <div>
                <SkeletonBlock style={{ width: '64px', height: '14px', borderRadius: '4px' }} />
                <i />
              </div>
              <article>
                <SkeletonBlock style={{ width: '110px', height: '12px', marginBottom: '8px', borderRadius: '4px' }} />
                <SkeletonBlock style={{ width: '70%', height: '24px', marginBottom: '12px', borderRadius: '6px' }} />
                <SkeletonBlock style={{ width: '100%', height: '14px', marginBottom: '6px', borderRadius: '4px' }} />
                <SkeletonBlock style={{ width: '85%', height: '14px', borderRadius: '4px' }} />
              </article>
            </section>
          ) : stats.loading ? (
            null
          ) : stats.latestItem ? (
            <section className="contribution-story">
              <div>
                <span>{formattedDate}</span>
                <i />
              </div>
              <article>
                <small>Kontribusi terbaru</small>
                <h3>Membagikan {stats.latestItem.title}</h3>
                <p>
                  {stats.latestItem.status === 'available'
                    ? 'Barang sedang menunggu pengajuan dari penerima yang sesuai.'
                    : stats.latestItem.status === 'reserved'
                    ? 'Barang telah dipesan dan sedang dalam proses penjemputan.'
                    : stats.latestItem.status === 'received'
                    ? 'Barang telah sukses dibagikan dan diterima.'
                    : 'Status barang: ' + stats.latestItem.status}
                </p>
              </article>
            </section>
          ) : (
            <section className="contribution-story" style={{ gridTemplateColumns: '1fr' }}>
              <article>
                <small>Kontribusi terbaru</small>
                <h3>Belum ada barang yang dibagikan</h3>
                <p>Mulailah berbagi barang layak pakai untuk membantu sesama dan mengumpulkan Kindness Points.</p>
              </article>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
