import { Check, ImagePlus, Info, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { categories, itemConditions, pickupMethods } from '../lib/constants';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const initialForm = {
  title: '',
  category: categories[0],
  condition: itemConditions[2],
  quantity: 1,
  location: '',
  pickup_method: pickupMethods[0],
  description: '',
  requirements: '',
  image_url: '',
};

export default function DonateItemPage() {
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [notice, setNotice] = useState('');
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // Compress image client-side to reduce upload size
  async function compressImage(file, maxWidth = 1200, quality = 0.75) {
    if (!file) return null;
    const dataUrl = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onerror = rej;
      reader.onload = () => res(reader.result);
      reader.readAsDataURL(file);
    });

    const img = await new Promise((res, rej) => {
      const image = new Image();
      image.onload = () => res(image);
      image.onerror = rej;
      image.src = dataUrl;
    });

    const ratio = img.width / img.height;
    const width = Math.min(maxWidth, img.width);
    const height = Math.round(width / ratio);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
    return blob ? new File([blob], (file.name || 'image').replace(/\.[^/.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user) {
      navigate('/login', { replace: true, state: { from: { pathname: '/donasikan' } } });
      return;
    }

    let imageUrl = form.image_url;
    let uploadedStoragePath = '';

    if (isSupabaseConfigured && imageFile) {
      const extension = imageFile.name.split('.').pop();
      const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('item-images').upload(storagePath, imageFile);
      if (uploadError) {
        setNotice(uploadError.message);
        return;
      }
      const { data: publicUrl } = supabase.storage.from('item-images').getPublicUrl(storagePath);
      imageUrl = publicUrl.publicUrl;
      uploadedStoragePath = storagePath;
    }

    const payload = {
      ...form,
      image_url: imageUrl,
      quantity: Number(form.quantity) || 1,
      donor_id: user?.id,
      status: 'available',
      post_type: isAdmin ? 'official' : 'community',
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('items').insert(payload).select('id').single();
      if (error) {
        setNotice(error.message);
        return;
      }
      if (uploadedStoragePath) {
        await supabase.from('item_images').insert({
          item_id: data.id,
          storage_path: uploadedStoragePath,
          alt_text: form.title,
          sort_order: 0,
        });
      }
      navigate(`/barang/${data.id}`);
      return;
    }

    setNotice('Mode demo: data belum dikirim ke Supabase. Isi env untuk menyimpan barang sungguhan.');
  }

  return (
    <main className="donate-page">
      <SEO title="Bagikan Barang" noindex />
      <header className="container donate-heading"><div><span className="eyebrow">Bagikan barang</span><h1>Satu barang.<br /><em>Satu manfaat baru.</em></h1><p>Ceritakan kondisinya dengan jujur. Informasi yang baik membantu barangmu menemukan orang yang tepat.</p></div><ol><li className="active"><span>1</span> Detail barang</li><li><span>2</span> Cara pengambilan</li><li><span>3</span> Publikasikan</li></ol></header>
      <div className="container donate-layout">
      <aside className="donate-guidance"><Info size={20} /><h2>Sebelum mengunggah</h2><ul><li><Check size={15} /> Pastikan barang masih aman dan layak digunakan.</li><li><Check size={15} /> Gunakan foto yang terang dan sesuai kondisi nyata.</li><li><Check size={15} /> Hindari mencantumkan alamat lengkap di deskripsi.</li></ul></aside><div>
      {notice && <p className="success-note">{notice}</p>}
      <form className="form-card form-stack" onSubmit={handleSubmit}>
        <div className="form-section-heading"><span>01</span><div><h2>Tentang barang</h2><p>Informasi dasar yang akan dilihat oleh calon penerima.</p></div></div>
        <label>
          <span>Nama barang</span>
          <input required value={form.title} onChange={(event) => update('title', event.target.value)} />
        </label>
        <div className="two-column">
          <label>
            <span>Kategori</span>
            <select value={form.category} onChange={(event) => update('category', event.target.value)}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Kondisi</span>
            <select value={form.condition} onChange={(event) => update('condition', event.target.value)}>
              {itemConditions.map((condition) => (
                <option key={condition}>{condition}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="two-column">
          <label>
            <span>Jumlah</span>
            <input type="number" min="1" value={form.quantity} onChange={(event) => update('quantity', event.target.value)} />
          </label>
          <label>
            <span>Metode pengambilan</span>
            <select value={form.pickup_method} onChange={(event) => update('pickup_method', event.target.value)}>
              {pickupMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          <span>Lokasi umum</span>
          <input required value={form.location} onChange={(event) => update('location', event.target.value)} placeholder="Contoh: Bandung" />
        </label>
        <label className="upload-field"><ImagePlus size={27} /><strong>{imageFile ? imageFile.name : 'Tambahkan foto barang'}</strong><span>PNG atau JPG, gunakan foto yang jelas</span>
          <input
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0] || null;
              if (!file) {
                setImageFile(null);
                return;
              }
              try {
                const originalSize = Math.round(file.size / 1024);
                const compressed = await compressImage(file, 1200, 0.75);
                if (compressed) {
                  const compressedSize = Math.round(compressed.size / 1024);
                  setImageFile(compressed);
                  setNotice(`Gambar dikompresi: ${originalSize}KB → ${compressedSize}KB`);
                } else {
                  setImageFile(file);
                }
              } catch {
                setImageFile(file);
                setNotice('Gagal mengompresi gambar — menggunakan file asli.');
              }
            }}
          />
        </label>
        <label><span>URL foto alternatif <small>opsional</small></span><input value={form.image_url} onChange={(event) => update('image_url', event.target.value)} placeholder="https://..." /></label>
        <div className="form-section-heading"><span>02</span><div><h2>Deskripsi dan kesepakatan</h2><p>Bantu penerima memahami barang sebelum mengajukan.</p></div></div><label>
          <span>Deskripsi barang</span>
          <textarea required value={form.description} onChange={(event) => update('description', event.target.value)} />
        </label>
        <label>
          <span>Syarat atau catatan pengambilan</span>
          <textarea value={form.requirements} onChange={(event) => update('requirements', event.target.value)} />
        </label>
        <div className="form-submit-row"><p>Dengan mempublikasikan, kamu menyatakan barang dibagikan tanpa biaya.</p><button className="btn btn-primary" type="submit">
          <UploadCloud size={18} />
          Publikasikan Barang
        </button></div>
      </form>
      </div></div>
    </main>
  );
}
