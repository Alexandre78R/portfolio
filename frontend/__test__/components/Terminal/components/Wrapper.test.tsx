import React from "react";
import { render, screen } from '@test-utils';
import { Wrapper } from "../../../../src/components/Terminal/components/Wrapper";

describe("Wrapper component", () => {
  test("renders children correctly", (): void => {
    render(
      <Wrapper>
        <span data-testid="child">Hello World</span>
      </Wrapper>
    );

    const child: HTMLElement = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Hello World");
  });

  test("applies correct Tailwind classes", (): void => {
    const { container }: { container: HTMLElement } = render(
      <Wrapper>
        <div />
      </Wrapper>
    );

    const wrapperDiv: HTMLElement | null = container.firstChild as HTMLElement;

    expect(wrapperDiv).toBeInTheDocument();
    expect(wrapperDiv).toHaveClass(
      "flex",
      "flex-col-reverse",
      "w-[100%]",
      "md:w-[70%]",
      "lg:w-[70%]",
      "h-[460px]",
      "overflow-y-auto",
      "text-text"
    );
  });
});
