import { type ReactElement } from "react";
import { render, RenderResult, screen } from '@test-utils';
import AuthFormLayout from "@/components/AuthFormLayout/AuthFormLayout";

describe("AuthFormLayout", () => {
  let renderResult: RenderResult;
  let titleElement: HTMLElement;
  let childElement: HTMLElement;

  it("renders the title correctly", (): void => {
    renderResult = render(
      <AuthFormLayout title="Login">
        <div>Form content</div>
      </AuthFormLayout>
    );

    titleElement = screen.getByText("Login") as HTMLElement;
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.tagName).toBe("H2");
    expect(titleElement).toHaveClass("text-2xl", "font-bold", "text-center", "mb-4", "text-primary");
  });

  it("renders children correctly", (): void => {
    renderResult = render(
      <AuthFormLayout title="Register">
        <button type="button">Submit</button>
      </AuthFormLayout>
    );

    childElement = screen.getByText("Submit") as HTMLButtonElement;
    expect(childElement).toBeInTheDocument();
    expect(childElement.tagName).toBe("BUTTON");
    expect(childElement).toHaveAttribute("type", "button");
  });

  it("renders layout structure with correct classes", (): void => {
    renderResult = render(
      <AuthFormLayout title="Auth">
        <p>Child</p>
      </AuthFormLayout>
    );

    const containerDiv: HTMLElement | null = renderResult.container.firstChild as HTMLElement;
    expect(containerDiv).not.toBeNull();
    expect(containerDiv).toHaveClass(
      "min-h-screen",
      "flex",
      "items-center",
      "justify-center"
    );

    const boxDiv: HTMLElement | null = renderResult.container.querySelector(".max-w-md");
    expect(boxDiv).not.toBeNull();
    expect(boxDiv).toHaveClass("max-w-md", "w-ful", "rounded", "shadow", "space-y-6", "bg-body");
  });

  it("renders multiple children correctly", (): void => {
    renderResult = render(
      <AuthFormLayout title="Multi">
        <>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
        </>
      </AuthFormLayout>
    );

    const usernameInput: HTMLInputElement = screen.getByPlaceholderText("Username") as HTMLInputElement;
    const passwordInput: HTMLInputElement = screen.getByPlaceholderText("Password") as HTMLInputElement;

    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});
