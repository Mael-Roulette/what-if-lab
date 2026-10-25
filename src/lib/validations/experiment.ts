import * as z from "zod";
import { ParameterType } from "@/types";
import { ExperimentStatus } from "@/types/experiment";

export const parameterSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required.").max(100),
    type: z.enum(ParameterType),
    default: z.string().trim().min(1, "Default value is required."),
    min: z.string().trim(),
    max: z.string().trim(),
    unit: z.string().trim().max(20, "Unit is too long."),
  })
  .superRefine((p, ctx) => {
    if (p.type === ParameterType.STRING) return;

    const fields = ["default", "min", "max"] as const;
    const parsed: Partial<Record<(typeof fields)[number], number>> = {};

    for (const field of fields) {
      const raw = p[field];
      if (raw === "") continue;

      const value = Number(raw);
      if (!Number.isFinite(value)) {
        ctx.addIssue({ code: "custom", message: "Must be a number.", path: [field] });
        continue;
      }
      if (p.type === ParameterType.NUMBER && !Number.isInteger(value)) {
        ctx.addIssue({ code: "custom", message: "Must be an integer.", path: [field] });
        continue;
      }
      parsed[field] = value;
    }

    const { default: def, min, max } = parsed;

    if (min !== undefined && max !== undefined && min > max) {
      ctx.addIssue({ code: "custom", message: "Min must be ≤ max.", path: ["min"] });
    }
    if (def !== undefined && min !== undefined && def < min) {
      ctx.addIssue({ code: "custom", message: "Default is below the minimum.", path: ["default"] });
    }
    if (def !== undefined && max !== undefined && def > max) {
      ctx.addIssue({ code: "custom", message: "Default is above the maximum.", path: ["default"] });
    }
  });

export const experimentSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required.").max(100, "Title is too long."),
    description: z.string().trim().max(1000, "Description is too long."),
    status: z.enum(ExperimentStatus),
    parameters: z.array(parameterSchema),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();
    data.parameters.forEach((p, i) => {
      const key = p.name.toLowerCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: "Parameter names must be unique.",
          path: ["parameters", i, "name"],
        });
      }
      seen.add(key);
    });
  });

export type ExperimentFormValues = z.infer<typeof experimentSchema>;