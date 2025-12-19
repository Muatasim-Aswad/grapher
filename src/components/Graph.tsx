import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MathFunction } from "../functions";

type GraphProps = {
  mathFunction: MathFunction;
  variableParam: string;
  rangeMin: number;
  rangeMax: number;
  step: number;
  staticParams: Record<string, number>;
};

type DataPoint = {
  [key: string]: number;
};

function Graph({
  mathFunction,
  variableParam,
  rangeMin,
  rangeMax,
  step,
  staticParams,
}: GraphProps) {
  const dataPoints = useMemo(() => {
    const points: DataPoint[] = [];
    for (let x = rangeMin; x <= rangeMax; x += step) {
      const params = { ...staticParams, [variableParam]: x };
      const result = mathFunction.fn(params);

      // Handle both single value and dual value outputs
      if (typeof result === "number") {
        if (isFinite(result)) {
          points.push({
            [variableParam]: Number(x.toFixed(6)),
            y: Number(result.toFixed(6)),
          });
        }
      } else if (result && typeof result === "object") {
        // Dual output
        if (isFinite(result.y1) && isFinite(result.y2)) {
          points.push({
            [variableParam]: Number(x.toFixed(6)),
            y1: Number(result.y1.toFixed(6)),
            y2: Number(result.y2.toFixed(6)),
          });
        }
      }
    }
    return points;
  }, [mathFunction, variableParam, rangeMin, rangeMax, step, staticParams]);

  const hasDualOutput = useMemo(() => {
    return dataPoints.length > 0 && "y1" in dataPoints[0];
  }, [dataPoints]);

  const { minY, maxY } = useMemo(() => {
    if (dataPoints.length === 0) return { minY: 0, maxY: 0 };

    if (hasDualOutput) {
      const y1Values = dataPoints.map((p) => p.y1 as number);
      const y2Values = dataPoints.map((p) => p.y2 as number);
      const allValues = [...y1Values, ...y2Values];
      return {
        minY: Math.min(...allValues),
        maxY: Math.max(...allValues),
      };
    } else {
      const yValues = dataPoints.map((p) => p.y as number);
      return {
        minY: Math.min(...yValues),
        maxY: Math.max(...yValues),
      };
    }
  }, [dataPoints, hasDualOutput]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {mathFunction.name}
      </h3>

      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={dataPoints}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={variableParam}
            type="number"
            domain={[rangeMin, rangeMax]}
            label={{
              value: variableParam,
              position: "insideBottom",
              offset: -5,
              style: { fontWeight: 600 },
            }}
            stroke="#6b7280"
          />
          <YAxis
            type="number"
            domain={["auto", "auto"]}
            label={{
              value: hasDualOutput ? "values" : "y",
              angle: -90,
              position: "insideLeft",
              style: { fontWeight: 600 },
            }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
            formatter={(value: number | undefined, name?: string) => {
              if (value === undefined)
                return ["N/A", name || mathFunction.name];
              const label =
                name === "y1"
                  ? mathFunction.outputLabels?.y1 || "y1"
                  : name === "y2"
                  ? mathFunction.outputLabels?.y2 || "y2"
                  : mathFunction.name;
              return [value.toFixed(4), label];
            }}
            labelFormatter={(label: number) =>
              `${variableParam} = ${label.toFixed(4)}`
            }
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {hasDualOutput ? (
            <>
              <Line
                type="monotone"
                dataKey="y1"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                name={mathFunction.outputLabels?.y1 || "y1"}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="y2"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name={mathFunction.outputLabels?.y2 || "y2"}
                isAnimationActive={false}
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="y"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name={mathFunction.name}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>Data points: {dataPoints.length}</p>
        <p>
          Y range: [{minY.toFixed(4)}, {maxY.toFixed(4)}]
        </p>
      </div>
    </div>
  );
}

export default Graph;
