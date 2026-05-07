'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { QuizResult } from '@/services/readingService';

interface QuizResultViewProps {
  result: QuizResult;
  onContinue: () => void;
}

function getResultEmoji(accuracy: number): string {
  if (accuracy >= 0.8) return '🎉';
  if (accuracy >= 0.5) return '👍';
  return '📚';
}

export function QuizResultView({ result, onContinue }: QuizResultViewProps) {
  return (
    <Card padding="lg" className="text-center">
      <div className="text-6xl mb-4">
        {getResultEmoji(result.accuracy)}
      </div>
      <h2 className="text-2xl font-bold mb-2">Kuis Selesai!</h2>
      <p className="text-slate-600 mb-6">Skor kamu: {result.score}/100</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">{result.score}</div>
          <div className="text-sm text-slate-500">Skor</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">
            {result.correctAnswers}/{result.totalQuestions}
          </div>
          <div className="text-sm text-slate-500">Benar</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600">
            {(result.accuracy * 100).toFixed(0)}%
          </div>
          <div className="text-sm text-slate-500">Akurasi</div>
        </div>
      </div>

      <Button onClick={onContinue}>
        Pilih Bacaan Lain
      </Button>
    </Card>
  );
}