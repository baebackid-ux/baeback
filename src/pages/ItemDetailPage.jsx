import { ArrowLeft, Check, Flag, Heart, MapPin, MessageCircle, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import ItemCard from '../components/ItemCard';
import RequestModal from '../components/RequestModal';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { fallbackItems } from '../data/mockData';
import { getItemStatusLabel, getPostTypeLabel } from '../lib/formatters';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(fallbackItems.find((entry) => entry.id === id) || fallbackItems[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadItem() {
      const { data } = await supabase.from('items').select('*').eq('id', id).single();
      if (data) setItem(data);
    }
    loadItem();
  }, [id]);

  function requireLogin() {
    if (user) return true;
    navigate('/login', { replace: true, state: { from: { pathname: `/barang/${id}` } } });
    return false;
  }

  async function handleRequest(payload) {
    if (!requireLogin()) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('pickup_requests').insert({ item_id: item.id, requester_id: user.id, reason: payload.reason, planned_pickup_at: payload.planned_pickup_at || null, note: payload.note, status: 'submitted' });
      if (error) {
        setNotice(error.message);
        return;
      }
    }
    setModalOpen(false);
    setNotice('Pengajuanmu sudah terkirim. Pemberi akan meninjaunya terlebih dahulu.');
  }

  async function addFavorite() {
    if (!requireLogin()) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('favorites').upsert({ user_id: user.id, item_id: item.id });
      if (error) {
        setNotice(error.message);
        return;
      }
    }
    setNotice('Barang sudah disimpan ke Daftar Minat.');
  }

  async function reportItem() {
    if (!requireLogin()) return;
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('reports').insert({ reporter_id: user.id, item_id: item.id, reason: 'Barang perlu ditinjau', description: 'Pengguna meminta admin meninjau barang ini.' });
      if (error) {
        setNotice(error.message);
        return;
      }
    }
    setNotice('Laporan sudah diterima. Tim BaeBack akan meninjaunya.');
  }

  const related = fallbackItems.filter((entry) => entry.id !== item.id && entry.category === item.category).concat(fallbackItems.filter((entry) => entry.id !== item.id)).slice(0, 3);
  const requiresAuth = !user;

  return (
    <main className="detail-page">
      <div className="container detail-breadcrumb"><Link to="/barang"><ArrowLeft size={16} /> Kembali ke katalog</Link><span>/</span><span>{item.category}</span></div>
      <section className="container detail-grid">
        <div className="detail-media">
          {item.image_url ? <img src={item.image_url} alt={item.title} /> : <div className="image-placeholder">Barang</div>}
          <div className="detail-media-caption"><span>Foto dari pemberi</span><span>Pastikan kondisi sesuai saat pengambilan</span></div>
        </div>
        <aside className="detail-panel">
          <div className="card-badges"><Badge tone={item.post_type === 'official' ? 'teal' : 'green'} icon={item.post_type === 'official' ? 'official' : 'community'}>{getPostTypeLabel(item.post_type)}</Badge><StatusPill status={item.status}>{getItemStatusLabel(item.status)}</StatusPill></div>
          <span className="detail-category">{item.category}</span>
          <h1>{item.title}</h1>
          <p className="detail-lead">{item.description}</p>
          <div className="detail-facts">
            <div><PackageCheck size={19} /><span><small>Kondisi</small><strong>{item.condition}</strong></span></div>
            <div><MapPin size={19} /><span><small>Lokasi</small><strong>{item.location}</strong></span></div>
            <div><Truck size={19} /><span><small>Pengambilan</small><strong>{item.pickup_method}</strong></span></div>
          </div>
          <div className="donor-card"><span className="donor-avatar">{item.donor_name?.[0] || 'B'}</span><div><small>Dibagikan oleh</small><strong>{item.donor_name || 'Pemberi BaeBack'} <ShieldCheck size={15} /></strong><span>{item.post_type === 'official' ? 'Partner resmi BaeBack' : 'Anggota komunitas'}</span></div><Link to="/profil">Lihat profil</Link></div>
          {notice && <p className="success-note"><Check size={17} /> {notice}</p>}
          {requiresAuth && <p className="detail-reassurance">Masuk dulu untuk mengajukan, menyimpan, atau melaporkan barang.</p>}
          <div className="detail-actions"><button className="btn btn-primary" onClick={() => { if (requireLogin()) setModalOpen(true); }}>{requiresAuth ? 'Masuk untuk ajukan' : 'Ajukan ambil barang'}</button><button className="btn btn-secondary" onClick={addFavorite}>{requiresAuth ? 'Masuk untuk simpan' : <><Heart size={17} /> Simpan</>}</button></div>
          <div className="detail-secondary-actions"><Link to={requiresAuth ? '/login' : '/pengajuan'}><MessageCircle size={16} /> {requiresAuth ? 'Masuk untuk tanya pemberi' : 'Tanya pemberi'}</Link><button onClick={reportItem}>{requiresAuth ? 'Masuk untuk lapor' : <><Flag size={15} /> Laporkan</>}</button></div>
          <p className="detail-reassurance"><ShieldCheck size={17} /> Pengajuan tidak menjamin persetujuan. Pemberi akan memilih berdasarkan kebutuhan dan kecocokan pengambilan.</p>
        </aside>
      </section>

      <section className="container detail-content-grid">
        <div className="detail-story"><span className="eyebrow">Tentang barang ini</span><h2>Detail yang perlu kamu tahu</h2><p>{item.description}</p></div>
        <div className="detail-notes"><article><span>01</span><div><h3>Syarat pengambilan</h3><p>{item.requirements || 'Ajukan kebutuhan dengan jujur dan jaga komunikasi setelah disetujui.'}</p></div></article><article><span>02</span><div><h3>Jaga proses tetap aman</h3><p>Sepakati lokasi yang nyaman, periksa kondisi barang, dan jangan pernah melakukan pembayaran.</p></div></article></div>
      </section>

      <section className="container section related-section"><div className="section-heading"><div><span className="eyebrow">Mungkin juga berguna</span><h2>Barang lain untuk dilihat</h2></div><Link className="text-link" to="/barang">Semua barang</Link></div><div className="card-grid">{related.map((entry) => <ItemCard key={entry.id} item={entry} />)}</div></section>
      <RequestModal item={item} open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleRequest} />
    </main>
  );
}
