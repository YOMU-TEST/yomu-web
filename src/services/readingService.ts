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
    return client.get<Reading[]>(`${API_URL}/api/readings`);
  },

  async getById(id: string, token: string): Promise<Reading> {
    const client = createApiClient(token);
    return client.get<Reading>(`${API_URL}/api/readings/${id}`);
  },

  async getQuestions(readingId: string, token: string): Promise<Question[]> {
    const client = createApiClient(token);
    return client.get<Question[]>(`${API_URL}/api/readings/${readingId}/questions`);
  },

  async submitQuiz(submission: QuizSubmission, token: string): Promise<QuizResult> {
    const client = createApiClient(token);
    return client.post<QuizResult>(`${API_URL}/api/readings/${submission.readingId}/submit`, submission);
  },

  async checkCompletionStatus(readingId: string, token: string): Promise<boolean> {
    const client = createApiClient(token);
    return client.get<boolean>(`${API_URL}/api/readings/${readingId}/status`);
  },

  async markComplete(readingId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`${API_URL}/api/readings/${readingId}/complete`);
  },

  async create(token: string, data: { title: string; content: string; categoryName: string }): Promise<Reading> {
    const client = createApiClient(token);
    return client.post<Reading>(`${API_URL}/api/readings`, data);
  },

  async delete(id: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`${API_URL}/api/readings/${id}`);
  },
};