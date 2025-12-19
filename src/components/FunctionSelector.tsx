import type { MathFunction } from "../functions";

type FunctionSelectorProps = {
  functions: MathFunction[];
  selectedFunctionId: string;
  onSelectFunction: (functionId: string) => void;
};

function FunctionSelector({
  functions,
  selectedFunctionId,
  onSelectFunction,
}: FunctionSelectorProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="function-select"
        className="block text-sm font-medium text-gray-700"
      >
        Select Function
      </label>
      <select
        id="function-select"
        value={selectedFunctionId}
        onChange={(e) => onSelectFunction(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {functions.map((fn) => (
          <option key={fn.id} value={fn.id}>
            {fn.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FunctionSelector;
