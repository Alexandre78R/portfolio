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

    expect(screen.getByText("Login" as string)).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    render(
      <AuthFormLayout title="Register">
        <button>Submit</button>
      </AuthFormLayout>
    );

    expect(screen.getByText("Submit" as string)).toBeInTheDocument();
  });

  it("renders layout structure", () => {
    const { container }: RenderResult = render(
      <AuthFormLayout title="Auth">
        <p>Child</p>
      </AuthFormLayout>
    );

    expect(container.firstChild).toHaveClass(
      "min-h-screen" as string,
      "flex" as string,
      "items-center" as string,
      "justify-center" as string
    );
  });
});