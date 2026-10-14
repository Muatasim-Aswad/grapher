import { lazy, Suspense, useMemo, useState } from 'react';
import { copy } from './copy';
import type { GrapherState } from './model';
import { sampleFunction } from './sampling';

const Chart = lazy(() => import('./Chart'));

export default function Graph({ state }: { state: GrapherState }) {
  const [hiddenOutputs, setHiddenOutputs] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const result = useMemo(() => sampleFunction(state), [state]);

  if (!result.ok)
    return (
      <p role="alert" className="rounded-lg bg-white p-6 text-red-700 shadow">
        {copy.errors[result.code]}
      </p>
    );

  const toggleOutput = (key: string) => {
    setHiddenOutputs((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section className="rounded-lg bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        {copy.functionNames[state.mathFunction.id]}
      </h3>
      <div className="mb-4 flex flex-wrap gap-4">
        {result.outputKeys.map((key) => (
          <label key={key} className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={!hiddenOutputs.has(key)}
              onChange={() => toggleOutput(key)}
            />
            <span>{copy.outputLabel(key, state.mathFunction.id)}</span>
          </label>
        ))}
      </div>
      <Suspense fallback={<p role="status">{copy.loading}</p>}>
        <Chart result={result} state={state} hiddenOutputs={hiddenOutputs} />
      </Suspense>
      <div className="mt-4 space-y-1 text-sm text-gray-600">
        <p>{copy.points(result.points.length)}</p>
        <p>{copy.yRange(result.minY, result.maxY)}</p>
      </div>
    </section>
  );
}
