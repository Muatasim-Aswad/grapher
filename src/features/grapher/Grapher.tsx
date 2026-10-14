import { useState } from 'react';
import { availableFunctions } from './registry';
import { changeRange, changeVariable, createGrapherState } from './state';
import { copy } from './copy';
import FunctionSelector from './FunctionSelector';
import VariableSelector from './VariableSelector';
import RangeInput from './RangeInput';
import ParameterInputs from './ParameterInputs';
import Graph from './Graph';

export default function Grapher() {
  const [state, setState] = useState(() =>
    createGrapherState(availableFunctions[0]),
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFunctionChange = (id: string) => {
    const mathFunction = availableFunctions.find((item) => item.id === id);
    if (mathFunction) setState(createGrapherState(mathFunction));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <FunctionSelector
            functions={availableFunctions}
            selectedFunctionId={state.mathFunction.id}
            onSelectFunction={handleFunctionChange}
          />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <VariableSelector
            parameters={state.mathFunction.parameters}
            selectedVariable={state.variableParam}
            onSelectVariable={(name) =>
              setState((previous) => changeVariable(previous, name))
            }
          />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <RangeInput
            variableName={state.variableParam}
            min={state.rangeMin}
            max={state.rangeMax}
            step={state.step}
            onMinChange={(value) =>
              setState((previous) => changeRange(previous, 'rangeMin', value))
            }
            onMaxChange={(value) =>
              setState((previous) => changeRange(previous, 'rangeMax', value))
            }
            onStepChange={(step) =>
              setState((previous) => ({ ...previous, step }))
            }
          />
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <ParameterInputs
            parameters={state.mathFunction.parameters}
            excludeParameter={state.variableParam}
            values={state.staticParams}
            onValueChange={(name, value) =>
              setState((previous) => ({
                ...previous,
                staticParams: { ...previous.staticParams, [name]: value },
              }))
            }
          />
        </div>
      </div>
      <div className="min-w-0 lg:col-span-2">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white p-4 shadow">
          <h2 className="text-lg font-semibold text-gray-900">{copy.graph}</h2>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            {copy.refresh}
          </button>
        </div>
        <Graph key={`${state.mathFunction.id}-${refreshKey}`} state={state} />
      </div>
    </div>
  );
}
