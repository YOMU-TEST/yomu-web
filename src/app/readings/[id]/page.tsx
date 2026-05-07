'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Header';
import { LoadingState } from '@/components/ui/LoadingState';
import { readingService, QuizResult } from '@/services/readingService';
import { useToast } from '@/hooks/useToast';
import { ReadingView } from './components/ReadingView';
import { QuizFlow } from './components/QuizFlow';
import { QuizResultView } from './components/QuizResultView';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, AUTH_REDIRECT } from '@/lib/constants';
import type { Reading, Question } from '@/types/domain';

type Step = 'reading' | 'quiz' | 'result';

export default function ReadingDetailPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const readingId = params.id as string;
  const toast = useToast();

  const [reading, setReading] = useState<Reading | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [step, setStep] = useState<Step>('reading');
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push(AUTH_REDIRECT);
      return;
    }

    Promise.all([
      readingService.getById(readingId, token!),
      readingService.getQuestions(readingId, token!),
    ])
      .then(([readingData, questionsData]) => {
        setReading(readingData);
        setQuestions(questionsData);
        setAnswers(new Array(questionsData.length).fill(-1));
      })
      .catch(err => {
        console.error('Failed to fetch:', err);
        toast.error(ERROR_MESSAGES.FETCH_FAILED);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, token, isLoading, readingId, router, toast]);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await readingService.markComplete(readingId, token!);
      toast.success(SUCCESS_MESSAGES.READING_COMPLETED);
    } catch (err: unknown) {
      const status = (err as { status?: number }).status;
      if (status === 409) {
        toast.info(SUCCESS_MESSAGES.READING_ALREADY_COMPLETED);
      } else {
        toast.error(ERROR_MESSAGES.CONNECTION_ERROR);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleAnswer = (index: number, answer: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some(a => a === -1)) {
      toast.warning('Jawab semua pertanyaan terlebih dahulu');
      return;
    }

    setIsSubmitting(true);
    try {
      const quizResult = await readingService.submitQuiz({ readingId, answers }, token!);
      setResult(quizResult);
      setStep('result');
      toast.success(SUCCESS_MESSAGES.QUIZ_SUBMITTED);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('already')) {
        toast.error('Kuis sudah pernah disubmit');
      } else {
        toast.error(ERROR_MESSAGES.CONNECTION_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!reading) return <LoadingState message="Bacaan tidak ditemukan" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {step === 'reading' && (
          <ReadingView
            reading={reading}
            onComplete={handleComplete}
            onStartQuiz={() => setStep('quiz')}
            isCompleting={isCompleting}
          />
        )}

        {step === 'quiz' && (
          <QuizFlow
            questions={questions}
            answers={answers}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            onBack={() => setStep('reading')}
            isSubmitting={isSubmitting}
            hasUnanswered={answers.some(a => a === -1)}
          />
        )}

        {step === 'result' && result && (
          <QuizResultView
            result={result}
            onContinue={() => router.push('/readings')}
          />
        )}
      </main>
    </div>
  );
}