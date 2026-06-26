import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-mark"><HeartHandshake size={34} /><span>404</span></div>
      <div>
        <span className="eyebrow">Sepertinya kita tersesat</span><h1>Halaman ini belum<br /><em>menemukan rumahnya.</em></h1>
        <p>Tautannya mungkin sudah berubah atau halaman yang kamu cari tidak tersedia.</p>
        <Link className="btn btn-primary" to="/"><ArrowLeft size={17} /> Kembali ke beranda</Link>
      </div>
    </main>
  );
}
