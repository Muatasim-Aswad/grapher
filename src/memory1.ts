import { clamp } from "./memory";

export const MIN_STREAK_THRESHOLD = 1; // minimum streak to start getting bonus
export const STREAK_BONUS_WEIGHT = 0.2;
export const MIN_STREAK_BONUS = 0;
export const MAX_STREAK_BONUS = 1;

/**
 * SB = tanh(k * (streak - threshold))
 * k = sensitivity (default 0.4)
 */
export function getStreakBonusSimple(params: {
  streak: number;
  threshold: number;
  sensitivity: number;
}): number {
  const { streak, threshold, sensitivity } = params;

  if (streak < threshold) return 0;

  const adjustedStreak = streak - threshold;
  const bonus = Math.tanh(sensitivity * adjustedStreak);

  return bonus;
}

/**
 * Version 2: Logarithmic streak bonus (slower growth, rewards long streaks more gradually)
 * SB = log(1 + streak - threshold) / log(1 + scale)
 * scale = determines how quickly bonus grows (default 20)
 */
export function getStreakBonusLogarithmic(params: {
  streak: number;
  threshold: number;
  scale: number;
}): number {
  const { streak, threshold, scale } = params;

  if (streak < threshold) return 0;

  const adjustedStreak = streak - threshold;
  const bonus = Math.log1p(adjustedStreak) / Math.log1p(scale);

  return clamp({ x: bonus, min: MIN_STREAK_BONUS, max: MAX_STREAK_BONUS });
}

export function getStreakBonusIntervalAdjusted(params: {
  streak: number;
  daysSinceLastReview: number;
  threshold: number;
  sensitivity: number;
  optimalInterval: number;
  intervalWeight: number;
}): number {
  const {
    streak,
    daysSinceLastReview,
    threshold,
    sensitivity,
    optimalInterval,
    intervalWeight,
  } = params;

  if (streak < threshold) return 0;

  const adjustedStreak = streak - threshold;
  const baseBonus = Math.tanh(sensitivity * adjustedStreak);

  // Interval multiplier: rewards intervals near or above optimal
  // daysSinceLastReview / optimalInterval gives ratio
  // Values > 1 mean longer than optimal (harder to maintain streak)
  // Values < 1 mean shorter than optimal (easier to maintain streak)
  const intervalRatio = daysSinceLastReview / optimalInterval;
  const intervalBonus = Math.tanh(intervalRatio - 1) * intervalWeight;
  const intervalMultiplier = 1 + intervalBonus;

  const bonus = baseBonus * intervalMultiplier;

  return clamp({ x: bonus, min: MIN_STREAK_BONUS, max: MAX_STREAK_BONUS });
}

/**
 * Collector function: Returns all streak bonus calculations
 * Returns an object with all five streak bonus variants
 */
export function getAllStreakBonuses(params: {
  streak: number;
  threshold: number;
  sensitivity: number;
  scale: number;
  daysSinceLastReview: number;
  optimalInterval: number;
  intervalWeight: number;
}) {
  return {
    simple: getStreakBonusSimple(params),
    logarithmic: getStreakBonusLogarithmic(params),
    // difficultyAdjusted: getStreakBonusDifficultyAdjusted(params),
    // strengthAdjusted: getStreakBonusStrengthAdjusted(params),
    timeAdjusted: getStreakBonusIntervalAdjusted(params),
    // combined: getStreakBonusCombined(params),
  };
}
