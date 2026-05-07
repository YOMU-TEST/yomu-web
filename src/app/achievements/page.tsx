'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { achievementService } from '@/services/achievementService';
import { AUTH_REDIRECT } from '@/lib/constants';
import type { AchievementResponse } from '@/services/achievementService';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID');
}

export default function AchievementsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<AchievementResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push(AUTH_REDIRECT); return; }

    achievementService.getForUser(user.id, token!)
      .then(setAchievements)
      .catch(err => console.error('Failed to fetch achievements:', err))
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router]);

  if (isLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : achievements.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">Belum ada achievement.</p>
            <p className="text-sm text-slate-400 mt-2">Selesaikan bacaan untuk membuka achievement!</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map(ach => {
              const isUnlocked = ach.unlocked;
              return (
                <Card key={ach.id} className={`flex items-center gap-4 ${!isUnlocked ? 'opacity-50' : ''}`}>
                  <div className="text-4xl">{isUnlocked ? '🏆' : '🔒'}</div>
                  <div>
                    <h3 className="font-semibold">{ach.name}</h3>
                    <p className="text-sm text-slate-500">
                      {ach.description || `Milestone: ${ach.milestone}`}
                    </p>
                    {ach.unlockedAt && (
                      <p className="text-xs text-slate-400 mt-1">
                        Di-unlock: {formatDate(ach.unlockedAt)}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}