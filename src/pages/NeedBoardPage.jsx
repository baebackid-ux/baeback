import { ArrowRight, HandHeart, Plus, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import NeedCard from '../components/NeedCard';
import { useAuth } from '../contexts/AuthContext';
import { fallbackNeeds } from '../data/mockData';
import { socialCategories } from '../lib/constants';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function NeedBoardPage() {
  const [needs, setNeeds] = useState(fallbackNeeds);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ title: '', category: socialCategories[0], location: '', urgency: 'Masih Dibutuhkan', description: '' });
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadNeeds() {
      const { data } = await supabase.from('need_posts').select('*').order('created_at', { ascending: false });
      if (data) setNeeds(data);
    }
    loadNeeds();
  }, []);

  const filteredNeeds = useMemo(() => {
    const normalized = query.toLowerCase();
    return needs.filter((need) => (!normalized || [need.title, need.description, need.location].join(' ').toLowerCase().includes(normalized)) && (!category || need.category === category));
  }, [needs, query, category]);

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { ...form, requester_id: user?.id, status: 'open' };
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('need_posts').insert(payload).select('*').single();
      if (data) setNeeds((current) => [data, ...current]);
    } else setNeeds((current) => [{ ...payload, id: crypto.randomUUID() }, ...current]);
    setFormOpen(false);
    setForm({ title: '', category: socialCategories[0], location: '', urgency: 'Masih Dibutuhkan', description: '' });
  }

  return (
    <main className="need-board-page">
      <header className="need-board-hero">
        <div className="container need-board-hero-grid">
          <div><span className="eyebrow">Ruang kebutuhan komunitas</span><h1>Mungkin sederhana bagimu.<br /><em>Bisa berarti besar bagi mereka.</em></h1><p>Temukan kebutuhan nyata di sekitar kita, lalu tawarkan barang yang bisa kembali bermanfaat.</p></div>
          <div className="need-board-manifest"><HandHeart size={28} /><strong>Berbagi dengan martabat.</strong><p>Setiap kebutuhan ditampilkan dengan bahasa yang setara, jelas, dan tanpa eksploitasi cerita pribadi.</p></div>
        </div>
      </header>

      <div className="container need-board-controls">
        <div className="need-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari kebutuhan atau lokasi..." /></div>
        <button className="btn btn-primary" onClick={() => setFormOpen(true)}><Plus size={18} /> Tulis kebutuhan</button>
      </div>

      <section className="container need-board-layout">
        <aside className="need-categories"><span>Filter berdasarkan</span><button className={!category ? 'active' : ''} onClick={() => setCategory('')}>Semua kebutuhan <small>{needs.length}</small></button>{socialCategories.map((entry) => <button className={category === entry ? 'active' : ''} key={entry} onClick={() => setCategory(entry)}>{entry}<ArrowRight size={14} /></button>)}</aside>
        <div className="need-results"><div className="results-heading"><div><span className="eyebrow">Permintaan terbuka</span><h2>{category || 'Semua kebutuhan'}</h2></div><p>{filteredNeeds.length} kebutuhan ditemukan</p></div>{filteredNeeds.length ? <div className="need-card-grid">{filteredNeeds.map((need) => <NeedCard key={need.id} need={need} />)}</div> : <EmptyState title="Belum ada kebutuhan di pilihan ini" description="Coba kategori lain atau tulis kebutuhan baru dengan informasi yang jelas." />}</div>
      </section>

      {formOpen && <div className="modal-backdrop" role="presentation"><div className="modal need-form-modal" role="dialog" aria-modal="true" aria-labelledby="need-form-title"><button className="icon-button modal-close" onClick={() => setFormOpen(false)} aria-label="Tutup"><X size={20} /></button><span className="eyebrow">Need Board</span><h2 id="need-form-title">Ceritakan apa yang kamu butuhkan</h2><p>Berikan informasi secukupnya agar calon pemberi dapat memahami dan menawarkan barang yang tepat.</p><form className="form-stack" onSubmit={handleSubmit}><label><span>Judul kebutuhan</span><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Contoh: Butuh meja belajar untuk anak" /></label><div className="two-column"><label><span>Kategori</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{socialCategories.map((entry) => <option key={entry}>{entry}</option>)}</select></label><label><span>Lokasi umum</span><input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Kota atau area" /></label></div><label><span>Deskripsi kebutuhan</span><textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Jelaskan jenis, ukuran, atau kondisi yang masih cocok..." /></label><button className="btn btn-primary" type="submit"><HandHeart size={18} /> Publikasikan kebutuhan</button></form></div></div>}
    </main>
  );
}
