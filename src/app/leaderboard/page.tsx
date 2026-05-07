'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { clanService } from '@/services/clanService';
import { AUTH_REDIRECT } from '@/lib/constants';
import type { LeaderboardEntry } from '@/types/domain';

function getRankStyle(idx: number): string {
  if (idx === 0) return 'bg-amber-400 text-white';
  if (idx === 1) return 'bg-gray-300 text-white';
  if (idx === 2) return 'bg-amber-600 text-white';
  return 'bg-slate-100 text-slate-600';
}

export default function LeaderboardPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push(AUTH_REDIRECT); return; }

    clanService.getLeaderboard(token!)
      .then(setLeaderboard)
      .catch(err => console.error('Failed to fetch leaderboard:', err))
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router]);

  if (isLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : leaderboard.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">Belum ada data clan.</p>
          </Card>
        ) : (
          <Card padding="none" className="overflow-hidden">
            {leaderboard.map((clan, idx) => (
              <div
                key={clan.clanId}
                className="flex items-center justify-between p-4 border-b last:border-b-0"
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${getRankStyle(idx)}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-semibold">{clan.clanName}</p>
                    <p className="text-sm text-slate-500">{clan.memberCount} anggota</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{clan.effectiveScore.toFixed(0)}</p>
                  <Badge variant="tier" tier={clan.tier} />
                </div>
              </div>
            ))}
          </Card>
        )}
      </main>
    </div>
  );
}