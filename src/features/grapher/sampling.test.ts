import { expect, it, vi } from 'vitest';
import { sampleFunction, MAX_SAMPLE_COUNT } from './sampling';
import type { GrapherState } from './model';

function fixture(overrides: Partial<GrapherState> = {}): GrapherState {
  return {
    mathFunction: {
      id: 'speedScore',
      defaultVariable: 'x',
      parameters: [
        { name: 'x', defaultValue: 0, defaultMin: 0, defaultMax: 1 },
      ],
      fn: ({ x }) => x,
    },
    variableParam: 'x',
    rangeMin: 0,
    rangeMax: 1,
    step: 0.1,
    staticParams: {},
    ...overrides,
  };
}

it.each([0, -0.1, Number.MIN_VALUE])(
  'rejects unsafe step %s before calling the function',
  (step) => {
    const state = fixture({ step, rangeMin: 1, rangeMax: 2 });
    const fn = vi.spyOn(state.mathFunction, 'fn');
    expect(sampleFunction(state)).toEqual({ ok: false, code: 'invalidStep' });
    expect(fn).not.toHaveBeenCalled();
  },
);

it.each([null, NaN, Infinity, -Infinity])(
  'rejects nonfinite or missing numbers: %s',
  (value) => {
    for (const field of ['rangeMin', 'rangeMax', 'step'] as const) {
      expect(sampleFunction(fixture({ [field]: value }))).toEqual({
        ok: false,
        code: 'invalidNumber',
      });
    }
  },
);

it('bounds work before evaluating even one sample', () => {
  const state = fixture({ rangeMax: 1, step: 1 / MAX_SAMPLE_COUNT });
  const fn = vi.spyOn(state.mathFunction, 'fn');
  expect(sampleFunction(state)).toEqual({ ok: false, code: 'tooManyPoints' });
  expect(fn).not.toHaveBeenCalled();
});

it('accepts exactly the sample limit', () => {
  const result = sampleFunction(
    fixture({ rangeMax: MAX_SAMPLE_COUNT - 1, step: 1 }),
  );
  expect(result.ok && result.points.length).toBe(MAX_SAMPLE_COUNT);
});

it('samples decimal endpoints without cumulative rounding or presentation rounding', () => {
  const result = sampleFunction(fixture({ rangeMax: 0.3, step: 0.1 }));
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.points.map((point) => point.x)).toEqual([0, 0.1, 0.2, 0.3]);
  expect(result.points[3].values.y).toBe(0.3);
});

it('rejects reversed ranges and allows a single point', () => {
  expect(sampleFunction(fixture({ rangeMin: 2 }))).toEqual({
    ok: false,
    code: 'invalidRange',
  });
  const result = sampleFunction(fixture({ rangeMin: 1, rangeMax: 1 }));
  expect(result.ok && result.points).toEqual([{ x: 1, values: { y: 1 } }]);
});

it('keeps gaps and finite sibling outputs without colliding with the horizontal axis', () => {
  const state = fixture({ rangeMax: 2, step: 1 });
  state.mathFunction.fn = ({ x }) => ({
    x: x + 10,
    inverse: x === 1 ? Infinity : 1 / (x - 1),
  });
  const result = sampleFunction(state);
  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.outputKeys).toEqual(['x', 'inverse']);
  expect(result.points[1]).toEqual({ x: 1, values: { x: 11, inverse: null } });
  expect(result.minY).toBe(-1);
  expect(result.maxY).toBe(12);
});

it('returns safe errors for thrown evaluations and empty finite results', () => {
  const state = fixture();
  state.mathFunction.fn = () => {
    throw new Error('private details');
  };
  expect(sampleFunction(state)).toEqual({
    ok: false,
    code: 'evaluationFailed',
  });
  state.mathFunction.fn = () => NaN;
  expect(sampleFunction(state)).toEqual({ ok: false, code: 'noFiniteResults' });
});

it('requires a valid variable and every fixed parameter', () => {
  const state = fixture({ variableParam: 'unknown' });
  expect(sampleFunction(state)).toEqual({
    ok: false,
    code: 'invalidParameter',
  });
  state.variableParam = 'x';
  state.mathFunction.parameters = [
    ...state.mathFunction.parameters,
    { name: 'other', defaultValue: 1, defaultMin: 0, defaultMax: 2 },
  ];
  expect(sampleFunction(state)).toEqual({ ok: false, code: 'invalidNumber' });
});
