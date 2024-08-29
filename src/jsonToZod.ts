import { format } from "prettier";
import babelParser from "prettier/parser-babel";
import { TConfig } from "./getConfig";

export const jsonToZod = (
  obj: any,
  name: string = "schema",
  module?: boolean,
  zodValueOverrides?: TConfig["zodValueOverrides"]
): string => {
  const parse = (obj: any, seen: object[]): string => {
    switch (typeof obj) {
      case "string":
        return "z.string()";
      case "number":
        return "z.number()";
      case "bigint":
        return "z.number().int()";
      case "boolean":
        return "z.boolean()";
      case "object":
        if (obj === null) {
          return "z.null()";
        }
        if (seen.find((_obj) => Object.is(_obj, obj))) {
          throw "Circular objects are not supported";
        }
        seen.push(obj);
        if (Array.isArray(obj)) {
          const options = obj
            .map((obj) => parse(obj, seen))
            .reduce(
              (acc: string[], curr: string) =>
                acc.includes(curr) ? acc : [...acc, curr],
              []
            );
          if (options.length === 1) {
            return `z.array(${options[0]})`;
          } else if (options.length > 1) {
            return `z.array(z.union([${options}]))`;
          } else {
            return `z.array(z.unknown())`;
          }
        }
        return `z.object({${Object.entries(obj).map(([k, v]) => {
          const overrideKey = k.toLowerCase();
          const value = zodValueOverrides?.schema?.[name]?.[overrideKey];
          return value ? `'${k}':${value}` : `'${k}':${parse(v, seen)}`;
        })}})`;
      case "undefined":
        return "z.undefined()";
      case "function":
        return "z.function()";
      case "symbol":
      default:
        return "z.unknown()";
    }
  };

  return module
    ? format(
        `import {z} from "zod"\n\nexport const ${name}=${parse(obj, [])}`,
        {
          parser: "babel",
          plugins: [babelParser],
        }
      )
    : format(`const ${name}=${parse(obj, [])}`, {
        parser: "babel",
        plugins: [babelParser],
      });
};
