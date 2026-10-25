import { FormField } from "@/components/form/form-field";
import { ParameterRequest } from "@/types";

type ParameterCardProps = {
  index: number;
  parameter: ParameterRequest;
  errors: Record<string, string>;
  canRemove: boolean;
  onChange: (
    index: number,
    field: keyof ParameterRequest,
    value: string
  ) => void;
  onRemove: (index: number) => void;
};

const TEXT_FIELDS: {
  field: "unit" | "default" | "min" | "max";
  label: string;
  placeholder: string;
}[] = [
  { field: "unit", label: "Unit", placeholder: "m/s" },
  { field: "default", label: "Default", placeholder: "20" },
  { field: "min", label: "Minimum", placeholder: "1" },
  { field: "max", label: "Maximum", placeholder: "100" },
];

export function ParameterCard({
  index,
  parameter,
  errors,
  canRemove,
  onChange,
  onRemove,
}: ParameterCardProps) {
  const inputId = (field: string) => `parameter-${index}-${field}`;
  const errorFor = (field: string) => errors[`parameters.${index}.${field}`];

  return (
    <div className="rounded-lg border border-foreground/15 bg-background p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium">Parameter {index + 1}</h3>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="link text-red-700"
          >
            Remove
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FormField
          label="Name"
          htmlFor={inputId("name")}
          error={errorFor("name")}
        >
          <input
            id={inputId("name")}
            type="text"
            value={parameter.name}
            onChange={(event) => onChange(index, "name", event.target.value)}
            placeholder="Initial speed"
            className="w-full"
          />
        </FormField>

        <FormField
          label="Type"
          htmlFor={inputId("type")}
          error={errorFor("type")}
        >
          <select
            id={inputId("type")}
            value={parameter.type}
            onChange={(event) => onChange(index, "type", event.target.value)}
            className="w-full"
          >
            <option value="number">Number</option>
            <option value="float">Float</option>
            <option value="string">String</option>
          </select>
        </FormField>

        {TEXT_FIELDS.map(({ field, label, placeholder }) => (
          <FormField
            key={field}
            label={label}
            htmlFor={inputId(field)}
            error={errorFor(field)}
          >
            <input
              id={inputId(field)}
              type="text"
              value={parameter[field]}
              onChange={(event) => onChange(index, field, event.target.value)}
              placeholder={placeholder}
              className="w-full"
            />
          </FormField>
        ))}
      </div>
    </div>
  );
}