import { expect, it } from 'vitest';
import { availableFunctions } from './registry';
import { createGrapherState, changeVariable } from './state';
import { sampleFunction } from './sampling';
import {
  MS_IN_DAY,
  getForgetProbability,
  getStreakBonus,
  getNewState,
} from '../memory';

it('gives every registered function a unique stable id and a valid default plot', () => {
  expect(new Set(availableFunctions.map((item) => item.id)).size).toBe(
    availableFunctions.length,
  );
  for (const mathFunction of availableFunctions) {
    expect(
      sampleFunction(createGrapherState(mathFunction)).ok,
      mathFunction.id,
    ).toBe(true);
    for (const parameter of mathFunction.parameters) {
      expect(parameter.defaultValue).toBeGreaterThanOrEqual(
        parameter.defaultMin,
      );
      expect(parameter.defaultValue).toBeLessThanOrEqual(parameter.defaultMax);
      expect(
        sampleFunction(
          changeVariable(createGrapherState(mathFunction), parameter.name),
        ).ok,
        `${mathFunction.id}:${parameter.name}`,
      ).toBe(true);
    }
  }
});

it('converts milliseconds into days at the registry boundary', () => {
  const fn = availableFunctions.find((item) => item.id === 'forgettability')!;
  expect(
    fn.fn({ strength: 3, difficulty: 2, timeSinceLastReview: MS_IN_DAY }),
  ).toBeCloseTo(
    getForgetProbability({
      strength: 3,
      difficulty: 2,
      daysSinceLastReview: 1,
    }),
  );
});

it('maps streak parameter names to the memory model', () => {
  const fn = availableFunctions.find((item) => item.id === 'streakBonus')!;
  expect(fn.fn({ streak: 5, threshold: 1 })).toBe(
    getStreakBonus({ currentStreak: 5, streakBonusThreshold: 1 }),
  );
});

it('maps all new-state parameters without leaking grapher names into the model', () => {
  const fn = availableFunctions.find((item) => item.id === 'newState')!;
  const params = Object.fromEntries(
    fn.parameters.map((item) => [item.name, item.defaultValue]),
  );
  expect(fn.fn(params)).toEqual(
    getNewState({
      ...params,
      currentStreak: params.streak,
      streakBonusThreshold: params.threshold,
    } as Parameters<typeof getNewState>[0]),
  );
});
