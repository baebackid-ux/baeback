import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import ItemCard from '../components/ItemCard';
import SearchFilters from '../components/SearchFilters';
import { fallbackItems } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function ItemsPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState(fallbackItems);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    condition: '',
    pickup: '',
  });

  const [page, setPage] = useState(0);
  const itemsPerPage = 12;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // fetch a page of items from Supabase with simple server-side filters
  async function fetchPage(p) {
    if (!isSupabaseConfigured) return;
    setLoading(true);
    const start = p * itemsPerPage;
    const end = start + itemsPerPage - 1;

    let queryBuilder = supabase.from('items').select('*').order('created_at', { ascending: false }).range(start, end);

    // apply simple equality filters
    if (filters.category) queryBuilder = queryBuilder.eq('category', filters.category);
    if (filters.condition) queryBuilder = queryBuilder.eq('condition', filters.condition);
    if (filters.pickup) queryBuilder = queryBuilder.eq('pickup_method', filters.pickup);

    // simple text search using ilike on a few fields
    const q = filters.query?.trim();
    if (q) {
      const like = `%${q}%`;
      // supabase doesn't support chaining multiple ilike easily, use or
      queryBuilder = queryBuilder.or(`title.ilike.${like},description.ilike.${like},location.ilike.${like}`);
    }

    const { data, error } = await queryBuilder;
    setLoading(false);
    if (error) {
      console.error('Failed to load items', error.message || error);
      return;
    }

    if (p === 0) {
      setItems(data || []);
    } else {
      setItems((prev) => [...prev, ...(data || [])]);
    }

    if (!data || data.length < itemsPerPage) setHasMore(false);
    else setHasMore(true);
  }

  // initial load and when filters change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    if (!isSupabaseConfigured) {
      // demo mode: client-side pagination of fallbackItems
      const start = 0;
      const end = itemsPerPage;
      const slice = fallbackItems.slice(start, end);
      setItems(slice);
      if (fallbackItems.length <= itemsPerPage) setHasMore(false);
      return;
    }
    fetchPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.category, filters.condition, filters.pickup]);

  // load more when page increments
  useEffect(() => {
    if (page === 0) return;
    if (!isSupabaseConfigured) {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const slice = fallbackItems.slice(start, end);
      setItems((prev) => [...prev, ...slice]);
      if (end >= fallbackItems.length) setHasMore(false);
      return;
    }
    fetchPage(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // intersection observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !isSupabaseConfigured) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      });
    }, { rootMargin: '200px' });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef.current, hasMore, loading]);

  const filteredItems = items;

  return (
    <main className="page-shell catalog-page">
      <header className="container page-heading catalog-heading">
        <span className="eyebrow">Katalog komunitas</span>
        <h1>Barang baik, siap<br /><em>dipakai kembali.</em></h1>
        <p>Temukan barang berdasarkan kebutuhan, bukan harga. Semuanya dibagikan tanpa biaya.</p>
      </header>
      <div className="container">
      <SearchFilters filters={filters} onChange={setFilters} />
      <div className="catalog-toolbar"><p><strong>{filteredItems.length}</strong> barang ditemukan</p><span><SlidersHorizontal size={15} /> Terbaru lebih dulu</span></div>
      {filteredItems.length ? (
        <>
        <div className="card-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        <div ref={loaderRef} style={{ height: 1 }} />
        <div className="catalog-footer">
          {loading && <p>Memuat lebih banyak barang…</p>}
          {!hasMore && !loading && <p>Tidak ada barang lebih banyak.</p>}
          {!isSupabaseConfigured && hasMore && (
            <button
              className="btn"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading}
            >
              Muat lebih
            </button>
          )}
        </div>
        </>
      ) : (
        <EmptyState
          title="Belum ada barang di pilihan ini"
          description="Coba ubah filter atau jadilah yang pertama membagikan barang baik."
          action={
            <Link className="btn btn-primary" to="/donasikan">
              Donasikan Barang
            </Link>
          }
        />
      )}
      </div>
    </main>
  );
}
