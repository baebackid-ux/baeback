import { useEffect, useState } from 'react';
import { HeartHandshake } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import EmptyState from '../components/EmptyState';
import { CardGridSkeleton } from '../components/Skeleton';
import { fallbackCampaigns } from '../data/mockData';
import { fetchCampaigns, checkApiHealth } from '../lib/api';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(fallbackCampaigns);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const apiReady = await checkApiHealth();
      if (!apiReady) {
        setCampaigns(fallbackCampaigns.filter((c) => c.status === 'active'));
        setLoading(false);
        return;
      }

      try {
        const result = await fetchCampaigns(1, 12);
        if (result.data?.length) setCampaigns(result.data);
        setPagination(result.pagination || { page: 1, totalPages: 1 });
      } catch {
        setCampaigns(fallbackCampaigns.filter((c) => c.status === 'active'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="page-shell">
      <section className="page-header">
        <div className="container">
          <span className="eyebrow"><HeartHandshake size={14} /> Campaign Donasi</span>
          <h1>Dukung campaign kebaikan</h1>
          <p>Semua donasi diproses melalui backend aman. Tidak ada akses database langsung dari browser.</p>
        </div>
      </section>

      <section className="container section-block">
        {loading ? (
          <CardGridSkeleton count={4} variant="campaign" />
        ) : campaigns.length === 0 ? (
          <EmptyState title="Belum ada campaign aktif" description="Campaign baru akan muncul di sini." />
        ) : (
          <div className="card-grid content-reveal">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
        {pagination.totalPages > 1 && (
          <p className="pagination-note">Halaman {pagination.page} dari {pagination.totalPages}</p>
        )}
      </section>
    </main>
  );
}
