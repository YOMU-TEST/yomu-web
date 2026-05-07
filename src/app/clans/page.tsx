'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { Button } from '@/components/ui/Button';
import { clanService } from '@/services/clanService';
import { useToast } from '@/hooks/useToast';
import { AUTH_REDIRECT, SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';
import type { Clan } from '@/types/domain';

export default function ClansPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [clans, setClans] = useState<Clan[]>([]);
  const [myClanId, setMyClanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push(AUTH_REDIRECT); return; }

    Promise.all([
      clanService.getAll(token!),
      clanService.getMyClan(token!).catch(() => null),
    ]).then(([clansData, myClan]) => {
      setClans(clansData);
      setMyClanId(myClan?.id || null);
    }).catch(err => {
      console.error('Failed to fetch clans:', err);
      toast.error(ERROR_MESSAGES.FETCH_FAILED);
    }).finally(() => setLoading(false));
  }, [user, token, isLoading, router, toast]);

  const handleJoin = async (clanId: string) => {
    if (actionLoading) return;
    setActionLoading(clanId);
    try {
      await clanService.join(clanId, token!);
      toast.success(SUCCESS_MESSAGES.CLAN_JOINED);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal bergabung');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLeave = async (clanId: string) => {
    if (actionLoading || !confirm('Yakin ingin keluar dari clan ini?')) return;
    setActionLoading(clanId);
    try {
      await clanService.leave(clanId, token!);
      toast.success(SUCCESS_MESSAGES.CLAN_LEFT);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal keluar clan');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (clanId: string) => {
    if (actionLoading || !confirm('Yakin ingin menghapus clan ini?')) return;
    setActionLoading(clanId);
    try {
      await clanService.delete(clanId, token!);
      toast.success(SUCCESS_MESSAGES.CLAN_DELETED);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal menghapus clan');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pilih Clan</h2>
          <Link href="/clans/create">
            <Button>Buat Clan</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : clans.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">Belum ada clan. Buat clan pertama!</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clans.map(clan => (
              <Card key={clan.id} padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{clan.name}</h3>
                      <Badge variant="tier" tier={clan.tier} />
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      Leader: {clan.leader_name} • {clan.member_count} anggota
                    </p>
                    <p className="text-sm text-slate-500">Skor: {clan.total_score.toFixed(0)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {clan.leader_id === user.id ? (
                      <Button variant="danger" size="sm" onClick={() => handleDelete(clan.id)} disabled={!!actionLoading}>
                        Hapus
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => myClanId ? handleLeave(clan.id) : handleJoin(clan.id)}
                        disabled={!!actionLoading || (myClanId !== null && myClanId !== clan.id)}
                      >
                        {myClanId ? 'Sudah Gabung' : 'Gabung'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}