import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Router } from "wouter";
import { FormSuccessPanel } from "@/components/common/FormSuccessPanel";

function renderPanel(props: ComponentProps<typeof FormSuccessPanel>) {
  return render(
    <Router>
      <FormSuccessPanel {...props} />
    </Router>,
  );
}

describe("FormSuccessPanel", () => {
  it("renders title and message", () => {
    renderPanel({
      title: "Message sent",
      message: "We will respond shortly.",
    });
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Message sent")).toBeInTheDocument();
    expect(screen.getByText("We will respond shortly.")).toBeInTheDocument();
  });

  it("shows reference number when provided", () => {
    renderPanel({
      title: "Referral submitted",
      message: "Thank you.",
      referenceNumber: "REF-12345",
    });
    expect(screen.getByText(/REF-12345/)).toBeInTheDocument();
  });
});
