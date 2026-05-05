'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchStats = async () => {
      try {
        const [readingsRes, missionsRes, clansRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readings`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/missions`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clans`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setStats({
          readings: readingsRes.ok ? (await readingsRes.json()).length : 0,
          missions: missionsRes.ok ? (await missionsRes.json()).length : 0,
          clans: clansRes.ok ? (await clansRes.json()).length : 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, token]);

  if (!user || user.role !== 'admin') return null;

  const cards = [
    { label: 'Bacaan', value: stats.readings || 0, href: '/admin/readings', color: 'bg-blue-500' },
    { label: 'Misi Harian', value: stats.missions || 0, href: '/admin/missions', color: 'bg-green-500' },
    { label: 'Clan', value: stats.clans || 0, href: '/admin/clans', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>
      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="block p-6 bg-white rounded-xl border hover:border-slate-300 transition-colors"
            >
              <div className={`inline-block px-3 py-1 rounded text-white text-sm mb-2 ${card.color}`}>
                {card.label}
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 p-6 bg-white rounded-xl border">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <a href="/admin/readings" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            + Tambah Bacaan
          </a>
          <a href="/admin/missions" className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            + Tambah Misi Harian
          </a>
        </div>
      </div>
    </div>
  );
}