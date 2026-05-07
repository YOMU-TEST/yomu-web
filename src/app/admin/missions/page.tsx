'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/FormField';
import { missionService } from '@/services/missionService';
import { useToast } from '@/hooks/useToast';
import type { Mission } from '@/types/domain';

export default function AdminMissionsPage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', targetType: 'reading', targetCount: 3, xpReward: 10 });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    missionService.getAdminMissions(token!).then(setMissions).catch(err => console.error('Failed:', err))
      .finally(() => setLoading(false));
  }, [user, token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await missionService.create(form, token!);
      setShowForm(false);
      setForm({ title: '', description: '', targetType: 'reading', targetCount: 3, xpReward: 10 });
      missionService.getAdminMissions(token!).then(setMissions);
    } catch { toast.error('Error'); }
  };

  const toggleMission = async (id: string, active: boolean) => {
    await missionService.toggle(id, active, token!);
    missionService.getAdminMissions(token!).then(setMissions);
  };

  const deleteMission = async (id: string) => {
    if (!confirm('Hapus misi ini?')) return;
    await missionService.delete(id, token!);
    missionService.getAdminMissions(token!).then(setMissions);
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kelola Misi Harian</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Batal' : '+ Tambah Misi'}</Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Input label="Judul Misi" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Membaca Berita" required />
              <Select label="Target Type" value={form.targetType} onChange={e => setForm({ ...form, targetType: e.target.value })} options={[
                { value: 'reading', label: 'Reading' },
                { value: 'quiz', label: 'Quiz' },
              ]} />
              <Input label="Target Count" type="number" value={form.targetCount} onChange={e => setForm({ ...form, targetCount: parseInt(e.target.value) })} min={1} />
            </div>
            <Input label="Deskripsi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <Button type="submit">Simpan</Button>
          </form>
        </Card>
      )}

      {loading ? <p className="text-slate-500">Memuat...</p> : (
        <div className="space-y-4">
          {missions.map(m => (
            <Card key={m.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{m.title}</h3>
                    <Badge variant="status" status={m.isActive ? 'active' : 'inactive'}>
                      {m.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{m.description}</p>
                  <p className="text-xs text-slate-400 mt-1">Target: {m.targetType} × {m.targetCount} | XP: {m.xpReward}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleMission(m.id, m.isActive!)}>{m.isActive ? 'Nonaktifkan' : 'Aktifkan'}</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteMission(m.id)}>Hapus</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}