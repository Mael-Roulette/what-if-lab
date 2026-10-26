"use client";

import {
  createExperiment,
  createExperimentParameters,
} from "@/lib/appwrite/experiment";
import { experimentSchema } from "@/lib/validations/experiment";
import { ExperimentFields } from "@/components/experiments/form/experiment-section";
import { ParameterRequest } from "@/types";
import { useState } from "react";

export function useUpdateExperiment() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function updateExperiment(
    fields: ExperimentFields,
    parameters: ParameterRequest[],
  ) {
    setMessage("");
    setErrors({});

    const filledParameters = parameters.filter((p) => p.name.trim());

    const result = experimentSchema.safeParse({
      ...fields,
      parameters: filledParameters,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const key = issue.path.join(".");

        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return false;
    }

    setIsSubmitting(true);

    try {
      const { parameters: validParameters, ...experimentData } = result.data;

      const experiment = await createExperiment(experimentData);

      await Promise.all(
        validParameters.map((parameter) =>
          createExperimentParameters(parameter, experiment.id),
        ),
      );

      setMessage("Experiment updated successfully.");

      return true;
    } catch (error) {
      console.error(error);
      setMessage("Failed to update experiment.");

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    updateExperiment,
    errors,
    isSubmitting,
    message,
  };
}