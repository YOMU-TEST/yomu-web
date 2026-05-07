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
    return client.get<Mission[]>(`${GAMIFICATION_URL}/api/missions/${userId}`);
  },

  async claim(missionId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`${API_URL}/api/missions/${missionId}/claim`);
  },

  async getAdminMissions(token: string): Promise<Mission[]> {
    const client = createApiClient(token);
    return client.get<Mission[]>(`${API_URL}/api/admin/missions`);
  },

  async create(data: CreateMissionData, token: string): Promise<Mission> {
    const client = createApiClient(token);
    return client.post<Mission>(`${API_URL}/api/admin/missions`, data);
  },

  async toggle(id: string, active: boolean, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.patch<void>(`${API_URL}/api/admin/missions/${id}/toggle?active=${!active}`);
  },

  async delete(id: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.delete<void>(`${API_URL}/api/admin/missions/${id}`);
  },

  async getActiveSeason(token: string): Promise<Season | null> {
    const client = createApiClient(token);
    try {
      return await client.get<Season>(`${API_URL}/api/admin/seasons/active`);
    } catch {
      return null;
    }
  },

  async endSeason(seasonId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.post<void>(`${API_URL}/api/admin/seasons/${seasonId}/end`);
  },
};