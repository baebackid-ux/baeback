import { ArrowRight, Flag, ShieldCheck, UploadCloud, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import StatusPill from '../components/StatusPill';
import { fallbackItems } from '../data/mockData';

export default function AdminPage() {
  const reports = [
    { id: 'report-1', title: 'Barang tidak sesuai kondisi', status: 'submitted' },
    { id: 'report-2', title: 'Indikasi penyalahgunaan akun', status: 'reviewing' },
  ];

  return (
    <main className="admin-page">
      <div className="container admin-topbar"><span><ShieldCheck size={16} /> Ruang pengelola</span><span>Admin BaeBack</span></div>
      <div className="container page-heading split-heading">
        <div>
          <span className="eyebrow">Ikhtisar hari ini</span>
          <h1>Komunitas yang sehat<br /><em>dimulai dari sini.</em></h1>
          <p>Kelola postingan resmi, tinjau laporan, dan jaga pengalaman berbagi tetap aman.</p>
        </div>
        <Link className="btn btn-primary" to="/donasikan">
          <UploadCloud size={18} />
          Buat official post
        </Link>
      </div>
      <section className="container dashboard-stats">
        <div className="stat-card">
          <ShieldCheck size={21} />
          <strong>3</strong>
          <span>Official Post</span>
        </div>
        <div className="stat-card">
          <Flag size={21} />
          <strong>{reports.length}</strong>
          <span>Report perlu ditinjau</span>
        </div>
        <div className="stat-card"><Users size={21} /><strong>75</strong><span>Donatur aktif</span></div>
      </section>
      <section className="container section admin-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">Official charity</span><h2>Postingan resmi</h2></div><Link className="text-link" to="/barang">Lihat semua <ArrowRight size={15} /></Link>
        </div>
        <div className="card-grid">
          {fallbackItems.filter((item) => item.post_type === 'official').map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <section className="container section admin-section">
        <div className="section-heading compact">
          <div><span className="eyebrow">Keamanan</span><h2>Report yang perlu ditinjau</h2></div>
        </div>
        <div className="request-list">
          {reports.map((report) => (
            <article className="request-row" key={report.id}>
              <div className="request-main"><span className="request-avatar"><Flag size={16} /></span><div><small>Laporan komunitas</small><strong>{report.title}</strong></div></div>
              <StatusPill status={report.status}>Perlu ditinjau</StatusPill>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
