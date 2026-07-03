import { CheckCircle2, MessageCircle, Star, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import AccountNav from '../components/AccountNav';
import StatusPill from '../components/StatusPill';
import { useAuth } from '../contexts/AuthContext';
import { fallbackRequests } from '../data/mockData';
import { getRequestStatusLabel } from '../lib/formatters';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function RequestsPage() {
  const [requests, setRequests] = useState(fallbackRequests);
  const { user, isAdmin, incrementKindnessPointsLocal } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    async function loadRequests() {
      const { data } = await supabase
        .from('pickup_requests')
        .select('*, item:items(title, donor_id), requester:profiles(full_name)')
        .order('created_at', { ascending: false });
      if (data) {
        setRequests(
          data.map((request) => ({
            ...request,
            item_title: request.item?.title || 'Barang BaeBack',
            donor_id: request.item?.donor_id,
            requester_name: request.requester?.full_name || 'Penerima',
          })),
        );
      }
    }

    loadRequests();
  }, [user]);

  const visibleRequests = requests.filter((request) => isAdmin || request.requester_id === user?.id || request.donor_id === user?.id);

  async function updateStatus(id, status) {
    const request = requests.find((entry) => entry.id === id);
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('pickup_requests').update({ status }).eq('id', id);
      if (error) {
        return;
      }
      if (request?.item_id && status === 'approved') {
        await supabase.from('items').update({ status: 'reserved' }).eq('id', request.item_id);
      }
      if (request?.item_id && status === 'received') {
        await supabase.from('items').update({ status: 'received' }).eq('id', request.item_id);
      }
    } else if (status === 'received') {
      incrementKindnessPointsLocal(10, user?.id);
    }
    setRequests((current) => current.map((request) => (request.id === id ? { ...request, status } : request)));
  }

  async function giveRating(request) {
    if (isSupabaseConfigured && user && request.donor_id) {
      await supabase.from('ratings').upsert({
        pickup_request_id: request.id,
        reviewer_id: user.id,
        reviewed_id: request.donor_id,
        score: 5,
        review: 'Proses pengambilan berjalan baik.',
      });
    }
    setRequests((current) => current.map((entry) => (entry.id === request.id ? { ...entry, rated: true } : entry)));
  }

  return (
    <main className="account-page requests-page">
      <div className="container"><AccountNav /></div>
      <div className="container page-heading split-heading">
       <div>
        <span className="eyebrow">Riwayat Pengajuan</span>
        <h1>Setiap pengajuan,<br /><em>satu percakapan.</em></h1>
        <p>Tinjau alasan dengan empati, lalu lanjutkan proses secara jelas dan aman.</p>
       </div><div className="request-legend"><span><i className="legend-pending" /> Menunggu</span><span><i className="legend-done" /> Selesai</span></div>
      </div>
      <div className="container request-list detailed-request-list">
        {visibleRequests.map((request) => (
          <article className="request-row" key={request.id}>
            <div className="request-main"><span className="request-avatar">{request.requester_name?.[0] || 'P'}</span><div><small>Pengajuan dari {request.requester_name}</small><strong>{request.item_title}</strong><p>“{request.reason}”</p></div></div>
            <StatusPill status={request.status}>{getRequestStatusLabel(request.status)}</StatusPill>
            {(isAdmin || request.donor_id === user?.id) && (
              <div className="row-actions">
                <button className="action-approve" title="Setujui" onClick={() => updateStatus(request.id, 'approved')}>
                  <CheckCircle2 size={17} /> Setujui
                </button>
                <button title="Tolak" onClick={() => updateStatus(request.id, 'rejected')}>
                  <XCircle size={17} /> Tolak
                </button>
                <button title="Chat" onClick={() => updateStatus(request.id, 'waiting_pickup')}>
                  <MessageCircle size={17} /> Chat
                </button>
                <button title="Sudah diterima" onClick={() => updateStatus(request.id, 'received')}>
                  <CheckCircle2 size={17} /> Diterima
                </button>
                {!isSupabaseConfigured && (
                  <button title="Sudah diterima (demo)" onClick={() => updateStatus(request.id, 'received')}>
                    <CheckCircle2 size={17} /> Diterima (demo)
                  </button>
                )}
                <button title="Beri rating" onClick={() => giveRating(request)}>
                  <Star size={17} /> Rating
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
