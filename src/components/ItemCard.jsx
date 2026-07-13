import { ArrowUpRight, Gift, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getItemStatusLabel, getPostTypeLabel, getOptimizedImageUrl, summarizeText } from '../lib/formatters';
import Badge from './Badge';
import StatusPill from './StatusPill';

export default function ItemCard({ item }) {
  const isOfficial = item.post_type === 'official';

  return (
    <article className="item-card">
      <Link to={`/barang/${item.id}`} className="item-image-wrap">
        {item.image_url ? (
          <img src={getOptimizedImageUrl(item.image_url, 400)} alt={item.title} className="item-image" loading="lazy" decoding="async" />
        ) : (
          <div className="image-placeholder">
            <Gift size={34} />
          </div>
        )}
        <span className="free-label">Rp 0 · untuk dibagikan</span>
      </Link>
      <div className="item-card-body">
        <div className="card-badges">
          <Badge tone={isOfficial ? 'teal' : 'green'} icon={isOfficial ? 'official' : 'community'}>
            {getPostTypeLabel(item.post_type)}
          </Badge>
          <StatusPill status={item.status}>{getItemStatusLabel(item.status)}</StatusPill>
        </div>
        <h3>{item.title}</h3>
        <p>{summarizeText(item.description, 82)}</p>
        <div className="meta-row">
          <MapPin size={16} />
          {item.location}
        </div>
        <div className="item-meta-grid">
          <span>Kondisi · {item.condition}</span>
          <span>{item.pickup_method}</span>
        </div>
        <Link to={`/barang/${item.id}`} className="card-link" aria-label={`Lihat ${item.title}`}>
          Lihat detail <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
