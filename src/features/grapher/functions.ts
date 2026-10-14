import { argsRegistry } from './parameters';
import type { FunctionId, FunctionOutput, MathFunction } from './model';

type ParamKey = keyof typeof argsRegistry;

export function makeFunction<
  const Keys extends readonly [ParamKey, ...ParamKey[]],
>(config: {
  id: FunctionId;
  paramKeys: Keys;
  fn: (params: Record<Keys[number], number>) => FunctionOutput;
  defaultVariableKey: NoInfer<Keys[number]>;
}): MathFunction {
  const { id, paramKeys, fn, defaultVariableKey } = config;
  const parameters = paramKeys.map((name) => ({ name, ...argsRegistry[name] }));
  const [first, ...rest] = parameters;
  if (!first) throw new Error('A graph function needs at least one parameter.');

  return {
    id,
    parameters: [first, ...rest],
    defaultVariable: defaultVariableKey,
    fn(params) {
      const values = Object.fromEntries(
        paramKeys.map((key) => [key, params[key]]),
      ) as Record<Keys[number], number>;
      return fn(values);
    },
  };
}
