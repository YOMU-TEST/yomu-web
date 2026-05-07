'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/FormField';
import { readingService } from '@/services/readingService';
import { useToast } from '@/hooks/useToast';
import type { Reading } from '@/types/domain';

export default function AdminReadingsPage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'News & Media' });

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchReadings();
  }, [user, token]);

  const fetchReadings = () => {
    readingService.getAll(token!).then(setReadings).catch(err => console.error('Failed:', err))
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await readingService.create(token!, { ...form, categoryName: form.category });
      setShowForm(false);
      setForm({ title: '', content: '', category: 'News & Media' });
      fetchReadings();
    } catch {
      toast.error('Gagal membuat bacaan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus bacaan ini?')) return;
    await readingService.delete(id, token!);
    fetchReadings();
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Kelola Bacaan</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Batal' : '+ Tambah Bacaan'}</Button>
      </div>

      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Judul" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <Input label="Kategori" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="News & Media, Olahraga, dll" />
            <Textarea label="Konten" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} required />
            <Button type="submit">Simpan</Button>
          </form>
        </Card>
      )}

      {loading ? <p className="text-slate-500">Memuat...</p> : readings.length === 0 ? (
        <p className="text-slate-500">Belum ada bacaan.</p>
      ) : (
        <div className="space-y-4">
          {readings.map(r => (
            <Card key={r.id}>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="default">{r.category?.name || 'Tanpa kategori'}</Badge>
                  <h3 className="font-semibold mt-1">
                    <Link href={`/admin/readings/${r.id}`} className="hover:underline">{r.title}</Link>
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{r.content}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => handleDelete(r.id)}>Hapus</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}