import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getOptimizedImageUrl, formatDate } from '../lib/formatters';

export default function BlogCard({ post }) {
  return (
    <article className="item-card blog-card">
      <Link to={`/blog/${post.slug}`} className="item-image-wrap">
        {post.image ? (
          <img
            src={getOptimizedImageUrl(post.image, 400)}
            alt={post.title}
            className="item-image"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="image-placeholder">Blog</div>
        )}
        <span className="free-label blog-category-badge">{post.category}</span>
      </Link>
      <div className="item-card-body">
        <div className="blog-meta-row" style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted, #666)', marginBottom: '8px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} />
            {formatDate(post.date)}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            {post.readTime}
          </span>
        </div>
        <h3 style={{ fontSize: '1.15rem', lineHeight: '1.4', margin: '0 0 8px 0', color: 'var(--text-main, #111)' }}>
          {post.title}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #555)', margin: '0 0 16px 0', lineHeight: '1.5' }}>
          {post.summary}
        </p>
        <Link to={`/blog/${post.slug}`} className="card-link" aria-label={`Baca ${post.title}`}>
          Baca selengkapnya <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
