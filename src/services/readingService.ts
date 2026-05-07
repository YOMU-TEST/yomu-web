import { API_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { Reading, Question } from '@/types/domain';

export interface QuizSubmission {
  readingId: string;
  answers: number[];
}

export interface QuizResult {
  readingId: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
}

export const readingService = {
  async getAll(token: string): Promise<Reading[]> {
    const client = createApiClient(token);
    return client.get<Reading[]>('/api/readings', API_URL);
  },

  async getById(id: string, token: string): Promise<Reading> {
    const client = createApiClient(token);
    return client.get<Reading>(`/api/readings/${id}`, API_URL);
  },

  async getQuestions(readingId: string, token: string): Promise<Question[]> {
    const client = createApiClient(token);
    return client.get<Question[]>(`/api/readings/${readingId}/questions`, API_URL);
  },

  async submitQuiz(submission: QuizSubmission, token: string): Promise<QuizResult> {
    const client = createApiClient(token);
    return client.post<QuizResult>(`/api/readings/${submission.readingId}/submit`, submission, API_URL);
  },

  async checkCompletionStatus(readingId: string, token: string): Promise<boolean> {
    const client = createApiClient(token);
    return client.get<boolean>(`/api/readings/${readingId}/status`, API_URL);
  },

  async markComplete(readingId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`/api/readings/${readingId}/complete`, undefined, API_URL);
  },

  async create(token: string, data: { title: string; content: string; categoryName: string }): Promise<Reading> {
    const client = createApiClient(token);
    return client.post<Reading>('/api/readings', data, API_URL);
  },

  async delete(id: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`/api/readings/${id}`, API_URL);
  },
};