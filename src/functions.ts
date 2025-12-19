import {
  getSpeedScore,
  getAnswerQuality,
  getUrgency,
  getStrengthModifier,
  getStrength,
  getDifficulty,
  getNewStrengthAndDifficulty,
  getPriority,
} from "./memory";

export type FunctionParameter = {
  name: string;
  defaultValue: number;
  defaultMin: number;
  defaultMax: number;
};

export type FunctionOutput = number | { y1: number; y2: number };

export type MathFunction = {
  id: string;
  name: string;
  parameters: FunctionParameter[];
  fn: (params: Record<string, number>) => FunctionOutput;
  outputLabels?: { y1?: string; y2?: string };
  defaultVariable?: string;
};

// Speed Score: SS = (ET/AT) - 1
const speedScoreFunction: MathFunction = {
  id: "speedScore",
  name: "Speed Score",
  parameters: [
    { name: "itemLength", defaultValue: 10, defaultMin: 1, defaultMax: 100 },
    {
      name: "answerTime",
      defaultValue: 1000,
      defaultMin: 0,
      defaultMax: 5000,
    },
    {
      name: "reactionTime",
      defaultValue: 250,
      defaultMin: 100,
      defaultMax: 1000,
    },
    { name: "charTime", defaultValue: 20, defaultMin: 5, defaultMax: 100 },
  ],
  fn: ({ itemLength, answerTime, reactionTime, charTime }) =>
    getSpeedScore(itemLength, answerTime, reactionTime, charTime),
  defaultVariable: "answerTime",
};

// Answer Quality: AQ = AS + (sw * SS)
const answerQualityFunction: MathFunction = {
  id: "answerQuality",
  name: "Answer Quality",
  parameters: [
    { name: "answerScore", defaultValue: 1, defaultMin: 0, defaultMax: 1 },
    { name: "speedScore", defaultValue: 1, defaultMin: -1, defaultMax: 3 },
    { name: "speedWeight", defaultValue: 0.3, defaultMin: 0, defaultMax: 1 },
  ],
  fn: ({ answerScore, speedScore, speedWeight }) =>
    getAnswerQuality(answerScore, speedScore, speedWeight),
  defaultVariable: "speedScore",
};

// Urgency: U = T / S
const urgencyFunction: MathFunction = {
  id: "urgency",
  name: "Urgency",
  parameters: [
    {
      name: "timeSinceLastReview",
      defaultValue: 86400,
      defaultMin: 0,
      defaultMax: 864000,
    },
    {
      name: "strength",
      defaultValue: 10,
      defaultMin: 0,
      defaultMax: 1000000,
    },
  ],
  fn: ({ timeSinceLastReview, strength }) =>
    getUrgency(timeSinceLastReview, strength),
  defaultVariable: "timeSinceLastReview",
};

// Strength Modifier: SM = 1 + D * AQ * U
const strengthModifierFunction: MathFunction = {
  id: "strengthModifier",
  name: "Strength Modifier",
  parameters: [
    { name: "difficulty", defaultValue: 0.5, defaultMin: 0, defaultMax: 1 },
    { name: "answerQuality", defaultValue: 0.8, defaultMin: 0, defaultMax: 2 },
    { name: "urgency", defaultValue: 1, defaultMin: 0, defaultMax: 10 },
  ],
  fn: ({ difficulty, answerQuality, urgency }) =>
    getStrengthModifier(difficulty, answerQuality, urgency),
  defaultVariable: "answerQuality",
};

// New Strength: NS = OS * SM
const strengthFunction: MathFunction = {
  id: "strength",
  name: "Strength",
  parameters: [
    {
      name: "oldStrength",
      defaultValue: 100000,
      defaultMin: 1000,
      defaultMax: 1000000,
    },
    {
      name: "stabilityModifier",
      defaultValue: 1.1,
      defaultMin: 0.5,
      defaultMax: 3,
    },
  ],
  fn: ({ oldStrength, stabilityModifier }) =>
    getStrength(oldStrength, stabilityModifier),
  defaultVariable: "stabilityModifier",
};

// New Difficulty: ND = OD - cw * (AQ - 1)
const difficultyFunction: MathFunction = {
  id: "difficulty",
  name: "Difficulty",
  parameters: [
    { name: "oldDifficulty", defaultValue: 0.5, defaultMin: 0, defaultMax: 1 },
    { name: "answerQuality", defaultValue: 0.8, defaultMin: 0, defaultMax: 2 },
    {
      name: "correctionWeight",
      defaultValue: 0.1,
      defaultMin: 0,
      defaultMax: 0.5,
    },
  ],
  fn: ({ oldDifficulty, answerQuality, correctionWeight }) =>
    getDifficulty(oldDifficulty, answerQuality, correctionWeight),
  defaultVariable: "answerQuality",
};

// Priority: P = 1 - e^(-T/S)
const priorityFunction: MathFunction = {
  id: "priority",
  name: "Priority",
  parameters: [
    {
      name: "strength",
      defaultValue: 100000,
      defaultMin: 1000,
      defaultMax: 1000000,
    },
    {
      name: "timeSinceLastReview",
      defaultValue: 86400,
      defaultMin: 0,
      defaultMax: 864000,
    },
  ],
  fn: ({ strength, timeSinceLastReview }) =>
    getPriority(strength, timeSinceLastReview),
  defaultVariable: "timeSinceLastReview",
};

// Dual output: New Strength and Difficulty
const strengthAndDifficultyFunction: MathFunction = {
  id: "strengthAndDifficulty",
  name: "New Strength & Difficulty",
  parameters: [
    { name: "answerScore", defaultValue: 1, defaultMin: 0, defaultMax: 1 },
    {
      name: "answerTime",
      defaultValue: 1000,
      defaultMin: 0,
      defaultMax: 10000,
    },
    { name: "itemLength", defaultValue: 10, defaultMin: 1, defaultMax: 100 },
    {
      name: "strength",
      defaultValue: 1000000,
      defaultMin: 1,
      defaultMax: 1000000000,
    },
    {
      name: "timeSinceLastReview",
      defaultValue: 10 * 24 * 60 * 60 * 1000,
      defaultMin: 0,
      defaultMax: 360 * 24 * 60 * 60 * 1000,
    },
    { name: "difficulty", defaultValue: 1, defaultMin: 0, defaultMax: 10 },
    {
      name: "reactionTime",
      defaultValue: 250,
      defaultMin: 100,
      defaultMax: 1000,
    },
    { name: "charTime", defaultValue: 20, defaultMin: 5, defaultMax: 100 },
    { name: "speedWeight", defaultValue: 0.3, defaultMin: 0, defaultMax: 1 },
    {
      name: "difficultyWeight",
      defaultValue: 0.1,
      defaultMin: 0,
      defaultMax: 0.5,
    },
  ],
  fn: ({
    answerScore,
    answerTime,
    itemLength,
    strength,
    timeSinceLastReview,
    difficulty,
    reactionTime,
    charTime,
    speedWeight,
    difficultyWeight,
  }) => {
    const result = getNewStrengthAndDifficulty(
      answerScore,
      answerTime,
      itemLength,
      strength,
      timeSinceLastReview,
      difficulty,
      reactionTime,
      charTime,
      speedWeight,
      difficultyWeight,
    );
    return { y1: result.newStrength, y2: result.newDifficulty };
  },
  outputLabels: { y1: "New Strength", y2: "New Difficulty" },
  defaultVariable: "answerScore",
};

export const availableFunctions: MathFunction[] = [
  speedScoreFunction,
  answerQualityFunction,
  urgencyFunction,
  strengthModifierFunction,
  strengthFunction,
  difficultyFunction,
  priorityFunction,
  strengthAndDifficultyFunction,
];
