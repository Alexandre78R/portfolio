import React from "react";
import { render, RenderResult, screen } from "@testing-library/react";
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";

describe("AuthFormLayout", () => {
  it("renders the title", () => {
    render(
      <AuthFormLayout title="Login">
        <div>Form content</div>
      </AuthFormLayout>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(
      <AuthFormLayout title="Register">
        <button>Submit</button>
      </AuthFormLayout>
    );

    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders layout structure", () => {
    const { container }: RenderResult = render(
      <AuthFormLayout title="Auth">
        <p>Child</p>
      </AuthFormLayout>
    );

    expect(container.firstChild).toHaveClass(
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center"
    );
  });
});