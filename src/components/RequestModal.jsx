import { X } from 'lucide-react';
import { useState } from 'react';

export default function RequestModal({ item, open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    reason: '',
    planned_pickup_at: '',
    note: '',
    agree: false,
  });

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
    setForm({ reason: '', planned_pickup_at: '', note: '', agree: false });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="request-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Tutup">
          <X size={20} />
        </button>
        <h2 id="request-title">Ajukan Ambil Barang</h2>
        <p>
          Ceritakan singkat kenapa kamu membutuhkan <strong>{item?.title}</strong>. Pemberi akan meninjau
          pengajuanmu dengan lebih jelas.
        </p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            <span>Alasan membutuhkan barang</span>
            <textarea
              required
              minLength={20}
              value={form.reason}
              onChange={(event) => setForm({ ...form, reason: event.target.value })}
              placeholder="Contoh: Saya membutuhkan buku ini untuk kuliah..."
            />
          </label>
          <label>
            <span>Rencana waktu pengambilan</span>
            <input
              type="datetime-local"
              value={form.planned_pickup_at}
              onChange={(event) => setForm({ ...form, planned_pickup_at: event.target.value })}
            />
          </label>
          <label>
            <span>Catatan tambahan</span>
            <textarea
              value={form.note}
              onChange={(event) => setForm({ ...form, note: event.target.value })}
              placeholder="Tambahkan info singkat bila perlu"
            />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              required
              checked={form.agree}
              onChange={(event) => setForm({ ...form, agree: event.target.checked })}
            />
            <span>Saya akan mengajukan sesuai kebutuhan dan menjaga komunikasi dengan pemberi.</span>
          </label>
          <button className="btn btn-primary" type="submit">
            Kirim Pengajuan
          </button>
        </form>
      </div>
    </div>
  );
}
