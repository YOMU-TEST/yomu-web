'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import { missionService } from '@/services/missionService';
import { useToast } from '@/hooks/useToast';
import { AUTH_REDIRECT, DATE_FORMAT, SUCCESS_MESSAGES } from '@/lib/constants';
import type { Mission } from '@/types/domain';

interface MissionWithStatus extends Mission {
  status: 'in_progress' | 'ready_to_claim' | 'claimed';
}

export default function MissionsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [missions, setMissions] = useState<MissionWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push(AUTH_REDIRECT); return; }

    missionService.getForUser(user.id, token!)
      .then(data => {
        setMissions(data.map(m => {
          const progress = m.progress ?? 0;
          const completed = progress >= m.targetCount;
          const claimed = m.claimed ?? false;
          return {
            ...m,
            status: claimed ? 'claimed' : completed ? 'ready_to_claim' : 'in_progress',
          };
        }));
      })
      .catch(err => {
        console.error('Failed to fetch missions:', err);
        toast.error('Gagal memuat misi');
      })
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router, toast]);

  const handleClaim = async (missionId: string) => {
    if (claimingId) return;
    setClaimingId(missionId);
    try {
      await missionService.claim(missionId, token!);
      toast.success(SUCCESS_MESSAGES.REWARD_CLAIMED);
      setMissions(prev =>
        prev.map(m => m.id === missionId ? { ...m, status: 'claimed' as const } : m)
      );
    } catch (err) {
      toast.error('Gagal klaim reward');
    } finally {
      setClaimingId(null);
    }
  };

  if (isLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Misi Harian</h2>
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString(DATE_FORMAT.LOCALE, DATE_FORMAT.FULL)}
          </span>
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : missions.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">Belum ada misi harian.</p>
            <p className="text-sm text-slate-400 mt-2">Misi akan muncul setiap hari!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {missions.map(mission => (
              <Card key={mission.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{mission.title}</h3>
                      {mission.status === 'ready_to_claim' && (
                        <Badge variant="status" status="pending">Siap Klaim</Badge>
                      )}
                      {mission.status === 'claimed' && (
                        <Badge variant="status" status="completed">Sudah Diklaim</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{mission.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amber-500">+{mission.xp_reward} XP</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">
                      {mission.target_type === 'reading' ? 'Bacaan' : mission.target_type}
                    </span>
                    <span className={mission.status !== 'in_progress' ? 'text-green-600 font-medium' : 'text-slate-600'}>
                      {mission.progress ?? 0}/{mission.target_count}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${mission.status !== 'in_progress' ? 'bg-green-500' : 'bg-primary-500'}`}
                      style={{ width: `${Math.min(((mission.progress ?? 0) / mission.target_count) * 100, 100)}%` }}
                    />
                  </div>
                  {mission.status === 'ready_to_claim' && (
                    <Button
                      className="mt-3 w-full"
                      onClick={() => handleClaim(mission.id)}
                      isLoading={claimingId === mission.id}
                    >
                      {claimingId === mission.id ? 'Mengklaim...' : 'Klaim Reward'}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}