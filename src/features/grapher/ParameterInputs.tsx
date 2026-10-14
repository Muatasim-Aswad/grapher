import { copy } from './copy';
import type { MathFunction } from './model';
import NumberInput from '../../shared/ui/NumberInput';

type ParameterInputsProps = {
  parameters: MathFunction['parameters'];
  excludeParameter: string;
  values: Record<string, number | null>;
  onValueChange: (paramName: string, value: number | null) => void;
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
      <h3 className="text-sm font-medium text-gray-700">
        {copy.staticParameters}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {staticParams.map((param) => (
          <div key={param.name} className="space-y-1">
            <label
              htmlFor={`param-${param.name}`}
              className="block text-xs font-medium text-gray-600"
            >
              {copy.parameterLabel(param.name)}
            </label>
            <NumberInput
              id={`param-${param.name}`}
              value={
                values[param.name] === undefined
                  ? param.defaultValue
                  : values[param.name]
              }
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
