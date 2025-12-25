import type { MathFunction } from "../functions.registry";
import NumberInput from "./NumberInput";

type ParameterInputsProps = {
  parameters: MathFunction["parameters"];
  excludeParameter: string;
  values: Record<string, number>;
  onValueChange: (paramName: string, value: number) => void;
};

function ParameterInputs({
  parameters,
  excludeParameter,
  values,
  onValueChange,
}: ParameterInputsProps) {
  const staticParams = parameters.filter((p) => p.name !== excludeParameter);

  if (staticParams.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Static Parameters</h3>

      <div className="grid grid-cols-2 gap-4">
        {staticParams.map((param) => (
          <div key={param.name} className="space-y-1">
            <label
              htmlFor={`param-${param.name}`}
              className="block text-xs font-medium text-gray-600"
            >
              {param.name}
            </label>
            <NumberInput
              id={`param-${param.name}`}
              value={values[param.name] ?? param.defaultValue}
              onChange={(val) => onValueChange(param.name, val)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParameterInputs;
