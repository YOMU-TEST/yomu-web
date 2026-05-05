'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateClanPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/clans?name=${encodeURIComponent(name)}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push('/clans');
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal membuat clan');
      }
    } catch {
      setError('Error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-6">Buat Clan Baru</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Clan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Buat Clan
          </button>
        </form>
      </div>
    </div>
  );
}