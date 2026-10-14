import type { FunctionParameter, GrapherState, MathFunction } from './model';

export function rangeFor(parameter: FunctionParameter) {
  const { defaultMin: rangeMin, defaultMax: rangeMax } = parameter;
  const step = Number(((rangeMax - rangeMin) / 200).toPrecision(2));
  return { rangeMin, rangeMax, step };
}

export function createGrapherState(mathFunction: MathFunction): GrapherState {
  const parameter =
    mathFunction.parameters.find(
      (item) => item.name === mathFunction.defaultVariable,
    ) ?? mathFunction.parameters[0];
  return {
    mathFunction,
    variableParam: parameter.name,
    ...rangeFor(parameter),
    staticParams: Object.fromEntries(
      mathFunction.parameters.map((item) => [item.name, item.defaultValue]),
    ),
  };
}

export function changeVariable(
  state: GrapherState,
  name: string,
): GrapherState {
  const parameter = state.mathFunction.parameters.find(
    (item) => item.name === name,
  );
  return parameter
    ? { ...state, variableParam: name, ...rangeFor(parameter) }
    : state;
}

export function changeRange(
  state: GrapherState,
  field: 'rangeMin' | 'rangeMax',
  value: number | null,
): GrapherState {
  const next = { ...state, [field]: value };
  if (
    next.rangeMin === null ||
    next.rangeMax === null ||
    next.rangeMax <= next.rangeMin
  )
    return next;
  return {
    ...next,
    step: Number(((next.rangeMax - next.rangeMin) / 200).toPrecision(2)),
  };
}
