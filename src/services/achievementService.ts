import { API_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  milestone: number;
  iconUrl: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
  visible: boolean;
}

export const achievementService = {
  async getForUser(userId: string, token: string): Promise<AchievementResponse[]> {
    const client = createApiClient(token);
    return client.get<AchievementResponse[]>(`/api/achievements/${userId}`, API_URL);
  },
};