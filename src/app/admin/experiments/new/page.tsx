"use client";

import { ExperimentFields, ExperimentSection } from "@/components/experiments/form/experiment-section";
import { ParametersSection } from "@/components/experiments/form/parameter-section";
import { useCreateExperiment } from "@/hooks/experiments/use-create-experiment";
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

export default function NewExperimentPage() {
  const [fields, setFields] = useState<ExperimentFields>(initialFields);
  const [parameters, setParameters] = useState<ParameterRequest[]>([
    emptyParameter(),
  ]);

  const {
    submitExperiment,
    errors,
    isSubmitting,
    message,
  } = useCreateExperiment();

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

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const success = await submitExperiment(fields, parameters);

    if (success) {
      setFields(initialFields);
      setParameters([emptyParameter()]);
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