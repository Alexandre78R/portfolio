import React from "react";
import { render, screen, fireEvent, RenderResult } from "@testing-library/react";
import { Form } from "../../../../src/components/Terminal/components/Form";
import "@testing-library/jest-dom";

describe("Form component", () => {
  const renderForm = (children: React.ReactNode, onSubmit: () => void): RenderResult =>
    render(
      <Form onSubmit={onSubmit}>
        {children}
      </Form> as React.ReactElement
    );

  it("renders children correctly", (): void => {
    renderForm(<span data-testid="child">Child Content</span>, () => {});

    const child: HTMLElement = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Child Content");
  });

  it("applies the correct CSS class", (): void => {
    const { container }: RenderResult = renderForm(<span>Test</span>, () => {});

    const formEl: HTMLFormElement | null = container.querySelector("form");
    expect(formEl).toBeInTheDocument();
    expect(formEl).toHaveClass("md:flex");
  });

  it("calls onSubmit when form is submitted", (): void => {
    const handleSubmit: jest.Mock = jest.fn();
    const { container }: RenderResult = renderForm(
      <button type="submit">Submit</button>,
      handleSubmit
    );

    const formEl: HTMLFormElement | null = container.querySelector("form");
    expect(formEl).not.toBeNull();

    if (formEl) fireEvent.submit(formEl);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});