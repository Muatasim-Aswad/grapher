type RangeInputProps = {
  variableName: string;
  min: number;
  max: number;
  step: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onStepChange: (value: number) => void;
};

function RangeInput({
  variableName,
  min,
  max,
  step,
  onMinChange,
  onMaxChange,
  onStepChange,
}: RangeInputProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        Range for {variableName}
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="range-min"
            className="block text-xs font-medium text-gray-600"
          >
            Min
          </label>
          <input
            id="range-min"
            value={min}
            onChange={(e) => onMinChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="range-max"
            className="block text-xs font-medium text-gray-600"
          >
            Max
          </label>
          <input
            id="range-max"
            value={max}
            onChange={(e) => onMaxChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="range-step"
            className="block text-xs font-medium text-gray-600"
          >
            Step
          </label>
          <input
            id="range-step"
            value={step}
            onChange={(e) => onStepChange(Number(e.target.value))}
            min={0.01}
            step={0.01}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default RangeInput;
