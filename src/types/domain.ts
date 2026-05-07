export interface User {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

export interface Clan {
  id: string;
  name: string;
  tier: string;
  total_score: number;
  leader_id: string;
  leader_name: string;
  member_count: number;
}

export interface ClanMember {
  id: string;
  clanId: string;
  userId: string;
  role: string;
}

export interface Reading {
  id: string;
  title: string;
  content: string;
  category: Category | null;
  createdAt: string;
}

export interface Category {
  id?: number;
  name: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  readingId: string;
  answers: number[];
  score: number;
  accuracy: number;
  startedAt: string;
  completedAt: string;
}

export interface CompletedReading {
  id: string;
  userId: string;
  readingId: string;
  score: number;
  accuracy: number;
  completedAt: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target_type: string;
  target_count: number;
  xp_reward: number;
  progress: number | null;
  claimed: boolean | null;
  date: string | null;
  is_active?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  milestone: number;
  iconUrl: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
  visible: boolean;
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  clan_id: string;
  clan_name: string;
  tier: string;
  total_score: number;
  member_count: number;
}