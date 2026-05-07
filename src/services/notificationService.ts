import { GAMIFICATION_URL } from '@/lib/constants';
import { createApiClient } from './apiClient';
import type { Notification } from '@/types/domain';

export interface NotificationResponse {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async getAll(userId: string, token: string): Promise<NotificationResponse[]> {
    const client = createApiClient(token);
    return client.get<NotificationResponse[]>(`${GAMIFICATION_URL}/api/notifications/${userId}`);
  },

  async getUnreadCount(userId: string, token: string): Promise<number> {
    const client = createApiClient(token);
    const response = await client.get<{ count: number }>(`${GAMIFICATION_URL}/api/notifications/${userId}/unread-count`);
    return response.count;
  },

  async markAsRead(notificationId: string, token: string): Promise<void> {
    const client = createApiClient(token);
    return client.put<void>(`${GAMIFICATION_URL}/api/notifications/read/${notificationId}`);
  },
};