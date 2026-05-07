'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { missionService } from '@/services/missionService';
import { readingService } from '@/services/readingService';
import { clanService } from '@/services/clanService';
import { useToast } from '@/hooks/useToast';
import { HOME_REDIRECT, SUCCESS_MESSAGES } from '@/lib/constants';
import type { Season } from '@/types/domain';

interface DashboardStats {
  readings: number;
  missions: number;
  clans: number;
}

export default function AdminDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats>({ readings: 0, missions: 0, clans: 0 });
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.role !== 'admin') { router.push(HOME_REDIRECT); return; }

    Promise.all([
      readingService.getAll(token!).then(r => r.length),
      missionService.getAdminMissions(token!).then(m => m.length),
      clanService.getAll(token!).then(c => c.length),
      missionService.getActiveSeason(token!),
    ]).then(([readings, missions, clans, season]) => {
      setStats({ readings, missions, clans });
      setActiveSeason(season);
    }).catch(err => console.error('Failed to fetch stats:', err))
      .finally(() => setLoading(false));
  }, [user, isLoading, token, router]);

  const handleEndSeason = async () => {
    if (!activeSeason || isEnding) return;
    if (!confirm(`Akhiri season "${activeSeason.name}"? Clan akan dipromosi/demoti sesuai ranking.`)) return;

    setIsEnding(true);
    try {
      await missionService.endSeason(activeSeason.id, token!);
      toast.success(SUCCESS_MESSAGES.SEASON_ENDED);
      setActiveSeason(null);
    } catch (err) {
      toast.error('Gagal mengakhiri season');
    } finally {
      setIsEnding(false);
    }
  };

  if (isLoading || !user || user.role !== 'admin') return null;

  const cards = [
    { label: 'Bacaan', value: stats.readings, href: '/admin/readings', color: 'bg-blue-500' },
    { label: 'Misi Harian', value: stats.missions, href: '/admin/missions', color: 'bg-green-500' },
    { label: 'Clan', value: stats.clans, href: '/admin/clans', color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Admin</h2>

      {loading ? (
        <p className="text-slate-500">Memuat...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map(card => (
            <Link key={card.label} href={card.href}>
              <Card className="hover:border-slate-300 transition-colors">
                <div className={`inline-block px-3 py-1 rounded text-white text-sm mb-2 ${card.color}`}>
                  {card.label}
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {activeSeason && (
        <Card className="mt-8 bg-amber-50 border-amber-200">
          <h3 className="font-semibold mb-2">Season Aktif</h3>
          <p className="text-lg">{activeSeason.name}</p>
          <Button
            variant="danger"
            size="sm"
            className="mt-3"
            onClick={handleEndSeason}
            isLoading={isEnding}
          >
            {isEnding ? 'Mengakhiri...' : 'Akhiri Season'}
          </Button>
        </Card>
      )}

      <Card className="mt-8">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4 flex-wrap">
          <Link href="/admin/readings"><Button>+ Tambah Bacaan</Button></Link>
          <Link href="/admin/missions"><Button>+ Tambah Misi Harian</Button></Link>
        </div>
      </Card>
    </div>
  );
}