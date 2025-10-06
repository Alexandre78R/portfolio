import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "../../../../src/components/Terminal/components/Form";
import "@testing-library/jest-dom";

describe("Form component", () => {
  it("renders children correctly", () => {
    render(
      <Form onSubmit={() => {}}>
        <span data-testid="child">Child Content</span>
      </Form>
    );

    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Child Content");
  });

  it("applies the correct CSS class", () => {
    const { container } = render(
      <Form onSubmit={() => {}}>
        <span>Test</span>
      </Form>
    );

    const formEl = container.querySelector("form");
    expect(formEl).toBeInTheDocument();
    expect(formEl).toHaveClass("md:flex");
  });

  it("calls onSubmit when form is submitted", () => {
    const handleSubmit = jest.fn();
    const { container } = render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    const formEl = container.querySelector("form")!;
    fireEvent.submit(formEl);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});