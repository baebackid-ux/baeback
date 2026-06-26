import { ArrowLeft, Check, HandHeart, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { fallbackNeeds } from '../data/mockData';
import { getNeedStatusLabel } from '../lib/formatters';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function NeedDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [need, setNeed] = useState(fallbackNeeds.find((entry) => entry.id === id) || fallbackNeeds[0]);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    async function loadNeed() { const { data } = await supabase.from('need_posts').select('*').eq('id', id).single(); if (data) setNeed(data); }
    loadNeed();
  }, [id]);

  async function handleOffer(event) {
    event.preventDefault();
    if (isSupabaseConfigured) { await supabase.from('need_offers').insert({ need_post_id: need.id, donor_id: user?.id, message, status: 'offered' }); await supabase.from('need_posts').update({ status: 'offered' }).eq('id', need.id); }
    setNotice('Tawaranmu sudah terkirim kepada pembuat kebutuhan.');
    setMessage('');
  }

  return (
    <main className="need-detail-page">
      <div className="container detail-breadcrumb"><Link to="/need-board"><ArrowLeft size={16} /> Kembali ke Need Board</Link></div>
      <div className="container need-detail-grid">
        <article className="need-detail-story"><div className="card-badges"><Badge tone="yellow" icon="urgent">{need.urgency || 'Need Board'}</Badge><StatusPill status={need.status}>{getNeedStatusLabel(need.status)}</StatusPill></div><span className="detail-category">{need.category}</span><h1>{need.title}</h1><div className="need-detail-location"><MapPin size={18} /> {need.location}</div><div className="need-story-copy"><span className="eyebrow">Kebutuhannya</span><p>{need.description}</p></div><div className="need-safety-note"><ShieldCheck size={19} /><p>Jaga privasi. Detail kontak dan lokasi spesifik sebaiknya dibagikan setelah tawaran diterima.</p></div></article>
        <aside className="offer-panel"><span className="offer-icon"><HandHeart size={24} /></span><span className="eyebrow">Punya barang yang sesuai?</span><h2>Tawarkan bantuanmu</h2><p>Jelaskan barang, kondisinya, serta cara pengambilan yang memungkinkan.</p>{notice && <p className="success-note"><Check size={17} /> {notice}</p>}<form className="form-stack" onSubmit={handleOffer}><label><span>Pesan untuk pembuat kebutuhan</span><textarea required minLength={20} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Saya memiliki barang yang mungkin sesuai..." /></label><button className="btn btn-primary" type="submit">Kirim tawaran <HandHeart size={18} /></button></form><small>Menawarkan barang tidak memerlukan biaya apa pun. Jangan mengirim uang atau data sensitif.</small></aside>
      </div>
    </main>
  );
}
