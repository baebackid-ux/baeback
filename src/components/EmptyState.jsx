import { Box, HeartHandshake } from 'lucide-react';

export default function EmptyState({ title, description, action, icon }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <Box size={28} aria-hidden="true" />}
        <HeartHandshake size={18} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
