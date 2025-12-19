// Time in milliseconds
export const BASE_COGNITIVE_REACTION_TIME = 250; // base time for action: click, read, understand
export const CHAR_REACTION_TIME = 20; // additional time per character in the item

export const ANSWER_SPEED_WEIGHT = 0.3;

export const DIFFICULTY_CORRECTION_WEIGHT = 0.1;

/**
 * SS = (3ET/AT) - 1
 * ET = r + (c x L)
 * where
 * SS = Speed Score
 * ET = Expected Time
 * AT = Actual Time (time taken by user to answer)
 * 3 = Scaling Factor (more rewards, less punishing)
 * r = Base Cognitive Reaction Time
 * L = Length of the item (e.g., number of characters)
 * c = Character Time
 */
export function getSpeedScore(
  itemLength: number,
  answerTime: number,
  REACTION_TIME: number,
  CHAR_TIME: number,
): number {
  // This prevents unrealistic high speeds (probably accidental clicks)
  if (answerTime < REACTION_TIME) return 0;

  const expectedTime = REACTION_TIME + CHAR_TIME * itemLength;

  // This prevents unrealistic low speeds (probably distractions)
  if (answerTime > expectedTime * 10) return 0;

  const speedRatio = (3 * expectedTime) / answerTime;
  const speedScore = speedRatio - 1;

  return speedScore;
}

/**
 * AQ = AS + (sw * SS)
 * where
 * AQ = Answer Quality
 * AS = Answer Score (0 to 1: 0 = failure , 1 = perfect, other values: 0.5, 0.2)
 * SS = Speed Score
 * sw = Speed Weight
 */
export function getAnswerQuality(
  answerScore: number, // 0 to 1: 0 = failure , 1 = perfect, other values: 0.5, 0.2
  speedScore: number,
  SPEED_WEIGHT: number,
): number {
  const answerQuality = answerScore + SPEED_WEIGHT * speedScore;
  return answerQuality;
}

/**
 * U = T / S
 * where
 * U = Urgency
 * T = Time since last review
 * S = Strength
 */
export function getUrgency(
  timeSinceLastReview: number,
  strength: number,
): number {
  return timeSinceLastReview / strength;
}

/**
 * SM = 1 + D * AQ * U
 * where
 * SM = Strength Modifier
 * D = Difficulty
 * AQ = Answer Quality
 * U = Urgency
 */
export function getStrengthModifier(
  difficulty: number,
  answerQuality: number,
  urgency: number,
): number {
  return 1 + difficulty * answerQuality * urgency;
}

/**
 * NS = OS * SM
 * where
 * NS = New Strength
 * OS = Old Strength
 * SM = Stability Modifier
 */
export function getStrength(
  oldStrength: number,
  stabilityModifier: number,
): number {
  const newStrength = oldStrength * stabilityModifier;

  if (newStrength <= 0) return 0.1; // minimum strength to avoid division by zero

  return newStrength;
}

/**
 * ND = OD - cw * (AQ - 1)
 * where
 * ND = New Difficulty
 * OD = Old Difficulty
 * cw = Correction Weight
 * AQ = Answer Quality
 */
export function getDifficulty(
  oldDifficulty: number,
  answerQuality: number,
  CORRECTION_WEIGHT: number,
): number {
  const newDifficulty = oldDifficulty - CORRECTION_WEIGHT * (answerQuality - 1);

  if (newDifficulty <= 0) return 0; // minimum difficulty to avoid negative values

  return newDifficulty;
}

export const getNewStrengthAndDifficulty = (
  answerScore: number,
  answerTime: number,
  itemLength: number,
  strength: number,
  timeSinceLastReview: number,
  difficulty: number,
  REACTION_TIME: number,
  CHAR_TIME: number,
  SPEED_WEIGHT: number,
  DIFFICULTY_CORRECTION_WEIGHT: number,
) => {
  const speedScore =
    answerScore === 1
      ? getSpeedScore(itemLength, answerTime, REACTION_TIME, CHAR_TIME)
      : 0;

  const answerQuality = getAnswerQuality(answerScore, speedScore, SPEED_WEIGHT);

  const newDifficulty = getDifficulty(
    difficulty,
    answerQuality,
    DIFFICULTY_CORRECTION_WEIGHT,
  );

  const urgency = getUrgency(timeSinceLastReview, strength);

  const strengthModifier = getStrengthModifier(
    difficulty,
    answerQuality,
    urgency,
  );

  const newStrength = getStrength(strength, strengthModifier);

  return { newStrength, newDifficulty };
};

export function getNewStrengthAndDifficultyWithDefaults(
  answerScore: number,
  answerTime: number,
  itemLength: number,
  strength: number,
  timeSinceLastReview: number,
  difficulty: number,
) {
  return getNewStrengthAndDifficulty(
    answerScore,
    answerTime,
    itemLength,
    strength,
    timeSinceLastReview,
    difficulty,
    BASE_COGNITIVE_REACTION_TIME,
    CHAR_REACTION_TIME,
    ANSWER_SPEED_WEIGHT,
    DIFFICULTY_CORRECTION_WEIGHT,
  );
}

/**
 * P = 1 - e^(-T/S)
 * where
 * P = Priority
 * T = Time since last review
 * S = Strength
 */
export const getPriority = (strength: number, timeSinceLastReview: number) => {
  const recallProbability = Math.exp(-timeSinceLastReview / strength);
  return 1 - recallProbability;
};

/**
 * Clamp value
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
