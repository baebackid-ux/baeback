import { ArrowRight, HandHeart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getNeedStatusLabel, summarizeText } from '../lib/formatters';
import Badge from './Badge';
import StatusPill from './StatusPill';

export default function NeedCard({ need }) {
  return (
    <article className="need-card">
      <div className="need-icon">
        <HandHeart size={24} />
      </div>
      <div className="need-card-top"><Badge tone="yellow" icon="urgent">{need.urgency || 'Need Board'}</Badge><span>{need.category}</span></div>
      <h3>{need.title}</h3>
      <p>{summarizeText(need.description, 110)}</p>
      <div className="meta-row">
        <MapPin size={16} />
        {need.location}
      </div>
      <div className="card-footer-row">
        <StatusPill status={need.status}>{getNeedStatusLabel(need.status)}</StatusPill>
        <Link to={`/need-board/${need.id}`} className="text-link">
          Tawarkan Barang <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
