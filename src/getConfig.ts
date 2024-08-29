import { z } from "zod";
import { cosmiconfigSync } from "cosmiconfig";

const ConfigSchema = z.object({
  zodValueOverrides: z
    .object({
      schema: z.record(z.record(z.string())),
    })
    .optional(),
});

export type TConfig = z.infer<typeof ConfigSchema>;

export const getConfig = (): z.infer<typeof ConfigSchema> | null => {
  const explorerSync = cosmiconfigSync("jtz");
  const result = explorerSync.search();

  if (!result) {
    return null;
  }

  const { config } = result;
  const configValidationResult = ConfigSchema.safeParse(config);
  if (!configValidationResult.success) {
    console.error(configValidationResult.error);
    throw new Error(
      "Invalid Json To Zod config. Please double check your config file."
    );
  }

  return config;
};
