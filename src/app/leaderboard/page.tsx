'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SeasonInfo {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

interface LeaderboardEntry {
  clanId: string;
  clanName: string;
  tier: string;
  totalScore: number;
  memberCount: number;
  multiplier: number;
  effectiveScore: number;
}

export default function LeaderboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [season, setSeason] = useState<SeasonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clans/leaderboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    const fetchActiveSeason = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/seasons/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSeason(data);
        }
      } catch (err) {
        console.error('Failed to fetch active season:', err);
      }
    };

    Promise.all([fetchLeaderboard(), fetchActiveSeason()])
      .finally(() => setLoading(false));
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-slate-600">Bacaan</Link>
            <Link href="/clans" className="text-sm text-slate-600">Clan</Link>
            <Link href="/leaderboard" className="text-sm text-primary-600 font-medium">Leaderboard</Link>
            <Link href="/profile" className="text-sm text-slate-600">Profil</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Leaderboard Liga</h2>
          {season && (
            <div className="text-sm text-slate-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              Season: <span className="font-medium text-blue-700">{season.name}</span>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-slate-500">Belum ada data leaderboard.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Clan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tier</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Skor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Multiplier</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Effective</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboard.map((entry, index) => (
                  <tr key={entry.clanId} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{entry.clanName}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        entry.tier === 'diamond' ? 'bg-purple-100 text-purple-700' :
                        entry.tier === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                        entry.tier === 'silver' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {entry.tier.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">{entry.totalScore.toFixed(0)}</td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={entry.multiplier > 1 ? 'text-green-600' : entry.multiplier < 1 ? 'text-red-600' : ''}>
                        {entry.multiplier.toFixed(2)}x
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right font-bold">{entry.effectiveScore.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}