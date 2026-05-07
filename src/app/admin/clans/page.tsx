'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { clanService } from '@/services/clanService';
import type { Clan } from '@/types/domain';

export default function AdminClansPage() {
  const { user, token } = useAuth();
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    clanService.getAll(token!).then(setClans).catch(err => console.error('Failed:', err))
      .finally(() => setLoading(false));
  }, [user, token]);

  const deleteClan = async (id: string) => {
    if (!confirm('Hapus clan ini?')) return;
    await clanService.delete(id, token!);
    clanService.getAll(token!).then(setClans);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kelola Clan</h2>
      {loading ? <p className="text-slate-500">Memuat...</p> : (
        <Card padding="none" className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Leader</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Skor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Anggota</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {clans.map(clan => (
                <tr key={clan.id}>
                  <td className="px-6 py-4 font-medium">{clan.name}</td>
                  <td className="px-6 py-4"><Badge variant="tier" tier={clan.tier} /></td>
                  <td className="px-6 py-4 text-sm">{clan.leaderName}</td>
                  <td className="px-6 py-4 text-right">{clan.totalScore.toFixed(0)}</td>
                  <td className="px-6 py-4 text-right">{clan.memberCount}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="danger" size="sm" onClick={() => deleteClan(clan.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}