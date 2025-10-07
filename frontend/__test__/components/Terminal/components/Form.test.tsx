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

    const child: HTMLElement = screen.getByTestId("child" as string);
    expect(child as HTMLElement).toBeInTheDocument();
    expect(child as HTMLElement).toHaveTextContent("Child Content" as string);
  });

  it("applies the correct CSS class", () => {
    const { container }: { container: HTMLElement } = render(
      <Form onSubmit={() => {}}>
        <span>Test</span>
      </Form>
    );

    const formEl: HTMLElement | null = container.querySelector("form");
    expect(formEl as HTMLElement).toBeInTheDocument();
    expect(formEl as HTMLElement).toHaveClass("md:flex" as string);
  });

  it("calls onSubmit when form is submitted", () => {
    const handleSubmit: jest.Mock = jest.fn();
    const { container }: { container: HTMLElement } = render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </Form>
    );

    const formEl: HTMLElement | null = container.querySelector("form");
    fireEvent.submit(formEl! as HTMLElement);

    expect(handleSubmit as jest.Mock).toHaveBeenCalledTimes(1 as const);
  });
});