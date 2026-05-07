import { API_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { Clan, LeaderboardEntry } from '@/types/domain';

export interface CreateClanData {
  name: string;
}

export const clanService = {
  async getAll(token: string): Promise<Clan[]> {
    const client = createApiClient(token);
    return client.get<Clan[]>('/api/clans', API_URL);
  },

  async getById(id: string, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.get<Clan>(`/api/clans/${id}`, API_URL);
  },

  async getMyClan(token: string): Promise<Clan | null> {
    const client = createApiClient(token);
    try {
      return await client.get<Clan>('/api/clans/me', API_URL);
    } catch {
      return null;
    }
  },

  async getLeaderboard(token: string): Promise<LeaderboardEntry[]> {
    const client = createApiClient(token);
    return client.get<LeaderboardEntry[]>('/api/clans/leaderboard', API_URL);
  },

  async create(data: CreateClanData, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.post<Clan>(`/api/clans?name=${encodeURIComponent(data.name)}`, undefined, API_URL);
  },

  async join(clanId: string, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.post<Clan>(`/api/clans/${clanId}/join`, undefined, API_URL);
  },

  async leave(clanId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`/api/clans/${clanId}/leave`, undefined, API_URL);
  },

  async delete(clanId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`/api/clans/${clanId}`, API_URL);
  },
};