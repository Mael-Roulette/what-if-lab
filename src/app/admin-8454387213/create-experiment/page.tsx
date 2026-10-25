"use client";

import { ExperimentFields, ExperimentSection } from "@/components/experiments/form/experiment-section";
import { ParametersSection } from "@/components/experiments/form/parameter-section";
import { createExperiment, createExperimentParameters } from "@/lib/appwrite/experiment";
import { experimentSchema } from "@/lib/validations/experiment";
import { ParameterRequest, ParameterType } from "@/types";
import { ExperimentStatus } from "@/types/experiment";
import { useState } from "react";

const initialFields: ExperimentFields = {
  title: "",
  description: "",
  status: ExperimentStatus.DRAFT,
};

const emptyParameter = (): ParameterRequest => ({
  name: "",
  type: ParameterType.FLOAT,
  default: "",
  min: "",
  max: "",
  unit: "",
});

export default function CreateExperimentPage() {
  const [fields, setFields] = useState<ExperimentFields>(initialFields);
  const [parameters, setParameters] = useState<ParameterRequest[]>([
    emptyParameter(),
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function updateField<K extends keyof ExperimentFields>(
    field: K,
    value: ExperimentFields[K]
  ) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  function addParameter() {
    setParameters((current) => [...current, emptyParameter()]);
  }

  function removeParameter(index: number) {
    setParameters((current) => current.filter((_, i) => i !== index));
  }

  function updateParameter(
    index: number,
    field: keyof ParameterRequest,
    value: string
  ) {
    setParameters((current) =>
      current.map((parameter, i) =>
        i === index ? { ...parameter, [field]: value } : parameter
      )
    );
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    // Ignore completely empty parameter rows
    const filledParameters = parameters.filter((p) => p.name.trim());

    const result = experimentSchema.safeParse({
      ...fields,
      parameters: filledParameters,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const { parameters: validParameters, ...experimentData } = result.data;

      const experiment = await createExperiment(experimentData);

      await Promise.all(
        validParameters.map((parameter) =>
          createExperimentParameters(parameter, experiment.id)
        )
      );

      setFields(initialFields);
      setParameters([emptyParameter()]);
      setMessage("Experiment created successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to create experiment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main>
      <div className="mb-8">
        <h1>Create an experiment</h1>

        <p className="mt-2 text-foreground/60">
          Create an experiment and define its parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <ExperimentSection
          values={fields}
          errors={errors}
          onChange={updateField}
        />

        <ParametersSection
          parameters={parameters}
          errors={errors}
          onAdd={addParameter}
          onRemove={removeParameter}
          onChange={updateParameter}
        />

        <div className="flex items-center justify-between gap-4">
          {message && <p>{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary ml-auto disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create experiment"}
          </button>
        </div>
      </form>
    </main>
  );
}