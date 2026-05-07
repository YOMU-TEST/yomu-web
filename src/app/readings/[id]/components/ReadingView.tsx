'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Reading } from '@/types/domain';

interface ReadingViewProps {
  reading: Reading;
  onComplete: () => void;
  onStartQuiz: () => void;
  isCompleting: boolean;
}

export function ReadingView({ reading, onComplete, onStartQuiz, isCompleting }: ReadingViewProps) {
  return (
    <Card padding="lg">
      <Badge variant="default" className="mb-4">
        {reading.category?.name || 'Umum'}
      </Badge>
      <h2 className="text-2xl font-bold mb-6">{reading.title}</h2>
      <div className="prose max-w-none">
        <p className="whitespace-pre-wrap">{reading.content}</p>
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <Button
          variant="secondary"
          onClick={onComplete}
          isLoading={isCompleting}
        >
          Selesai Baca
        </Button>
        <Button onClick={onStartQuiz}>
          Mulai Kuis
        </Button>
      </div>
    </Card>
  );
}