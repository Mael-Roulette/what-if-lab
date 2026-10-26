"use client"

import { useEffect } from "react";

type ConfirmModalProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title: string;
  message?: string;
  variant?: "default" | "danger";
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
};

const confirmStyles = {
  default: "bg-foreground text-white hover:opacity-90",
  danger: "bg-red-800 text-white hover:bg-red-700",
};

export default function ConfirmModal({
  open,
  onConfirm,
  onClose,
  title,
  message,
  variant = "default",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isLoading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => !isLoading && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-lg font-semibold">
          {title}
        </h2>

        {message && <p className="mt-2 text-sm text-foreground/70">{message}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-foreground/15 px-4 py-2 text-sm hover:bg-foreground/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 ${confirmStyles[variant]}`}
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}