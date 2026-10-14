export type FunctionId =
  | 'speedScore'
  | 'answerQuality'
  | 'forgettability'
  | 'forgettabilityTest'
  | 'strength'
  | 'difficulty'
  | 'newState'
  | 'streakBonus';

export type FunctionParameter = {
  name: string;
  defaultValue: number;
  defaultMin: number;
  defaultMax: number;
};

export type FunctionOutput = number | Record<string, number>;

export type MathFunction = {
  id: FunctionId;
  parameters: readonly [FunctionParameter, ...FunctionParameter[]];
  fn: (params: Record<string, number>) => FunctionOutput;
  defaultVariable: string;
};

export type GrapherState = {
  mathFunction: MathFunction;
  variableParam: string;
  rangeMin: number | null;
  rangeMax: number | null;
  step: number | null;
  staticParams: Record<string, number | null>;
};
