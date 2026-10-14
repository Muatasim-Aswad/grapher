import { makeFunction } from './functions';
import type { MathFunction } from './model';
import {
  getSpeedScore,
  getStreakBonus,
  getAnswerQuality,
  getStrength,
  getDifficulty,
  getNewState,
  getForgetProbability,
  getForgettabilityTest,
  MS_IN_DAY,
} from '../memory';

export const availableFunctions: readonly [MathFunction, ...MathFunction[]] = [
  makeFunction({
    id: 'speedScore',
    paramKeys: [
      'itemLength',
      'answerTime',
      'reactionTime',
      'charTime',
      'expectedSpeedMultiplier',
    ],
    fn: getSpeedScore,
    defaultVariableKey: 'answerTime',
  }),
  makeFunction({
    id: 'answerQuality',
    paramKeys: [
      'answerScore',
      'speedScore',
      'speedWeight',
      'bonus',
      'bonusWeight',
    ],
    fn: getAnswerQuality,
    defaultVariableKey: 'speedScore',
  }),
  makeFunction({
    id: 'forgettability',
    paramKeys: ['strength', 'difficulty', 'timeSinceLastReview'],
    fn: (params) =>
      getForgetProbability({
        strength: params.strength,
        difficulty: params.difficulty,
        daysSinceLastReview: params.timeSinceLastReview / MS_IN_DAY,
      }),
    defaultVariableKey: 'timeSinceLastReview',
  }),
  makeFunction({
    id: 'forgettabilityTest',
    paramKeys: ['strength', 'difficulty', 'daysSinceLastReview'],
    fn: getForgettabilityTest,
    defaultVariableKey: 'daysSinceLastReview',
  }),
  makeFunction({
    id: 'strength',
    paramKeys: [
      'answerQuality',
      'currentStrength',
      'currentDifficulty',
      'daysSinceLastReview',
    ],
    fn: getStrength,
    defaultVariableKey: 'answerQuality',
  }),
  makeFunction({
    id: 'difficulty',
    paramKeys: ['currentDifficulty', 'answerQuality', 'correctionWeight'],
    fn: getDifficulty,
    defaultVariableKey: 'answerQuality',
  }),
  makeFunction({
    id: 'newState',
    paramKeys: [
      'answerScore',
      'answerTime',
      'itemLength',
      'currentStrength',
      'daysSinceLastReview',
      'currentDifficulty',
      'reactionTime',
      'charTime',
      'speedWeight',
      'correctionWeight',
      'expectedSpeedMultiplier',
      'streak',
      'threshold',
      'bonusWeight',
    ],
    fn: (params) =>
      getNewState({
        ...params,
        currentStreak: params.streak,
        streakBonusThreshold: params.threshold,
      }),
    defaultVariableKey: 'answerScore',
  }),
  makeFunction({
    id: 'streakBonus',
    paramKeys: ['streak', 'threshold'],
    fn: (params: { streak: number; threshold: number }) =>
      getStreakBonus({
        currentStreak: params.streak,
        streakBonusThreshold: params.threshold,
      }),
    defaultVariableKey: 'streak',
  }),
];
