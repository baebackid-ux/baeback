import { ArrowLeft, Calendar, Clock, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blog-posts';
import { getOptimizedImageUrl, formatDate } from '../lib/formatters';
import { SITE_URL } from '../lib/seo';

export default function BlogPostPage() {
  const { slug } = useParams();

  // Handle both dynamic hydration data or direct memory data
  const post = typeof window === 'undefined'
    ? globalThis.__INITIAL_DATA__?.blogPost || blogPosts.find((p) => p.slug === slug)
    : window.__INITIAL_DATA__?.blogPost || blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <main className="page-shell">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h2>Artikel tidak ditemukan</h2>
          <p>Mungkin artikel telah dihapus atau tautan salah.</p>
          <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
            Kembali ke blog
          </Link>
        </div>
      </main>
    );
  }

  const blogPostJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.summary,
    'image': post.image,
    'datePublished': post.date,
    'author': {
      '@type': 'Organization',
      'name': 'BaeBack',
      'url': SITE_URL
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `${SITE_URL}/blog/${post.slug}`;
  const shareText = `Yuk baca artikel menarik di BaeBack: *${post.title}*. Selengkapnya di: ${shareUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <main className="page-shell">
      <SEO
        title={post.title}
        description={post.summary}
        path={`/blog/${post.slug}`}
        image={post.image}
        jsonLd={blogPostJsonLd}
      />

      <div className="container" style={{ maxWidth: '800px', margin: '20px auto 0 auto' }}>
        <Link to="/blog" className="text-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-primary, #0f766e)' }}>
          <ArrowLeft size={16} /> Kembali ke blog
        </Link>
      </div>

      <article className="container" style={{ maxWidth: '800px', margin: '30px auto 80px auto', padding: '0 16px' }}>
        <header style={{ marginBottom: '24px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '16px',
              backgroundColor: 'rgba(15, 118, 110, 0.1)',
              color: 'var(--color-primary, #0f766e)',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '12px'
            }}
          >
            {post.category}
          </span>
          <h1 style={{ fontSize: '2.2rem', lineHeight: '1.25', margin: '0 0 16px 0', color: 'var(--text-main, #111)' }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#666', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              {formatDate(post.date)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} />
              {post.readTime}
            </span>
          </div>
        </header>

        {post.image && (
          <div style={{ marginBottom: '32px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <img
              src={getOptimizedImageUrl(post.image, 800)}
              alt={`Artikel Donasi BaeBack: ${post.title}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              decoding="async"
            />
          </div>
        )}

        <div
          className="blog-content"
          style={{
            fontSize: '1.05rem',
            lineHeight: '1.75',
            color: 'var(--text-main, #333)',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>Bagikan artikel ini:</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#25D366',
              borderColor: '#25D366',
              borderRadius: '24px',
              padding: '8px 20px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            <MessageCircle size={18} /> Bagikan ke WhatsApp
          </a>
        </div>
      </article>
    </main>
  );
}
