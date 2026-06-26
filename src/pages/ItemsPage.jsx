import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    async function loadItems() {
      const { data } = await supabase.from('items').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
    }

    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const query = filters.query.toLowerCase();
    return items.filter((item) => {
      const matchQuery = !query || [item.title, item.description, item.location].join(' ').toLowerCase().includes(query);
      const matchCategory = !filters.category || item.category === filters.category;
      const matchCondition = !filters.condition || item.condition === filters.condition;
      const matchPickup = !filters.pickup || item.pickup_method === filters.pickup;
      return matchQuery && matchCategory && matchCondition && matchPickup;
    });
  }, [filters, items]);

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
        <div className="card-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
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
