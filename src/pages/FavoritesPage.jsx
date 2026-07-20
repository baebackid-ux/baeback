import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import AccountNav from '../components/AccountNav';
import ItemCard from '../components/ItemCard';
import SEO from '../components/SEO';
import { CardGridSkeleton } from '../components/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { useDelayedLoading } from '../lib/useDelayedLoading';
import { fallbackItems } from '../data/mockData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function FavoritesPage() {
  const [savedItems, setSavedItems] = useState(isSupabaseConfigured ? [] : fallbackItems.slice(0, 2));
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const showSkeleton = useDelayedLoading(loading, 200);
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setLoading(false);
      return;
    }

    async function loadFavorites() {
      setLoading(true);
      try {
        const { data } = await supabase.from('favorites').select('item:items(*)').eq('user_id', user.id);
        if (data) setSavedItems(data.map((entry) => entry.item).filter(Boolean));
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
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
      {showSkeleton ? (
        <CardGridSkeleton count={4} />
      ) : loading ? (
        null
      ) : savedItems.length ? (
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
