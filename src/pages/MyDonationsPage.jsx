import { HeartHandshake } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import { DonationListSkeleton } from '../components/Skeleton';
import { fallbackDonations } from '../data/mockData';
import { checkApiHealth, fetchMyDonations } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/formatters';

export default function MyDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const apiReady = await checkApiHealth();
      if (!apiReady) {
        setDonations(fallbackDonations);
        setLoading(false);
        return;
      }

      try {
        const result = await fetchMyDonations();
        setDonations(result.data ?? []);
      } catch {
        setDonations([]);
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
          <span className="eyebrow"><HeartHandshake size={14} /> Riwayat Donasi</span>
          <h1>Donasi saya</h1>
          <p>Hanya donasi yang Anda catat sendiri yang ditampilkan di sini.</p>
        </div>
      </section>

      <section className="container section-block">
        {loading ? (
          <DonationListSkeleton count={4} />
        ) : donations.length === 0 ? (
          <EmptyState
            title="Belum ada donasi"
            description="Dukung campaign kebaikan dan riwayat donasi akan muncul di sini."
            action={<Link className="btn btn-primary" to="/campaign">Lihat campaign</Link>}
          />
        ) : (
          <div className="donation-list content-reveal">
            {donations.map((donation) => (
              <article key={donation.id} className="donation-item">
                <div>
                  <h3>
                    {donation.campaign?.slug ? (
                      <Link to={`/campaign/${donation.campaign.slug}`}>{donation.campaign.title}</Link>
                    ) : (
                      donation.campaign?.title || 'Campaign'
                    )}
                  </h3>
                  <p>{formatDate(donation.created_at)}</p>
                  {donation.message && <p className="donation-message">{donation.message}</p>}
                </div>
                <strong>{formatCurrency(donation.amount)}</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
