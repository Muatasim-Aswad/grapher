import { useState, useMemo, useEffect } from "react";
import { availableFunctions } from "./functions.registry";
import FunctionSelector from "./components/FunctionSelector";
import VariableSelector from "./components/VariableSelector";
import RangeInput from "./components/RangeInput";
import ParameterInputs from "./components/ParameterInputs";
import Graph from "./components/Graph";

export default function App() {
  const [selectedFunctionId, setSelectedFunctionId] = useState(
    availableFunctions[0].id,
  );
  const [variableParam, setVariableParam] = useState("x");
  const [rangeMin, setRangeMin] = useState(-10);
  const [rangeMax, setRangeMax] = useState(10);
  const [step, setStep] = useState(0.1);
  const [staticParams, setStaticParams] = useState<Record<string, number>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedFunction = useMemo(
    () => availableFunctions.find((fn) => fn.id === selectedFunctionId)!,
    [selectedFunctionId],
  );

  // Initialize params on mount
  useEffect(() => {
    const firstFunction = availableFunctions[0];
    const defaultParam = firstFunction.defaultVariable
      ? firstFunction.parameters.find(
          (p) => p.name === firstFunction.defaultVariable,
        )
      : firstFunction.parameters[0];

    const paramToUse = defaultParam || firstFunction.parameters[0];
    setVariableParam(paramToUse.name);
    setRangeMin(paramToUse.defaultMin);
    setRangeMax(paramToUse.defaultMax);

    const range = paramToUse.defaultMax - paramToUse.defaultMin;
    const optimalStep = Number((range / 200).toPrecision(2));
    setStep(optimalStep);

    const defaults: Record<string, number> = {};
    firstFunction.parameters.forEach((param) => {
      defaults[param.name] = param.defaultValue;
    });
    setStaticParams(defaults);
  }, []);

  const handleFunctionChange = (functionId: string) => {
    setSelectedFunctionId(functionId);
    const newFunction = availableFunctions.find((fn) => fn.id === functionId)!;

    // Use defaultVariable if specified, otherwise use first parameter
    const defaultParam = newFunction.defaultVariable
      ? newFunction.parameters.find(
          (p) => p.name === newFunction.defaultVariable,
        )
      : newFunction.parameters[0];

    const paramToUse = defaultParam || newFunction.parameters[0];
    setVariableParam(paramToUse.name);

    // Set range from selected parameter's defaults
    setRangeMin(paramToUse.defaultMin);
    setRangeMax(paramToUse.defaultMax);

    // Calculate optimal step
    const range = paramToUse.defaultMax - paramToUse.defaultMin;
    const optimalStep = Number((range / 200).toPrecision(2));
    setStep(optimalStep);

    // Initialize static params with defaults
    const defaults: Record<string, number> = {};
    newFunction.parameters.forEach((param) => {
      defaults[param.name] = param.defaultValue;
    });
    setStaticParams(defaults);
  };

  const handleVariableChange = (paramName: string) => {
    setVariableParam(paramName);

    // Update range to match the new variable parameter's defaults
    const param = selectedFunction.parameters.find((p) => p.name === paramName);
    if (param) {
      setRangeMin(param.defaultMin);
      setRangeMax(param.defaultMax);

      // Recalculate step for new range
      const range = param.defaultMax - param.defaultMin;
      const optimalStep = Number((range / 200).toPrecision(2));
      setStep(optimalStep);
    }
  };

  const handleStaticParamChange = (paramName: string, value: number) => {
    setStaticParams((prev) => ({ ...prev, [paramName]: value }));
  };

  const handleMinChange = (value: number) => {
    setRangeMin(value);
    // Recalculate step based on new range
    const range = rangeMax - value;
    if (range > 0) {
      const optimalStep = Number((range / 200).toPrecision(2));
      setStep(optimalStep);
    }
  };

  const handleMaxChange = (value: number) => {
    setRangeMax(value);
    // Recalculate step based on new range
    const range = value - rangeMin;
    if (range > 0) {
      const optimalStep = Number((range / 200).toPrecision(2));
      setStep(optimalStep);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Function Grapher</h1>
          <p className="text-gray-600 mt-2">
            Visualize mathematical functions by selecting a function and varying
            one parameter
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <FunctionSelector
                functions={availableFunctions}
                selectedFunctionId={selectedFunctionId}
                onSelectFunction={handleFunctionChange}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <VariableSelector
                parameters={selectedFunction.parameters}
                selectedVariable={variableParam}
                onSelectVariable={handleVariableChange}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <RangeInput
                variableName={variableParam}
                min={rangeMin}
                max={rangeMax}
                step={step}
                onMinChange={handleMinChange}
                onMaxChange={handleMaxChange}
                onStepChange={setStep}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <ParameterInputs
                parameters={selectedFunction.parameters}
                excludeParameter={variableParam}
                values={staticParams}
                onValueChange={handleStaticParamChange}
              />
            </div>
          </div>

          {/* Graph */}
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Graph</h2>
              <button
                onClick={() => setRefreshKey((k) => k + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Refresh Graph
              </button>
            </div>
            <Graph
              key={refreshKey}
              mathFunction={selectedFunction}
              variableParam={variableParam}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              step={step}
              staticParams={staticParams}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
