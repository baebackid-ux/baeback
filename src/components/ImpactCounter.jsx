import { Heart, Leaf, Map, Users } from 'lucide-react';

const icons = [Heart, Users, Leaf, Map];

export default function ImpactCounter({ stats }) {
  return (
    <section className="impact-grid">
      {stats.map((stat, index) => {
        const Icon = icons[index % icons.length];
        return (
          <div className="impact-card" key={stat.label}>
            <Icon size={22} />
            <strong>{stat.value}<sup>+</sup></strong>
            <span>{stat.label}</span>
          </div>
        );
      })}
    </section>
  );
}
