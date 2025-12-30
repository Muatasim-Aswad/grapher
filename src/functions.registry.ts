import {
  makeFunction,
  type FunctionParameter,
  type MathFunction,
} from "./functions";

export type { FunctionParameter, MathFunction };
import {
  getSpeedScore,
  getAnswerQuality,
  getStrength,
  getDifficulty,
  getNewStrengthAndDifficulty,
  getForgetProbability,
  getForgettabilityTest,
  CHAR_REACTION_TIME,
  BASE_COGNITIVE_REACTION_TIME,
  EXPECTED_SPEED_MULTIPLIER,
  MS_IN_DAY,
  MIN_STRENGTH,
  DEFAULT_DIFFICULTY,
  MIN_DIFFICULTY,
  DIFFICULTY_CORRECTION_WEIGHT,
  ANSWER_SPEED_WEIGHT,
  AnswerScore,
  MIN_SPEED_SCORE,
  MAX_SPEED_SCORE,
  MAX_DIFFICULTY,
  MIN_ANSWER_QUALITY,
  MAX_ANSWER_QUALITY,
} from "./memory";
import { getAllStreakBonuses, MIN_STREAK_THRESHOLD } from "./memory1.ts";

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
    defaultMax: 10,
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
  forgettability: {
    defaultValue: 0.5,
    defaultMin: 0,
    defaultMax: 1,
  },
  strengthModifier: {
    defaultValue: 1.1,
    defaultMin: 0.5,
    defaultMax: 3,
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
  difficultyWeight: {
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
  sensitivity: {
    defaultValue: 0.5,
    defaultMin: 0.1,
    defaultMax: 2,
  },
  scale: {
    defaultValue: 20,
    defaultMin: 1,
    defaultMax: 100,
  },
  strengthCap: {
    defaultValue: 30,
    defaultMin: 10,
    defaultMax: 100,
  },
  optimalInterval: {
    defaultValue: 100,
    defaultMin: 10,
    defaultMax: 365,
  },
  intervalWeight: {
    defaultValue: 1,
    defaultMin: 0,
    defaultMax: 2,
  },
};

export const availableFunctions: MathFunction[] = [
  makeFunction({
    name: "Speed Score", // SS = (k*ET/AT) - 1
    paramKeys: [
      "itemLength",
      "answerTime",
      "reactionTime",
      "charTime",
      "expectedSpeedMultiplier",
    ],
    fn: getSpeedScore,
    defaultVariableKey: "answerTime",
  }),
  makeFunction({
    name: "Answer Quality", // AQ = AS + (sw * SS)
    paramKeys: ["answerScore", "speedScore", "speedWeight"],
    fn: getAnswerQuality,
    defaultVariableKey: "speedScore",
  }),
  makeFunction({
    name: "Forgettability", // F = 1 - e^(-(T*D/S))
    paramKeys: ["strength", "difficulty", "timeSinceLastReview"],
    fn: (params: {
      strength: number;
      difficulty: number;
      timeSinceLastReview: number;
    }) =>
      getForgetProbability({
        ...params,
        daysSinceLastReview: params.timeSinceLastReview,
      }),
    defaultVariableKey: "timeSinceLastReview",
  }),
  makeFunction({
    name: "Forgettability Test",
    paramKeys: ["strength", "difficulty", "daysSinceLastReview"],
    fn: getForgettabilityTest,
    defaultVariableKey: "daysSinceLastReview",
  }),
  makeFunction({
    name: "Strength", // S = OS * SM
    paramKeys: [
      "answerQuality",
      "currentStrength",
      "currentDifficulty",
      "daysSinceLastReview",
    ],
    fn: getStrength,
    defaultVariableKey: "answerQuality",
  }),
  makeFunction({
    name: "Difficulty", // ND = OD - cw * (AQ - 1)
    paramKeys: ["currentDifficulty", "answerQuality", "correctionWeight"],
    fn: getDifficulty,
    defaultVariableKey: "answerQuality",
  }),
  makeFunction({
    name: "New Strength & Difficulty",
    paramKeys: [
      "answerScore",
      "answerTime",
      "itemLength",
      "currentStrength",
      "daysSinceLastReview",
      "currentDifficulty",
      "reactionTime",
      "charTime",
      "speedWeight",
      "correctionWeight",
      "expectedSpeedMultiplier",
    ],
    fn: getNewStrengthAndDifficulty,
    defaultVariableKey: "answerScore",
  }),
  makeFunction({
    name: "All Streak Bonuses",
    paramKeys: [
      "streak",
      "threshold",
      "sensitivity",
      "scale",
      "daysSinceLastReview",
      "optimalInterval",
      "intervalWeight",
    ],
    fn: getAllStreakBonuses,
    defaultVariableKey: "streak",
  }),
];
