import { argsRegistry } from "./functions.registry";

export type FunctionParameter = {
  name?: string;
  defaultValue: number;
  defaultMin: number;
  defaultMax: number;
};

export type FunctionOutput = number | Record<string, number>;

export type MathFunction = {
  id: string;
  name: string;
  parameters: Array<FunctionParameter & { name: string }>; // name is always set in makeFunction
  fn: (params: Record<string, number>) => FunctionOutput;
  defaultVariable?: string;
};

type ParamKey = keyof typeof argsRegistry;

export type MakeFunctionConfig<
  Keys extends readonly ParamKey[] = readonly ParamKey[],
> = {
  name: string;
  paramKeys: Keys;
  fn: (
    params: Record<Keys[number], number> & Record<string, unknown>,
  ) => FunctionOutput;
  defaultVariableKey?: Keys[number];
};

/**
 * Creates a MathFunction with type-safe parameter validation.
 * All keys in paramKeys must exist in argsRegistry.
 * For best type safety, ensure paramKeys match your function's actual parameters.
 */
export const makeFunction = <const Keys extends readonly ParamKey[]>({
  name,
  paramKeys,
  fn,
  defaultVariableKey,
}: MakeFunctionConfig<Keys>): MathFunction => {
  let id = name.split(" ").join("");
  id = id.charAt(0).toLowerCase() + id.slice(1);

  return {
    id,
    name,
    parameters: paramKeys.map((key) => {
      const arg = argsRegistry[key];
      const paramName =
        "name" in arg && typeof arg.name === "string" ? arg.name : key;
      return {
        ...arg,
        name: paramName,
      };
    }),
    fn: (params: Record<string, number>) => {
      const fnParams = Object.fromEntries(
        paramKeys.map((key) => {
          const arg = argsRegistry[key];
          const paramName =
            "name" in arg && typeof arg.name === "string" ? arg.name : key;
          return [key, params[paramName]];
        }),
      ) as Record<Keys[number], number>;
      return fn(fnParams);
    },
    defaultVariable: (() => {
      if (defaultVariableKey) {
        const arg = argsRegistry[defaultVariableKey];
        return "name" in arg && typeof arg.name === "string"
          ? arg.name
          : defaultVariableKey;
      }
      const arg = argsRegistry[paramKeys[0]];
      return "name" in arg && typeof arg.name === "string"
        ? arg.name
        : paramKeys[0];
    })(),
  };
};
