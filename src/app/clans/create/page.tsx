'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/FormField';
import { clanService } from '@/services/clanService';
import { useToast } from '@/hooks/useToast';
import { HOME_REDIRECT, SUCCESS_MESSAGES } from '@/lib/constants';

export default function CreateClanPage() {
  const [name, setName] = useState('');
  const { user, token } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning('Nama clan tidak boleh kosong');
      return;
    }
    if (isCreating) return;

    setIsCreating(true);
    try {
      await clanService.create({ name }, token!);
      toast.success(SUCCESS_MESSAGES.CLAN_CREATED);
      router.push('/clans');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal membuat clan');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Buat Clan Baru</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Clan"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Masukkan nama clan"
            required
          />
          <Button type="submit" className="w-full" isLoading={isCreating}>
            {isCreating ? 'Membuat...' : 'Buat Clan'}
          </Button>
        </form>
      </Card>
    </div>
  );
}