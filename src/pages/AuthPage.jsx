import { ArrowRight, Check, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [notice, setNotice] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isSupabaseConfigured) { setNotice('Mode demo aktif. Kamu akan masuk ke dashboard contoh.'); setTimeout(() => navigate('/dashboard'), 450); return; }
    const result = isRegister ? await signUp(form.email, form.password, form.fullName) : await signIn(form.email, form.password);
    if (result.error) { setNotice(result.error.message); return; }
    navigate('/dashboard');
  }

  return (
    <main className="auth-page"><section className="auth-story"><Link to="/" className="brand"><span className="brand-mark"><HeartHandshake size={21} /></span><span className="brand-copy"><strong>BaeBack</strong><small>goods with a second story</small></span></Link><div><span className="hero-kicker"><Sparkles size={14} /> Komunitas berbagi barang</span><h1>Lebih banyak manfaat.<br /><em>Lebih sedikit yang terbuang.</em></h1><p>Satu akun untuk berbagi, mengajukan kebutuhan, dan mengikuti perjalanan setiap barang.</p><ul><li><Check size={16} /> Semua barang dibagikan gratis</li><li><Check size={16} /> Pengajuan berbasis kebutuhan</li><li><ShieldCheck size={16} /> Riwayat dan reputasi komunitas</li></ul></div><small>© 2026 BaeBack · Berbagi dengan lebih manusiawi</small></section><section className="auth-form-side"><div className="auth-card"><span className="eyebrow">{isRegister ? 'Bergabung dengan BaeBack' : 'Selamat datang kembali'}</span><h2>{isRegister ? 'Buat akunmu' : 'Masuk ke akunmu'}</h2><p>{isRegister ? 'Mulai satu cerita baik dari barang yang sudah tak terpakai.' : 'Lanjutkan aktivitas dan percakapan komunitasmu.'}</p>{notice && <p className="success-note">{notice}</p>}<form className="form-stack" onSubmit={handleSubmit}>{isRegister && <label><span>Nama lengkap</span><input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Nama yang tampil di komunitas" /></label>}<label><span>Alamat email</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="nama@email.com" /></label><label><span>Kata sandi</span><input required type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Minimal 6 karakter" /></label><button className="btn btn-primary" type="submit">{isRegister ? 'Buat akun' : 'Masuk sekarang'} <ArrowRight size={17} /></button></form><div className="auth-divider"><span>atau</span></div><p className="auth-switch">{isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Masuk di sini' : 'Daftar gratis'}</Link></p></div></section></main>
  );
}
