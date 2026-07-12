import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

export default function AccessDeniedPage() {
  const { isAuthenticated, isAdmin, profile } = useAuth();

  return (
    <main className="not-found-page">
      <SEO title="Akses Ditolak" noindex />
      <div className="not-found-mark"><ShieldAlert size={34} /><span>403</span></div>
      <div>
        <span className="eyebrow">Akses dibatasi</span>
        <h1>{isAuthenticated && !isAdmin ? 'Akun ini belum memiliki akses admin.' : 'Kamu tidak punya izin untuk membuka halaman ini.'}</h1>
        <p>
          {isAuthenticated
            ? `Masuk sebagai ${profile?.full_name || 'pengguna'} memberi akses ke fitur komunitas, tetapi panel admin tetap hanya untuk akun admin.`
            : 'Silakan masuk dulu untuk melanjutkan.'}
        </p>
        <div className="form-submit-row">
          <Link className="btn btn-primary" to={isAuthenticated ? '/dashboard' : '/login'}>
            <ArrowLeft size={17} />
            {isAuthenticated ? 'Kembali ke dashboard' : 'Masuk'}
          </Link>
          <Link className="btn btn-secondary" to="/">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </main>
  );
}