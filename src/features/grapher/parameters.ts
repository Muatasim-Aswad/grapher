import {
  CHAR_REACTION_TIME,
  BASE_COGNITIVE_REACTION_TIME,
  EXPECTED_SPEED_MULTIPLIER,
  MS_IN_DAY,
  MIN_STRENGTH,
  DEFAULT_DIFFICULTY,
  MIN_DIFFICULTY,
  DIFFICULTY_CORRECTION_WEIGHT,
  ANSWER_SPEED_WEIGHT,
  STREAK_BONUS_WEIGHT,
  AnswerScore,
  MIN_SPEED_SCORE,
  MAX_SPEED_SCORE,
  MAX_DIFFICULTY,
  MIN_ANSWER_QUALITY,
  MAX_ANSWER_QUALITY,
  MIN_STREAK_THRESHOLD,
} from '../memory';

export const argsRegistry = {
  itemLength: {
    defaultValue: 10,
    defaultMin: 1,
    defaultMax: 100,
  },
  answerTime: {
    defaultValue:
      ((10 * CHAR_REACTION_TIME + BASE_COGNITIVE_REACTION_TIME) *
        EXPECTED_SPEED_MULTIPLIER) /
      2,
    defaultMin: 0,
    defaultMax:
      (10 * CHAR_REACTION_TIME + BASE_COGNITIVE_REACTION_TIME) *
      (EXPECTED_SPEED_MULTIPLIER + 3),
  },
  reactionTime: {
    defaultValue: BASE_COGNITIVE_REACTION_TIME,
    defaultMin: 100,
    defaultMax: 1000,
  },
  charTime: {
    defaultValue: CHAR_REACTION_TIME,
    defaultMin: 5,
    defaultMax: 100,
  },
  expectedSpeedMultiplier: {
    defaultValue: EXPECTED_SPEED_MULTIPLIER,
    defaultMin: 1,
    defaultMax: EXPECTED_SPEED_MULTIPLIER + 5,
  },
  answerScore: {
    defaultValue: AnswerScore.KNOW,
    defaultMin: AnswerScore.NO,
    defaultMax: AnswerScore.VERY_KNOW,
  },
  speedScore: {
    defaultValue: 1,
    defaultMin: MIN_SPEED_SCORE,
    defaultMax: MAX_SPEED_SCORE,
  },
  bonus: {
    defaultValue: 0,
    defaultMin: 0,
    defaultMax: 1,
  },
  bonusWeight: {
    defaultValue: STREAK_BONUS_WEIGHT,
    defaultMin: 0,
    defaultMax: 1,
  },
  timeSinceLastReview: {
    defaultValue: 3 * MS_IN_DAY,
    defaultMin: 0,
    defaultMax: 365 * MS_IN_DAY,
  },
  daysSinceLastReview: {
    defaultValue: 3,
    defaultMin: 0,
    defaultMax: 365,
  },
  strength: {
    defaultValue: 3,
    defaultMin: MIN_STRENGTH,
    defaultMax: 365,
  },
  currentStrength: {
    defaultValue: 3,
    defaultMin: MIN_STRENGTH,
    defaultMax: 365,
  },
  difficulty: {
    defaultValue: DEFAULT_DIFFICULTY,
    defaultMin: MIN_DIFFICULTY,
    defaultMax: MAX_DIFFICULTY,
  },
  currentDifficulty: {
    defaultValue: DEFAULT_DIFFICULTY,
    defaultMin: MIN_DIFFICULTY,
    defaultMax: MAX_DIFFICULTY,
  },
  answerQuality: {
    defaultValue: 1,
    defaultMin: MIN_ANSWER_QUALITY,
    defaultMax: MAX_ANSWER_QUALITY,
  },
  speedWeight: {
    defaultValue: ANSWER_SPEED_WEIGHT,
    defaultMin: 0,
    defaultMax: 1,
  },
  correctionWeight: {
    defaultValue: DIFFICULTY_CORRECTION_WEIGHT,
    defaultMin: 0,
    defaultMax: 1,
  },
  streak: {
    defaultValue: 5,
    defaultMin: 0,
    defaultMax: 15,
  },
  threshold: {
    defaultValue: MIN_STREAK_THRESHOLD,
    defaultMin: 0,
    defaultMax: 10,
  },
};
