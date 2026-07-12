import { ArrowLeft, Check, HeartHandshake, ShieldCheck, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import SEO from '../components/SEO';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { fallbackCampaigns } from '../data/mockData';
import { checkApiHealth, fetchCampaign, submitDonation } from '../lib/api';
import { formatCurrency, formatDate, getCampaignProgress, summarizeText } from '../lib/formatters';
import { buildCampaignJsonLd } from '../lib/seo';
import { isSupabaseConfigured } from '../lib/supabase';

export default function CampaignDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(() => {
    const initial = typeof window === 'undefined' ? globalThis.__INITIAL_DATA__?.campaign : window.__INITIAL_DATA__?.campaign;
    if (initial && String(initial.slug) === String(slug)) return initial;
    return fallbackCampaigns.find((c) => c.slug === slug) || fallbackCampaigns[0];
  });
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const idempotencyKeyRef = useRef(null);

  useEffect(() => {
    async function load() {
      const ready = await checkApiHealth();
      setApiReady(ready);
      if (!ready) return;

      try {
        const result = await fetchCampaign(slug);
        if (result.data) setCampaign(result.data);
      } catch {
        const fallback = fallbackCampaigns.find((c) => c.slug === slug);
        if (fallback) setCampaign(fallback);
      }
    }
    load();
  }, [slug]);

  const progress = getCampaignProgress(campaign.collected_amount, campaign.target_amount);
  const isActive = campaign.status === 'active';
  const needsLogin = !user;

  function requireLogin() {
    if (user) return true;
    navigate('/login', { replace: true, state: { from: { pathname: `/campaign/${slug}` } } });
    return false;
  }

  async function handleDonate(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!requireLogin()) return;

    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount < 1000) {
      setError('Nominal minimal Rp 1.000.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Donasi memerlukan konfigurasi Supabase yang aktif.');
      return;
    }

    setSubmitting(true);
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = crypto.randomUUID();
    }

    try {
      const result = await submitDonation({
        campaign_id: campaign.id,
        amount: parsedAmount,
        message: message.trim() || null,
        idempotencyKey: idempotencyKeyRef.current,
      });
      setNotice(
        result.requestId
          ? `Donasi berhasil dicatat. ID permintaan: ${result.requestId}`
          : 'Donasi berhasil dicatat. Terima kasih!',
      );
      setAmount('');
      setMessage('');
      idempotencyKeyRef.current = null;

      const refreshed = await fetchCampaign(slug);
      if (refreshed.data) setCampaign(refreshed.data);
    } catch (err) {
      const detail = err.requestId ? `${err.message} (Ref: ${err.requestId})` : err.message;
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="detail-page">
      <SEO
        title={campaign.title}
        description={summarizeText(campaign.description, 155) || `Dukung campaign ${campaign.title} di BaeBack.`}
        path={`/campaign/${campaign.slug}`}
        image={campaign.image_url}
        jsonLd={buildCampaignJsonLd(campaign)}
      />
      <div className="container detail-breadcrumb">
        <Link to="/campaign"><ArrowLeft size={16} /> Kembali ke Campaign</Link>
      </div>
      <div className="container need-detail-grid">
        <article className="need-detail-story">
          {campaign.image_url && (
            <img src={campaign.image_url} alt={campaign.title} className="campaign-detail-image" />
          )}
          <div className="card-badges">
            <Badge tone="teal" icon="official">{campaign.category || 'Campaign'}</Badge>
            <StatusPill status={isActive ? 'available' : 'received'}>
              {isActive ? 'Aktif' : 'Tercapai'}
            </StatusPill>
          </div>
          <h1>{campaign.title}</h1>
          <div className="campaign-progress campaign-progress--large">
            <div className="campaign-progress-bar">
              <span style={{ width: `${progress}%` }} />
            </div>
            <div className="campaign-progress-meta">
              <span><Target size={16} /> {progress}% tercapai</span>
              <span>{formatCurrency(campaign.collected_amount)} / {formatCurrency(campaign.target_amount)}</span>
            </div>
          </div>
          <div className="need-story-copy">
            <span className="eyebrow">Tentang campaign</span>
            <p>{campaign.description}</p>
          </div>
          {campaign.end_date && (
            <p className="meta-row">Berakhir: {formatDate(campaign.end_date)}</p>
          )}
          <div className="need-safety-note">
            <ShieldCheck size={19} />
            <p>Donasi dicatat langsung secara aman ke database melalui Supabase Client dengan kebijakan keamanan RLS.</p>
          </div>
        </article>

        <aside className="offer-panel">
          <span className="offer-icon"><HeartHandshake size={24} /></span>
          <span className="eyebrow">Dukung campaign ini</span>
          <h2>Catat donasi</h2>
          <p>Masukkan nominal donasi. Sistem hanya mencatat, tanpa payment gateway.</p>
          {needsLogin && <p className="detail-reassurance">Masuk dulu untuk mencatat donasi.</p>}
          {notice && <p className="success-note"><Check size={17} /> {notice}</p>}
          {error && <p className="error-note">{error}</p>}
          <form className="form-stack" onSubmit={handleDonate}>
            <label>
              <span>Nominal (Rp)</span>
              <input
                type="number"
                min={1000}
                step={1000}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="50000"
                disabled={!isActive || submitting}
              />
            </label>
            <label>
              <span>Pesan (opsional)</span>
              <textarea
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Semoga bermanfaat..."
                disabled={!isActive || submitting}
              />
            </label>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!isActive || submitting}
            >
              {needsLogin ? 'Masuk untuk donasi' : submitting ? 'Memproses...' : 'Catat donasi'}
            </button>
          </form>
          {!isActive && <small>Campaign ini sudah tidak menerima donasi.</small>}
        </aside>
      </div>
    </main>
  );
}
