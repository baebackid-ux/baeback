import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import SEO from '../components/SEO';
import { blogPosts } from '../data/blog-posts';
import { SITE_URL } from '../lib/seo';

const blogCategories = ['Semua', 'Tentang Kami', 'Panduan', 'Edukasi'];

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredPosts = selectedCategory === 'Semua'
    ? blogPosts
    : blogPosts.filter((post) => post.category === selectedCategory);

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Blog & Inspirasi Kebaikan — BaeBack',
    'description': 'Temukan artikel, cerita, dan panduan lengkap seputar berbagi kebaikan bersama BaeBack.',
    'url': `${SITE_URL}/blog`
  };

  return (
    <main className="page-shell">
      <SEO
        title="Blog & Inspirasi Kebaikan"
        description="Temukan artikel, cerita, dan panduan lengkap seputar berbagi kebaikan bersama BaeBack."
        path="/blog"
        jsonLd={collectionJsonLd}
      />
      <section className="page-header">
        <div className="container">
          <span className="eyebrow"><BookOpen size={14} /> Inspirasi BaeBack</span>
          <h1>Blog & Artikel Kebaikan</h1>
          <p>Temukan artikel, cerita inspiratif, dan panduan lengkap seputar berbagi barang layak pakai bersama BaeBack.</p>
        </div>
      </section>

      <section className="container section-block">
        <div className="filter-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
          {blogCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: '24px',
                padding: '6px 18px',
                fontSize: '0.85rem',
                backgroundColor: selectedCategory === category ? 'var(--color-primary, #0f766e)' : 'transparent',
                color: selectedCategory === category ? '#fff' : 'var(--text-main, #333)',
                borderColor: selectedCategory === category ? 'var(--color-primary, #0f766e)' : 'var(--border-color, #ddd)'
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p>Belum ada artikel dalam kategori ini.</p>
          </div>
        ) : (
          <div className="card-grid content-reveal">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
