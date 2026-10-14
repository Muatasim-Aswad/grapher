import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatNumber } from '../../shared/format';
import { copy } from './copy';
import type { GrapherState } from './model';
import type { DataPoint, SamplingResult } from './sampling';

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

type ChartProps = {
  result: Extract<SamplingResult, { ok: true }>;
  state: GrapherState;
  hiddenOutputs: ReadonlySet<string>;
};

export default function Chart({ result, state, hiddenOutputs }: ChartProps) {
  const variableLabel = copy.parameterLabel(state.variableParam);

  return (
    <>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={result.points}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="x"
            type="number"
            domain={[state.rangeMin!, state.rangeMax!]}
            tickFormatter={formatNumber}
            label={{
              value: variableLabel,
              position: 'insideBottom',
              offset: -20,
            }}
          />
          <YAxis
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={formatNumber}
            label={{ value: copy.values, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value) =>
              typeof value === 'number' ? formatNumber(value) : copy.unavailable
            }
            labelFormatter={(value) =>
              copy.axisValue(variableLabel, Number(value))
            }
          />
          {result.outputKeys.map((key, index) => (
            <Line
              key={key}
              type="linear"
              dataKey={(point: DataPoint) => point.values[key] ?? null}
              name={copy.outputLabel(key, state.mathFunction.id)}
              hide={hiddenOutputs.has(key)}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <ul
        aria-label={copy.legend}
        className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm"
      >
        {result.outputKeys.map((key, index) => (
          <li
            key={key}
            className={
              hiddenOutputs.has(key)
                ? 'flex items-center gap-2 opacity-50'
                : 'flex items-center gap-2'
            }
          >
            <span
              aria-hidden="true"
              className="h-0.5 w-4 shrink-0"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            {copy.outputLabel(key, state.mathFunction.id)}
          </li>
        ))}
      </ul>
    </>
  );
}
