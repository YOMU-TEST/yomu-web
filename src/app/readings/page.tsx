'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/ui/LoadingState';
import { readingService } from '@/services/readingService';
import { AUTH_REDIRECT } from '@/lib/constants';
import type { Reading } from '@/types/domain';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID');
}

export default function ReadingsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push(AUTH_REDIRECT);
      return;
    }

    readingService.getAll(token!).then(data => {
      setReadings(data);
    }).catch(err => {
      console.error('Failed to fetch readings:', err);
    }).finally(() => {
      setLoading(false);
    });
  }, [user, token, isLoading, router]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Pilih Bacaan</h2>
        </div>

        {loading ? (
          <p className="text-slate-500">Memuat...</p>
        ) : readings.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500">Belum ada bacaan.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {readings.map((reading) => (
              <Link key={reading.id} href={`/readings/${reading.id}`}>
                <Card className="hover:border-primary-500 transition-colors cursor-pointer">
                  <Badge variant="default" className="mb-2">
                    {reading.category?.name || 'Umum'}
                  </Badge>
                  <h3 className="text-lg font-semibold">{reading.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(reading.createdAt)}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}