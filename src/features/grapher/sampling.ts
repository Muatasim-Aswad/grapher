import type { GrapherState, FunctionOutput } from './model';

export const MAX_SAMPLE_COUNT = 5_000;

type SamplingError =
  | 'invalidNumber'
  | 'invalidRange'
  | 'invalidStep'
  | 'tooManyPoints'
  | 'invalidParameter'
  | 'evaluationFailed'
  | 'noFiniteResults';

export type DataPoint = { x: number; values: Record<string, number | null> };

export type SamplingResult =
  | {
      ok: true;
      points: DataPoint[];
      outputKeys: string[];
      minY: number;
      maxY: number;
    }
  | { ok: false; code: SamplingError };

function outputValues(output: FunctionOutput): Record<string, number | null> {
  const values = typeof output === 'number' ? { y: output } : output;
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Number.isFinite(value) ? value : null,
    ]),
  );
}

export function sampleFunction(state: GrapherState): SamplingResult {
  const { mathFunction, variableParam, rangeMin, rangeMax, step } = state;
  if (
    rangeMin === null ||
    rangeMax === null ||
    step === null ||
    ![rangeMin, rangeMax, step].every(Number.isFinite)
  )
    return { ok: false, code: 'invalidNumber' };
  if (rangeMax < rangeMin || !Number.isFinite(rangeMax - rangeMin))
    return { ok: false, code: 'invalidRange' };
  if (step <= 0 || (rangeMax > rangeMin && rangeMin + step <= rangeMin))
    return { ok: false, code: 'invalidStep' };

  const intervals = (rangeMax - rangeMin) / step;
  const sampleCount =
    Math.floor(intervals + Number.EPSILON * Math.max(1, intervals) * 4) + 1;
  if (!Number.isFinite(sampleCount) || sampleCount > MAX_SAMPLE_COUNT)
    return { ok: false, code: 'tooManyPoints' };
  if (
    !mathFunction.parameters.some(
      (parameter) => parameter.name === variableParam,
    )
  )
    return { ok: false, code: 'invalidParameter' };

  const params: Record<string, number> = {};
  for (const parameter of mathFunction.parameters) {
    if (parameter.name === variableParam) continue;
    const value = state.staticParams[parameter.name];
    if (value === null || value === undefined || !Number.isFinite(value))
      return { ok: false, code: 'invalidNumber' };
    params[parameter.name] = value;
  }

  const points: DataPoint[] = [];
  const keys = new Set<string>();
  let minY = Infinity;
  let maxY = -Infinity;
  try {
    for (let index = 0; index < sampleCount; index++) {
      const x = Math.min(rangeMax, rangeMin + index * step);
      const values = outputValues(
        mathFunction.fn({ ...params, [variableParam]: x }),
      );
      points.push({ x, values });
      for (const [key, value] of Object.entries(values)) {
        keys.add(key);
        if (value === null) continue;
        minY = Math.min(minY, value);
        maxY = Math.max(maxY, value);
      }
    }
  } catch {
    return { ok: false, code: 'evaluationFailed' };
  }

  if (!Number.isFinite(minY)) return { ok: false, code: 'noFiniteResults' };
  return { ok: true, points, outputKeys: [...keys], minY, maxY };
}
