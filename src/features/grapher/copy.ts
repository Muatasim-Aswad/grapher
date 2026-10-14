import { formatInteger, formatNumber } from '../../shared/format';
import type { FunctionId } from './model';
import type { argsRegistry } from './parameters';
import type { SamplingResult } from './sampling';

const functionNames = {
  speedScore: 'Speed score',
  answerQuality: 'Answer quality',
  forgettability: 'Forgettability',
  forgettabilityTest: 'Forgettability comparison',
  strength: 'Strength',
  difficulty: 'Difficulty',
  newState: 'New state',
  streakBonus: 'Streak bonus',
} satisfies Record<FunctionId, string>;

const parameterNames: Record<keyof typeof argsRegistry, string> = {
  itemLength: 'Item length (characters)',
  answerTime: 'Answer time (ms)',
  reactionTime: 'Reaction time (ms)',
  charTime: 'Time per character (ms)',
  expectedSpeedMultiplier: 'Expected speed multiplier',
  answerScore: 'Answer score',
  speedScore: 'Speed score',
  bonus: 'Streak bonus',
  bonusWeight: 'Bonus weight',
  timeSinceLastReview: 'Time since last review (ms)',
  daysSinceLastReview: 'Days since last review',
  strength: 'Strength (days)',
  currentStrength: 'Current strength (days)',
  difficulty: 'Difficulty',
  currentDifficulty: 'Current difficulty',
  answerQuality: 'Answer quality',
  speedWeight: 'Speed weight',
  correctionWeight: 'Difficulty correction weight',
  streak: 'Current streak',
  threshold: 'Streak threshold',
};

const outputNames: Record<string, string> = {
  newStrength: 'New strength (days)',
  newDifficulty: 'New difficulty',
  newStreak: 'New streak',
  formal: 'Forget probability',
  logOverdue: 'Log overdue',
  reverseExponent: 'Reverse exponent',
  decayExponent: 'Decay exponent',
};

type ErrorCode = Extract<SamplingResult, { ok: false }>['code'];

export const copy = {
  functionNames,
  parameterLabel: (name: string) =>
    (parameterNames as Record<string, string>)[name] ?? name,
  outputLabel: (key: string, functionId: FunctionId) =>
    key === 'y' ? functionNames[functionId] : (outputNames[key] ?? key),
  selectFunction: 'Select function',
  selectVariable: 'Variable parameter',
  staticParameters: 'Fixed parameters',
  rangeHeading: (name: string) => `Range for ${name}`,
  min: 'Minimum',
  max: 'Maximum',
  step: 'Step',
  graph: 'Graph',
  refresh: 'Refresh graph',
  legend: 'Graph legend',
  values: 'Values',
  unavailable: 'Unavailable',
  loading: 'Loading graph…',
  points: (count: number) => `Data points: ${formatInteger(count)}`,
  yRange: (min: number, max: number) =>
    `Y range: [${formatNumber(min)}, ${formatNumber(max)}]`,
  axisValue: (name: string, value: number) =>
    `${name} = ${formatNumber(value)}`,
  errors: {
    invalidNumber: 'Enter a finite number in every field.',
    invalidRange:
      'The maximum must be at least the minimum, with a finite range.',
    invalidStep:
      'Use a positive step large enough to advance through the range.',
    tooManyPoints:
      'This range has too many points. Increase the step or narrow the range.',
    invalidParameter: 'Choose a parameter belonging to this function.',
    evaluationFailed:
      'This function cannot be evaluated with these parameters. Check its input values.',
    noFiniteResults:
      'There are no finite results in this range. Try different parameters.',
  } satisfies Record<ErrorCode, string>,
};
