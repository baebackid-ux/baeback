import { Heart, LayoutDashboard, ListChecks, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard },
  { to: '/pengajuan', label: 'Pengajuan', icon: ListChecks },
  { to: '/daftar-minat', label: 'Daftar minat', icon: Heart },
  { to: '/profil', label: 'Profil', icon: UserRound },
];

export default function AccountNav() {
  return <nav className="account-nav" aria-label="Navigasi akun">{items.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to}><Icon size={18} /><span>{label}</span></NavLink>)}</nav>;
}
