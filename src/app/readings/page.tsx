'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Reading {
  id: string;
  title: string;
  category: { name: string } | null;
  createdAt: string;
}

export default function ReadingsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchReadings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/readings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setReadings(data);
        }
      } catch (err) {
        console.error('Failed to fetch readings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [user, token, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">Yomu</h1>
          <nav className="flex items-center gap-4">
            <Link href="/readings" className="text-sm text-primary-600 font-medium">Bacaan</Link>
            <Link href="/achievements" className="text-sm text-slate-600">Achievements</Link>
            <Link href="/profile" className="text-sm text-slate-600">Profil</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Pilih Bacaan</h2>
        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : readings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Belum ada bacaan tersedia.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="p-6 bg-white rounded-xl border hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                      {reading.category?.name || 'Umum'}
                    </span>
                    <h3 className="text-lg font-semibold mt-2">{reading.title}</h3>
                  </div>
                  <button
                    onClick={() => router.push(`/readings/${reading.id}`)}
                    className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                  >
                    Baca
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
