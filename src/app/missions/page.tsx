'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

interface Mission {
  id: string;
  title: string;
  description: string;
  target_type: string;
  target_count: number;
  xp_reward: number;
  progress: number | null;
  claimed: boolean | null;
  date: string | null;
}

export default function MissionsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchMissions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/missions/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMissions(data);
        } else if (res.status === 401) {
          showToast('Session expired, silakan login ulang', 'error');
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch missions:', err);
        showToast('Gagal memuat misi', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchMissions();
  }, [user, token, router, showToast]);

  const handleClaim = async (missionId: string) => {
    if (claimingId) return;
    setClaimingId(missionId);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/missions/${missionId}/claim`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.ok) {
        showToast('Reward berhasil diklaim! +XP', 'success');
        // Refresh missions
        const updated = missions.map(m =>
          m.id === missionId ? { ...m, claimed: true } : m
        );
        setMissions(updated);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Gagal klaim reward', 'error');
      }
    } catch (err) {
      showToast('Error koneksi saat klaim', 'error');
    } finally {
      setClaimingId(null);
    }
  };

  if (!user) return null;

  const getMissionStatus = (mission: Mission) => {
    const progress = mission.progress ?? 0;
    const target = mission.target_count;
    const completed = progress >= target;
    const claimed = mission.claimed ?? false;
    return { progress, target, completed, claimed };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-slate-600">Bacaan</Link>
            <Link href="/missions" className="text-sm text-primary-600 font-medium">Misi</Link>
            <Link href="/achievements" className="text-sm text-slate-600">Achievements</Link>
            <Link href="/profile" className="text-sm text-slate-600">Profil</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Misi Harian</h2>
          <span className="text-sm text-slate-500">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : missions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-slate-500">Belum ada misi harian.</p>
            <p className="text-sm text-slate-400 mt-2">Misi akan muncul setiap hari!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((mission: Mission) => {
              const { progress, target, completed, claimed } = getMissionStatus(mission);
              return (
                <div key={mission.id} className="p-4 bg-white rounded-xl border">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{mission.title}</h3>
                        {completed && !claimed && (
                          <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                            Siap Klaim
                          </span>
                        )}
                        {claimed && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                            Sudah Diklaim
                          </span>
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
                      <span className={completed ? 'text-green-600 font-medium' : 'text-slate-600'}>
                        {progress}/{target}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${completed ? 'bg-green-500' : 'bg-primary-500'}`}
                        style={{ width: `${Math.min((progress / target) * 100, 100)}%` }}
                      />
                    </div>
                    {completed && !claimed && (
                      <button
                        onClick={() => handleClaim(mission.id)}
                        disabled={claimingId === mission.id}
                        className="mt-3 w-full py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
                      >
                        {claimingId === mission.id ? 'Mengklaim...' : 'Klaim Reward'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
