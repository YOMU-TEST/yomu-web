'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Question } from '@/types/domain';

interface QuizFlowProps {
  questions: Question[];
  answers: number[];
  onAnswer: (index: number, answer: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  hasUnanswered: boolean;
}

export function QuizFlow({
  questions,
  answers,
  onAnswer,
  onSubmit,
  onBack,
  isSubmitting,
  hasUnanswered,
}: QuizFlowProps) {
  return (
    <Card padding="lg">
      <h2 className="text-xl font-bold mb-6">Kuis</h2>
      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={q.id} className="border-b pb-4">
            <p className="font-medium mb-3">
              {qi + 1}. {q.questionText}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[qi] === oi ? 'border-primary-500 bg-primary-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => onAnswer(qi, oi)}
                    className="mr-3"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="ghost" onClick={onBack}>
          Kembali ke Teks
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || hasUnanswered}
          isLoading={isSubmitting}
        >
          Submit Kuis
        </Button>
      </div>
    </Card>
  );
}