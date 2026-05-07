import { API_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { User } from '@/types/domain';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
  displayName: string;
  role: string;
}

export interface UserProfileResponse {
  user: { id: string; username: string; displayName: string; role: string };
  stats: { readingsCompleted: number; quizzesTaken: number; averageAccuracy: number };
  achievements: Array<{ id: string; name: string; unlockedAt: string }>;
  clan: { id: string; name: string; tier: string; role: string } | null;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const client = createApiClient(null);
    return client.post<AuthResponse>('/api/auth/login', credentials, API_URL);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const client = createApiClient(null);
    return client.post<AuthResponse>('/api/auth/register', data, API_URL);
  },

  async getProfile(userId: string, token: string): Promise<UserProfileResponse> {
    const client = createApiClient(token);
    return client.get<UserProfileResponse>(`/api/users/${userId}/profile`, API_URL);
  },

  async updateProfile(
    userId: string,
    token: string,
    data: { displayName?: string; password?: string; updatePassword?: boolean }
  ): Promise<User> {
    const client = createApiClient(token);
    return client.put<User>(`/api/users/${userId}`, data, API_URL);
  },
};