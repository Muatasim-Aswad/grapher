import { copy } from './copy';
import NumberInput from '../../shared/ui/NumberInput';

type RangeInputProps = {
  variableName: string;
  min: number | null;
  max: number | null;
  step: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  onStepChange: (value: number | null) => void;
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
        {copy.rangeHeading(copy.parameterLabel(variableName))}
      </h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label
            htmlFor="range-min"
            className="block text-xs font-medium text-gray-600"
          >
            {copy.min}
          </label>
          <NumberInput
            id="range-min"
            value={min}
            onChange={onMinChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="range-max"
            className="block text-xs font-medium text-gray-600"
          >
            {copy.max}
          </label>
          <NumberInput
            id="range-max"
            value={max}
            onChange={onMaxChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="range-step"
            className="block text-xs font-medium text-gray-600"
          >
            {copy.step}
          </label>
          <NumberInput
            id="range-step"
            value={step}
            onChange={onStepChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default RangeInput;
