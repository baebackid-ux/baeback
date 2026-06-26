import { CheckCircle2, HeartHandshake, ShieldCheck, Sparkles, Users } from 'lucide-react';

const iconMap = {
  official: ShieldCheck,
  community: Users,
  urgent: Sparkles,
  verified: CheckCircle2,
  default: HeartHandshake,
};

export default function Badge({ children, tone = 'default', icon = 'default' }) {
  const Icon = iconMap[icon] || iconMap.default;
  return (
    <span className={`badge badge-${tone}`}>
      <Icon size={14} aria-hidden="true" />
      {children}
    </span>
  );
}
