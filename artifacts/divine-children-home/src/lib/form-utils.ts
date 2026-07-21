import type { FieldErrors, FieldValues } from "react-hook-form";

/** Scroll to the first invalid field after validation failure */
export function scrollToFirstError<T extends FieldValues>(errors: FieldErrors<T>) {
  const firstKey = Object.keys(errors)[0];
  if (!firstKey) return;

  const el =
    document.querySelector(`[name="${firstKey}"]`) ??
    document.querySelector(`[id$="-form-item"][aria-invalid="true"]`) ??
    document.querySelector('[aria-invalid="true"]');

  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (el instanceof HTMLElement) {
    el.focus({ preventScroll: true });
  }
}
