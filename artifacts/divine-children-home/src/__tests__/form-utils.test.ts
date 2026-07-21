import { describe, expect, it, vi } from "vitest";
import { scrollToFirstError } from "@/lib/form-utils";

describe("scrollToFirstError", () => {
  it("does not throw when no errors", () => {
    expect(() => scrollToFirstError({})).not.toThrow();
  });

  it("focuses first invalid field when present", () => {
    document.body.innerHTML = `<input name="email" aria-invalid="true" />`;
    const input = document.querySelector('input[name="email"]') as HTMLInputElement;
    input.scrollIntoView = vi.fn();
    const focusSpy = vi.spyOn(input, "focus");

    scrollToFirstError({ email: { type: "required", message: "Required" } });

    expect(focusSpy).toHaveBeenCalled();
  });
});
