import { ArrowRight, Check, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [notice, setNotice] = useState('');
  const location = useLocation();
  const { signIn, signUp, isAuthenticated, loading, profile } = useAuth();
  const navigate = useNavigate();

  const returnTo = location.state?.from?.pathname || (profile?.role === 'admin' ? '/admin' : '/dashboard');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, returnTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = isRegister ? await signUp(form.email, form.password, form.fullName) : await signIn(form.email, form.password);
    if (result.error) {
      setNotice(result.error.message);
      return;
    }

    const nextTarget = location.state?.from?.pathname || '/dashboard';
    navigate(nextTarget, { replace: true });
  }

  return (
    <main className="auth-page">
      <SEO
        title={isRegister ? 'Daftar' : 'Masuk'}
        description="Masuk atau daftar akun BaeBack untuk berbagi barang, mengajukan kebutuhan, dan ikut campaign kebaikan."
        path={isRegister ? '/register' : '/login'}
        noindex
      />
      <section className="auth-story">
        <Link to="/" className="brand">
          <span className="brand-mark"><HeartHandshake size={21} /></span>
          <span className="brand-copy"><strong>BaeBack</strong><small>goods with a second story</small></span>
        </Link>
        <div>
          <span className="hero-kicker"><Sparkles size={14} /> Komunitas berbagi barang</span>
          <h1>Lebih banyak manfaat.<br /><em>Lebih sedikit yang terbuang.</em></h1>
          <p>Satu akun untuk berbagi, mengajukan kebutuhan, dan mengikuti perjalanan setiap barang.</p>
          <ul>
            <li><Check size={16} /> Semua barang dibagikan gratis</li>
            <li><Check size={16} /> Pengajuan berbasis kebutuhan</li>
            <li><ShieldCheck size={16} /> Riwayat dan reputasi komunitas</li>
          </ul>
        </div>
        <small>© 2026 BaeBack · Berbagi dengan lebih manusiawi</small>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <span className="eyebrow">{isRegister ? 'Bergabung dengan BaeBack' : 'Selamat datang kembali'}</span>
          <h2>{isRegister ? 'Buat akunmu' : 'Masuk ke akunmu'}</h2>
          <p>{isRegister ? 'Mulai satu cerita baik dari barang yang sudah tak terpakai.' : 'Lanjutkan aktivitas dan percakapan komunitasmu.'}</p>

          {notice && <p className="success-note">{notice}</p>}

          <form className="form-stack" onSubmit={handleSubmit}>
            {isRegister && (
              <label>
                <span>Nama lengkap</span>
                <input required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Nama yang tampil di komunitas" />
              </label>
            )}

            <label>
              <span>Alamat email</span>
              <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="nama@email.com" />
            </label>

            <label>
              <span>Kata sandi</span>
              <input required type="password" minLength={6} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Minimal 6 karakter" />
            </label>

            <button className="btn btn-primary" type="submit">
              {isRegister ? 'Buat akun' : 'Masuk sekarang'} <ArrowRight size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
