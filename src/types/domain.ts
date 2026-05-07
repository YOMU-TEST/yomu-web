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
  totalScore: number;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  myRole?: string;
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
  targetType: string;
  targetCount: number;
  xpReward: number;
  progress: number | null;
  claimed: boolean | null;
  date: string | null;
  isActive?: boolean;
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
  clanId: string;
  clanName: string;
  tier: string;
  totalScore: number;
  memberCount: number;
  multiplier: number;
  effectiveScore: number;
}