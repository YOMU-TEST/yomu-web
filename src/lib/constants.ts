export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:10000';
export const GAMIFICATION_URL = process.env.NEXT_PUBLIC_GAMIFICATION_URL || 'http://localhost:8081';
export const POLLING_INTERVAL = 30000;
export const TOAST_DURATION = 4000;
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 128;

export const TIERS = ['bronze', 'silver', 'gold', 'diamond'] as const;
export type Tier = typeof TIERS[number];

export const TIER_THRESHOLDS: Record<Tier, number> = {
  bronze: 0,
  silver: 500,
  gold: 1000,
  diamond: 2000,
};

export const TIER_COLORS: Record<Tier, { bg: string; text: string }> = {
  diamond: { bg: 'bg-purple-100', text: 'text-purple-700' },
  gold: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  silver: { bg: 'bg-gray-100', text: 'text-gray-700' },
  bronze: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  READINGS: '/readings',
  PROFILE: '/profile',
  CLANS: '/clans',
  CLANS_CREATE: '/clans/create',
  LEADERBOARD: '/leaderboard',
  ACHIEVEMENTS: '/achievements',
  MISSIONS: '/missions',
  ADMIN: '/admin',
  ADMIN_READINGS: '/admin/readings',
  ADMIN_MISSIONS: '/admin/missions',
  ADMIN_CLANS: '/admin/clans',
} as const;

export const ADMIN_ROUTES = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/readings', label: 'Bacaan' },
  { href: '/admin/missions', label: 'Misi Harian' },
  { href: '/admin/clans', label: 'Clan' },
] as const;

export const AUTH_REDIRECT = '/login';
export const HOME_REDIRECT = '/readings';

export const ERROR_MESSAGES = {
  SESSION_EXPIRED: 'Session expired, silakan login ulang',
  CONNECTION_ERROR: 'Error koneksi',
  FETCH_FAILED: 'Gagal memuat data',
} as const;

export const SUCCESS_MESSAGES = {
  CLAN_CREATED: 'Clan berhasil dibuat!',
  CLAN_JOINED: 'Berhasil bergabung dengan clan!',
  CLAN_LEFT: 'Berhasil keluar dari clan',
  CLAN_DELETED: 'Clan berhasil dihapus',
  READING_COMPLETED: 'Bacaan ditandai selesai!',
  READING_ALREADY_COMPLETED: 'Bacaan sudah pernah ditandai selesai',
  QUIZ_SUBMITTED: 'Kuis berhasil disubmit!',
  REWARD_CLAIMED: 'Reward berhasil diklaim! +XP',
  PROFILE_UPDATED: 'Profile updated successfully',
  SEASON_ENDED: 'Season berhasil diakhiri!',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  NOTIFICATION_LIMIT: 50,
} as const;

export const DATE_FORMAT = {
  LOCALE: 'id-ID',
  FULL: { weekday: 'long', day: 'numeric', month: 'long' } as const,
} as const;