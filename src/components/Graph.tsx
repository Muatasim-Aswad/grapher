import { useState, useEffect, useMemo } from "react";
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
import type { MathFunction } from "../functions.registry";

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
  const [visibleOutputs, setVisibleOutputs] = useState<Record<string, boolean>>(
    {},
  );

  const dataPoints = useMemo(() => {
    const points: DataPoint[] = [];
    for (let x = rangeMin; x <= rangeMax; x += step) {
      const params = { ...staticParams, [variableParam]: x };
      const result = mathFunction.fn(params);

      const point: DataPoint = { [variableParam]: Number(x.toFixed(6)) };

      if (typeof result === "number") {
        if (isFinite(result)) {
          point.y = Number(result.toFixed(6));
          points.push(point);
        }
      } else if (result && typeof result === "object") {
        // Dynamic multi-value output
        const allFinite = Object.values(result).every((v) => isFinite(v));
        if (allFinite) {
          for (const [key, value] of Object.entries(result)) {
            point[key] = Number(value.toFixed(6));
          }
          points.push(point);
        }
      }
    }
    return points;
  }, [mathFunction, variableParam, rangeMin, rangeMax, step, staticParams]);

  const outputKeys = useMemo(() => {
    if (dataPoints.length === 0) return [];
    const firstPoint = dataPoints[0];
    return Object.keys(firstPoint).filter((key) => key !== variableParam);
  }, [dataPoints, variableParam]);

  const hasMultipleOutputs = outputKeys.length > 1;

  const { minY, maxY } = useMemo(() => {
    if (dataPoints.length === 0) return { minY: 0, maxY: 0 };

    const allValues = dataPoints.flatMap((p) =>
      outputKeys.map((key) => p[key] as number),
    );

    return {
      minY: Math.min(...allValues),
      maxY: Math.max(...allValues),
    };
  }, [dataPoints, outputKeys]);

  // Initialize visibility state for each output key
  useEffect(() => {
    const initialVisibility = outputKeys.reduce((acc, key) => {
      acc[key] = true; // Show all outputs by default
      return acc;
    }, {} as Record<string, boolean>);
    setVisibleOutputs(initialVisibility);
  }, [outputKeys]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {mathFunction.name}
      </h3>

      <div className="mb-4">
        {outputKeys.map((key) => (
          <label key={key} className="inline-flex items-center">
            <input
              type="checkbox"
              checked={visibleOutputs[key]}
              onChange={() => {
                setVisibleOutputs((prev) => ({
                  ...prev,
                  [key]: !prev[key],
                }));
              }}
              className="form-checkbox"
            />
            <span className="ml-2">{key}</span>
          </label>
        ))}
      </div>

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
              value: hasMultipleOutputs ? "values" : "y",
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
                name === "y" ? mathFunction.name : name || mathFunction.name;
              return [value.toFixed(4), label];
            }}
            labelFormatter={(label: number) =>
              `${variableParam} = ${label.toFixed(4)}`
            }
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {hasMultipleOutputs ? (
            <>
              {outputKeys.map((key, index) => {
                const colors = [
                  "#3b82f6",
                  "#ef4444",
                  "#10b981",
                  "#f59e0b",
                  "#8b5cf6",
                ];
                return (
                  visibleOutputs[key] && (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      name={key}
                      isAnimationActive={false}
                    />
                  )
                );
              })}
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
