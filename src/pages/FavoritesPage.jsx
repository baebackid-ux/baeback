import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import AccountNav from '../components/AccountNav';
import ItemCard from '../components/ItemCard';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { fallbackItems } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function FavoritesPage() {
  const [savedItems, setSavedItems] = useState(fallbackItems.slice(0, 2));
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    async function loadFavorites() {
      const { data } = await supabase.from('favorites').select('item:items(*)').eq('user_id', user.id);
      if (data) setSavedItems(data.map((entry) => entry.item).filter(Boolean));
    }

    loadFavorites();
  }, [user]);

  async function removeFavorite(itemId) {
    if (isSupabaseConfigured && user) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('item_id', itemId);
    }
    setSavedItems((current) => current.filter((item) => item.id !== itemId));
  }

  return (
    <main className="account-page favorites-page">
      <SEO title="Daftar Minat" noindex />
      <div className="container"><AccountNav /></div>
      <div className="container page-heading">
        <span className="eyebrow">Daftar Minat</span>
        <h1>Simpan dulu.<br /><em>Putuskan dengan tenang.</em></h1>
        <p>Kumpulan barang yang menarik perhatianmu sebelum kamu benar-benar mengajukan.</p>
      </div>
      <div className="container">
      {savedItems.length ? (
        <div className="card-grid">
          {savedItems.map((item) => (
            <div className="favorite-wrap" key={item.id}>
              <ItemCard item={item} />
              <button className="btn btn-light full-width" onClick={() => removeFavorite(item.id)}>
                <Trash2 size={17} />
                Hapus dari Daftar Minat
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Daftar Minat masih kosong"
          description="Temukan barang gratis yang kamu butuhkan dan simpan di sini."
          action={<Link className="btn btn-primary" to="/barang">Cari Barang Gratis</Link>}
        />
      )}
      </div>
    </main>
  );
}
