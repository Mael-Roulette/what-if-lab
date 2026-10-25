import { ParameterRequest } from "@/types";
import { ParameterCard } from "./parameter-card";

type ParametersSectionProps = {
  parameters: ParameterRequest[];
  errors: Record<string, string>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (
    index: number,
    field: keyof ParameterRequest,
    value: string
  ) => void;
};

export function ParametersSection({
  parameters,
  errors,
  onAdd,
  onRemove,
  onChange,
}: ParametersSectionProps) {
  return (
    <section className="rounded-xl border border-foreground/15 bg-white/60 p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-blue">Parameters</h2>

          <p className="mt-1 text-foreground/60">
            Define the values that users will be able to change in the
            experiment.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="btn-secondary shrink-0"
        >
          + Add parameter
        </button>
      </div>

      <div className="space-y-6">
        {parameters.map((parameter, index) => (
          <ParameterCard
            key={index}
            index={index}
            parameter={parameter}
            errors={errors}
            canRemove={parameters.length > 1}
            onChange={onChange}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  );
}