import type { ReactNode } from "react";
import { FieldError } from "./field-error";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block font-medium">
        {label}
      </label>

      {children}

      <FieldError message={error} />
    </div>
  );
}