import { ArrowUpRight, HeartHandshake, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency, getCampaignProgress, getOptimizedImageUrl, summarizeText } from '../lib/formatters';
import Badge from './Badge';
import StatusPill from './StatusPill';

export default function CampaignCard({ campaign }) {
  const progress = getCampaignProgress(campaign.collected_amount, campaign.target_amount);
  const isCompleted = campaign.status === 'completed';

  return (
    <article className="item-card campaign-card">
      <Link to={`/campaign/${campaign.slug}`} className="item-image-wrap">
        {campaign.image_url ? (
          <img src={getOptimizedImageUrl(campaign.image_url, 400)} alt={campaign.title} className="item-image" loading="lazy" decoding="async" />
        ) : (
          <div className="image-placeholder">
            <HeartHandshake size={34} />
          </div>
        )}
        <span className="free-label">{formatCurrency(campaign.collected_amount)} terkumpul</span>
      </Link>
      <div className="item-card-body">
        <div className="card-badges">
          <Badge tone="teal" icon="official">{campaign.category || 'Campaign'}</Badge>
          <StatusPill status={isCompleted ? 'received' : 'available'}>
            {isCompleted ? 'Tercapai' : 'Aktif'}
          </StatusPill>
        </div>
        <h3>{campaign.title}</h3>
        <p>{summarizeText(campaign.description, 82)}</p>
        <div className="campaign-progress">
          <div className="campaign-progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="campaign-progress-meta">
            <span><Target size={14} /> {progress}%</span>
            <span>Target {formatCurrency(campaign.target_amount)}</span>
          </div>
        </div>
        <Link to={`/campaign/${campaign.slug}`} className="card-link" aria-label={`Lihat ${campaign.title}`}>
          Lihat campaign <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
