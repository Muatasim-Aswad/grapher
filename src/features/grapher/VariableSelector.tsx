import { copy } from './copy';
import type { MathFunction } from './model';

type VariableSelectorProps = {
  parameters: MathFunction['parameters'];
  selectedVariable: string;
  onSelectVariable: (parameterName: string) => void;
};

function VariableSelector({
  parameters,
  selectedVariable,
  onSelectVariable,
}: VariableSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="variable-select"
        className="block text-sm font-medium text-gray-700"
      >
        {copy.selectVariable}
      </label>
      <select
        id="variable-select"
        value={selectedVariable}
        onChange={(e) => onSelectVariable(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {parameters.map((param) => (
          <option key={param.name} value={param.name}>
            {copy.parameterLabel(param.name)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default VariableSelector;
