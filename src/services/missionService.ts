import { API_URL, GAMIFICATION_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { Mission, Season } from '@/types/domain';

export interface CreateMissionData {
  title: string;
  description: string;
  targetType: string;
  targetCount: number;
  xpReward: number;
}

export const missionService = {
  async getForUser(userId: string, token: string): Promise<Mission[]> {
    const client = createApiClient(token);
    return client.get<Mission[]>(`/api/missions/${userId}`, GAMIFICATION_URL);
  },

  async claim(missionId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`/api/missions/${missionId}/claim`, undefined, API_URL);
  },

  async getAdminMissions(token: string): Promise<Mission[]> {
    const client = createApiClient(token);
    return client.get<Mission[]>('/api/admin/missions', API_URL);
  },

  async create(data: CreateMissionData, token: string): Promise<Mission> {
    const client = createApiClient(token);
    return client.post<Mission>('/api/admin/missions', data, API_URL);
  },

  async toggle(id: string, active: boolean, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.patch<void>(`/api/admin/missions/${id}/toggle?active=${!active}`, undefined, API_URL);
  },

  async delete(id: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`/api/admin/missions/${id}`, API_URL);
  },

  async getActiveSeason(token: string): Promise<Season | null> {
    const client = createApiClient(token);
    try {
      return await client.get<Season>('/api/admin/seasons/active', API_URL);
    } catch {
      return null;
    }
  },

  async endSeason(seasonId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`/api/admin/seasons/${seasonId}/end`, undefined, API_URL);
  },
};