import { ArrowUpRight, HeartHandshake, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-intro">
          <Link to="/" className="brand footer-brand">
            <span className="brand-mark"><HeartHandshake size={21} aria-hidden="true" /></span>
            <span className="brand-copy"><strong>BaeBack</strong><small>goods with a second story</small></span>
          </Link>
          <p>Tempat barang baik menemukan cerita keduanya—langsung kepada orang yang membutuhkannya.</p>
          <div className="footer-socials">
            <a href="mailto:halo@baeback.id" aria-label="Email BaeBack"><Mail size={18} /></a>
            <a href="https://instagram.com" aria-label="Instagram BaeBack"><Instagram size={18} /></a>
          </div>
        </div>
        <div>
          <h4>Jelajahi</h4>
          <Link to="/barang">Cari Barang</Link>
          <Link to="/need-board">Need Board</Link>
          <Link to="/blog">Blog & Inspirasi</Link>
          <Link to="/donasikan">Bagikan Barang</Link>
        </div>
        <div>
          <h4>Akun</h4>
          <Link to="/dashboard">Aktivitas Saya</Link>
          <Link to="/daftar-minat">Daftar Minat</Link>
          <Link to="/profil">Profil</Link>
        </div>
        <div className="footer-share">
          <h4>Mulai berbagi</h4>
          <p>Barang yang tak lagi kamu gunakan bisa berarti besar bagi orang lain.</p>
          <Link className="footer-cta" to="/donasikan">Bagikan barang <ArrowUpRight size={17} /></Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 BaeBack</span>
        <span>Dibuat untuk sirkulasi kebaikan, bukan transaksi.</span>
      </div>
    </footer>
  );
}
