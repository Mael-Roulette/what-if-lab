import { FormField } from "@/components/form/form-field";
import { ExperimentStatus } from "@/types/experiment";

export type ExperimentFields = {
  title: string;
  description: string;
  status: ExperimentStatus;
};

type ExperimentSectionProps = {
  values: ExperimentFields;
  errors: Record<string, string>;
  onChange: <K extends keyof ExperimentFields>(
    field: K,
    value: ExperimentFields[K]
  ) => void;
};

export function ExperimentSection({
  values,
  errors,
  onChange,
}: ExperimentSectionProps) {
  return (
    <section className="rounded-xl border border-foreground/15 bg-white/60 p-6">
      <h2 className="mb-6 text-xl font-semibold text-blue">Experiment</h2>

      <div className="space-y-5">
        <FormField label="Title" htmlFor="title" error={errors["title"]}>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="Projectile Motion"
            className="w-full"
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors["description"]}
        >
          <textarea
            id="description"
            value={values.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Discover how projectile motion works..."
            rows={4}
            className="w-full"
          />
        </FormField>

        <FormField label="Status" htmlFor="status" error={errors["status"]}>
          <select
            id="status"
            value={values.status}
            onChange={(event) =>
              onChange("status", event.target.value as ExperimentStatus)
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </FormField>
      </div>
    </section>
  );
}