export function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-red-700">{message}</p> : null;
}