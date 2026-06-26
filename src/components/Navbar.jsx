import { ChevronDown, HeartHandshake, LogOut, Menu, UserRound, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLenis } from '../contexts/LenisContext';

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/barang', label: 'Jelajahi Barang' },
  { to: '/need-board', label: 'Need Board' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const scrolledRef = useRef(false);
  const { isAuthenticated, profile, signOut } = useAuth();
  const { lenis } = useLenis();

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    function updateScrolled(scrollY) {
      const scrolled = scrollY > 8;
      if (scrolledRef.current === scrolled) return;
      scrolledRef.current = scrolled;
      header.classList.toggle('is-scrolled', scrolled);
    }

    if (lenis) {
      const onScroll = (instance) => updateScrolled(instance.scroll);
      updateScrolled(lenis.scroll);
      lenis.on('scroll', onScroll);
      return () => lenis.off('scroll', onScroll);
    }

    function onNativeScroll() {
      updateScrolled(window.scrollY);
    }

    onNativeScroll();
    window.addEventListener('scroll', onNativeScroll, { passive: true });
    return () => window.removeEventListener('scroll', onNativeScroll);
  }, [lenis]);

  return (
    <header ref={headerRef} className="site-header">
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="BaeBack, kembali ke beranda">
          <span className="brand-mark">
            <HeartHandshake size={22} aria-hidden="true" />
          </span>
          <span className="brand-copy"><strong>BaeBack</strong><small>goods with a second story</small></span>
        </Link>

        <button className="icon-button menu-button" onClick={() => setOpen((value) => !value)} aria-label="Buka menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link className="btn btn-primary" to="/donasikan" onClick={() => setOpen(false)}>
            Bagikan barang
          </Link>
          {isAuthenticated ? (
            <div className="account-menu">
              <Link className="account-link" to="/dashboard" onClick={() => setOpen(false)}>
                <span className="nav-avatar">{profile?.full_name?.[0] || 'B'}</span>
                <span><small>Akun saya</small>{profile?.full_name || 'Profil'}</span>
                <ChevronDown size={15} />
              </Link>
              <div className="account-popover">
                <Link to="/dashboard" onClick={() => setOpen(false)}><UserRound size={16} /> Dashboard</Link>
                <Link to="/profil" onClick={() => setOpen(false)}>Profil kontribusi</Link>
                <Link to="/daftar-minat" onClick={() => setOpen(false)}>Daftar minat</Link>
                <button onClick={signOut}><LogOut size={16} /> Keluar</button>
              </div>
            </div>
          ) : (
            <Link className="btn btn-secondary" to="/login" onClick={() => setOpen(false)}>
              Masuk
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
