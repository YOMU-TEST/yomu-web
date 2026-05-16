'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import Header from '@/components/Header';

interface Clan {
  id: string;
  name: string;
  tier: string;
  totalScore: number;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  myRole?: string;
  currentTier?: string;
  previewTier?: string;
  willPromote?: boolean;
  willDemote?: boolean;
}

export default function ClansPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [clans, setClans] = useState<Clan[]>([]);
  const [myClanId, setMyClanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchClans = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setClans(data);
        } else if (res.status === 401) {
          showToast('Session expired, silakan login ulang', 'error');
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch clans:', err);
        showToast('Gagal memuat clan', 'error');
      } finally {
        setLoading(false);
      }
    };

    const fetchMyClan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clans/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMyClanId(data.id);
        } else if (res.status === 404) {
          setMyClanId(null);
        }
      } catch (err) {
        console.error('Failed to fetch my clan:', err);
      }
    };

    fetchClans();
    fetchMyClan();
  }, [user, token, isLoading, router, showToast]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  }

  if (!user) return null;

  const handleJoin = async (clanId: string) => {
    if (actionLoading) return;
    setActionLoading(clanId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clans/${clanId}/join`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        showToast('Berhasil bergabung dengan clan!', 'success');
        router.push('/clans');
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Gagal bergabung', 'error');
      }
    } catch {
      showToast('Error koneksi', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (clanId: string) => {
    if (actionLoading) return;
    if (!confirm('Yakin ingin keluar dari clan ini?')) return;

    setActionLoading(clanId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clans/${clanId}/leave`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        showToast('Berhasil keluar dari clan', 'success');
        router.push('/clans');
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Gagal keluar clan', 'error');
      }
    } catch {
      showToast('Error koneksi', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (clanId: string) => {
    if (actionLoading) return;
    if (!confirm('Yakin ingin menghapus clan ini? Semua anggota akan keluar.')) return;

    setActionLoading(clanId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/clans/${clanId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        showToast('Clan berhasil dihapus', 'success');
        router.push('/clans');
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Gagal menghapus clan', 'error');
      }
    } catch {
      showToast('Error koneksi', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pilih Clan</h2>
          <Link
            href="/clans/create"
            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
          >
            Buat Clan
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : clans.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-slate-500">Belum ada clan. Buat clan pertama!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {clans.map((clan) => (
              <div key={clan.id} className="p-6 bg-white rounded-xl border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{clan.name}</h3>
                      <div className="flex items-center gap-2" title={clan.willPromote ? 'Akan dipromosi jika season berakhir sekarang' : clan.willDemote ? 'Akan didegradasi jika season berakhir sekarang' : 'Tier akan berubah di akhir season'}>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          (clan.currentTier || clan.tier) === 'diamond' ? 'bg-purple-100 text-purple-700' :
                          (clan.currentTier || clan.tier) === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                          (clan.currentTier || clan.tier) === 'silver' ? 'bg-gray-100 text-gray-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {(clan.currentTier || clan.tier).toUpperCase()}
                        </span>
                        {clan.willPromote && (
                          <span className="text-xs text-green-600 font-medium">
                            → {clan.previewTier?.toUpperCase()} ↑
                          </span>
                        )}
                        {clan.willDemote && (
                          <span className="text-xs text-red-600 font-medium">
                            → {clan.previewTier?.toUpperCase()} ↓
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Leader: <Link href={`/profile/${clan.leaderId}`} className="hover:underline">{clan.leaderName}</Link> • {clan.memberCount} anggota
                    </p>
                    <p className="text-sm text-slate-500">
                      Skor: {clan.totalScore.toFixed(0)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleJoin(clan.id)}
                      disabled={actionLoading !== null || myClanId !== null}
                      className="px-4 py-2 border border-primary-600 text-primary-600 text-sm rounded-lg hover:bg-primary-50 disabled:opacity-50"
                    >
                      {myClanId ? 'Sudah Gabung' : 'Gabung'}
                    </button>
                    {clan.leaderId === user.id && (
                      <button
                        onClick={() => handleDelete(clan.id)}
                        disabled={actionLoading !== null}
                        className="px-4 py-2 border border-red-500 text-red-500 text-sm rounded-lg hover:bg-red-50 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}