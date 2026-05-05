'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Clan {
  id: string;
  name: string;
  tier: string;
  totalScore: number;
  leaderId: string;
  leaderName: string;
  memberCount: number;
}

export default function ClansPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        }
      } catch (err) {
        console.error('Failed to fetch clans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClans();
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-slate-600">Bacaan</Link>
            <Link href="/clans" className="text-sm text-primary-600 font-medium">Clan</Link>
            <Link href="/leaderboard" className="text-sm text-slate-600">Leaderboard</Link>
            <Link href="/profile" className="text-sm text-slate-600">Profil</Link>
          </nav>
        </div>
      </header>

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
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        clan.tier === 'diamond' ? 'bg-purple-100 text-purple-700' :
                        clan.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                        clan.tier === 'silver' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {clan.tier.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Leader: {clan.leaderName} • {clan.memberCount} anggota
                    </p>
                    <p className="text-sm text-slate-500">
                      Skor: {clan.totalScore.toFixed(0)}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/clans/${clan.id}/join`,
                          { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (res.ok) router.push('/clans');
                        else alert('Gagal bergabung');
                      } catch {
                        alert('Error');
                      }
                    }}
                    className="px-4 py-2 border border-primary-600 text-primary-600 text-sm rounded-lg hover:bg-primary-50"
                  >
                    Gabung
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}