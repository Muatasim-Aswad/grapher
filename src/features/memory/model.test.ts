import { expect, it } from 'vitest';
import {
  AnswerScore,
  getSpeedScore,
  getAnswerQuality,
  getStrength,
  getDifficulty,
  getForgetProbability,
  getNewState,
  getNewStateWithDefaults,
  MS_IN_DAY,
  MIN_STRENGTH,
  MIN_DIFFICULTY,
  MAX_DIFFICULTY,
} from './model';

it('keeps forget probability bounded and increasing with elapsed days', () => {
  const probabilities = [0, 0.1, 1, 7, 30, 365].map((daysSinceLastReview) =>
    getForgetProbability({ strength: 3, difficulty: 2, daysSinceLastReview }),
  );
  expect(probabilities[0]).toBe(0);
  for (let i = 1; i < probabilities.length; i++) {
    expect(probabilities[i]).toBeGreaterThanOrEqual(probabilities[i - 1]);
    expect(probabilities[i]).toBeLessThanOrEqual(1);
  }
});

it('rewards faster plausible answers and rejects accidental reaction times', () => {
  const params = {
    itemLength: 10,
    reactionTime: 250,
    charTime: 20,
    expectedSpeedMultiplier: 15,
  };
  expect(getSpeedScore({ ...params, answerTime: 100 })).toBe(0);
  expect(getSpeedScore({ ...params, answerTime: 2_000 })).toBeGreaterThan(
    getSpeedScore({ ...params, answerTime: 4_000 }),
  );
});

it('clamps answer quality, strength and difficulty to their bounds', () => {
  expect(
    getAnswerQuality({
      answerScore: 1.5,
      speedScore: 1,
      speedWeight: 1,
      bonus: 1,
      bonusWeight: 1,
    }),
  ).toBe(2);
  expect(
    getStrength({
      answerQuality: 0,
      currentStrength: 2,
      currentDifficulty: 2,
      daysSinceLastReview: 1,
    }),
  ).toBe(MIN_STRENGTH);
  expect(
    getDifficulty({
      currentDifficulty: 1,
      answerQuality: 2,
      correctionWeight: 5,
    }),
  ).toBe(MIN_DIFFICULTY);
  expect(
    getDifficulty({
      currentDifficulty: 10,
      answerQuality: 0,
      correctionWeight: 5,
    }),
  ).toBe(MAX_DIFFICULTY);
});

it('converts elapsed milliseconds at the default adapter and reports internals', () => {
  const report = { days: 0 };
  getNewStateWithDefaults(
    {
      answerScore: AnswerScore.KNOW,
      answerTime: 2_000,
      itemLength: 10,
      strength: 3,
      difficulty: 2,
      msSinceLastReview: 2 * MS_IN_DAY,
      streak: 4,
    },
    (internals) => {
      report.days = internals.daysSinceLastReview;
    },
  );
  expect(report.days).toBe(2);
});

it('leaves established state unchanged for an immediate review', () => {
  expect(
    getNewStateWithDefaults({
      answerScore: AnswerScore.KNOW,
      answerTime: 2_000,
      itemLength: 10,
      strength: 3,
      difficulty: 2,
      msSinceLastReview: 0.1 * MS_IN_DAY,
      streak: 4,
    }),
  ).toEqual({ newStrength: 3, newDifficulty: 2, newStreak: 4 });
});

it.each([
  [0, 0.2, 0.5, 1, 1, 1.5],
  [1.5, 1, 1, 0.5, 0.2, 0],
  [0.2, 0.5, 0.2, 0.2, 1.5, 0, 1.5, 1, 1.5],
])(
  'preserves memory invariants over a sequence of review scores: %j',
  (...scores) => {
    let strength = 1;
    let difficulty = 2;
    let streak = 0;
    for (const answerScore of scores) {
      const result = getNewStateWithDefaults({
        answerScore,
        answerTime: 2_000,
        itemLength: 10,
        strength,
        difficulty,
        msSinceLastReview: MS_IN_DAY,
        streak,
      });
      expect(Number.isFinite(result.newStrength)).toBe(true);
      expect(result.newStrength).toBeGreaterThanOrEqual(MIN_STRENGTH);
      expect(result.newDifficulty).toBeGreaterThanOrEqual(MIN_DIFFICULTY);
      expect(result.newDifficulty).toBeLessThanOrEqual(MAX_DIFFICULTY);
      expect(result.newStreak).toBe(answerScore >= 1 ? streak + 1 : 0);
      strength = result.newStrength;
      difficulty = result.newDifficulty;
      streak = result.newStreak;
    }
  },
);

it('rejects invalid item lengths through the composed use case', () => {
  expect(() =>
    getNewState({ itemLength: 0 } as Parameters<typeof getNewState>[0]),
  ).toThrow('Length must be greater than zero');
});
