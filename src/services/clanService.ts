import { API_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { Clan, LeaderboardEntry } from '@/types/domain';

export interface CreateClanData {
  name: string;
}

export const clanService = {
  async getAll(token: string): Promise<Clan[]> {
    const client = createApiClient(token);
    return client.get<Clan[]>(`${API_URL}/api/clans`);
  },

  async getById(id: string, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.get<Clan>(`${API_URL}/api/clans/${id}`);
  },

  async getMyClan(token: string): Promise<Clan | null> {
    const client = createApiClient(token);
    try {
      return await client.get<Clan>(`${API_URL}/api/clans/me`);
    } catch {
      return null;
    }
  },

  async getLeaderboard(token: string): Promise<LeaderboardEntry[]> {
    const client = createApiClient(token);
    return client.get<LeaderboardEntry[]>(`${API_URL}/api/clans/leaderboard`);
  },

  async create(data: CreateClanData, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.post<Clan>(`${API_URL}/api/clans?name=${encodeURIComponent(data.name)}`);
  },

  async join(clanId: string, token: string): Promise<Clan> {
    const client = createApiClient(token);
    return client.post<Clan>(`${API_URL}/api/clans/${clanId}/join`);
  },

  async leave(clanId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`${API_URL}/api/clans/${clanId}/leave`);
  },

  async delete(clanId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`${API_URL}/api/clans/${clanId}`);
  },
};