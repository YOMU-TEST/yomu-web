import { Tier, TIERS, TIER_COLORS, TIER_THRESHOLDS } from '@/lib/constants';

export function getTierColor(tier: string): { bg: string; text: string } {
  const normalizedTier = tier.toLowerCase() as Tier;
  return TIER_COLORS[normalizedTier] ?? TIER_COLORS.bronze;
}

export function formatTierBadge(tier: string): string {
  return tier.toUpperCase();
}

export function getTierFromScore(score: number): Tier {
  if (score >= TIER_THRESHOLDS.diamond) return 'diamond';
  if (score >= TIER_THRESHOLDS.gold) return 'gold';
  if (score >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

export function getTierMultiplier(tier: string): number {
  switch (tier.toLowerCase()) {
    case 'diamond': return 1.5;
    case 'gold': return 1.2;
    case 'silver': return 1.1;
    default: return 1.0;
  }
}

export function sortByTier<T extends { tier: string }>(items: T[]): T[] {
  const tierOrder: Record<Tier, number> = {
    diamond: 4,
    gold: 3,
    silver: 2,
    bronze: 1,
  };
  return [...items].sort((a, b) => tierOrder[b.tier as Tier] - tierOrder[a.tier as Tier]);
}