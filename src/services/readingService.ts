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

export interface QuestionRequest {
  readingId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
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

  // Admin question methods
  async getAdminQuestions(readingId: string, token: string): Promise<Question[]> {
    const client = createApiClient(token);
    return client.get<Question[]>(`/api/admin/questions/reading/${readingId}`, API_URL);
  },

  async createQuestion(token: string, data: QuestionRequest): Promise<Question> {
    const client = createApiClient(token);
    return client.post<Question>('/api/admin/questions', data, API_URL);
  },

  async updateQuestion(token: string, id: string, data: Omit<QuestionRequest, 'readingId'>): Promise<Question> {
    const client = createApiClient(token);
    return client.put<Question>(`/api/admin/questions/${id}`, data, API_URL);
  },

  async deleteQuestion(token: string, id: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`/api/admin/questions/${id}`, API_URL);
  },
};