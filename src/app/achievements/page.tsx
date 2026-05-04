'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AchievementsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchAchievements = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/achievements/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setAchievements(data);
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAchievements();
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-slate-600">Bacaan</Link>
            <Link href="/achievements" className="text-sm text-primary-600 font-medium">Achievements</Link>
            <Link href="/profile" className="text-sm text-slate-600">Profil</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Achievements</h2>
        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-slate-500">Belum ada achievement yang dibuka.</p>
            <p className="text-sm text-slate-400 mt-2">Selesaikan bacaan untuk membuka achievement!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((ach: any) => (
              <div key={ach.id} className="p-4 bg-white rounded-xl border flex items-center gap-4">
                <div className="text-4xl">🏆</div>
                <div>
                  <h3 className="font-semibold">{ach.name}</h3>
                  <p className="text-sm text-slate-500">{ach.description || 'Achievement Yomu'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
