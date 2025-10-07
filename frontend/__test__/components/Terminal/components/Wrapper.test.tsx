import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Wrapper } from "../../../../src/components/Terminal/components/Wrapper";

describe("Wrapper component", () => {
  test("renders children correctly", () => {
    render(
      <Wrapper>
        <span data-testid="child">Hello World</span>
      </Wrapper>
    );

    const child: HTMLElement = screen.getByTestId("child");
    expect(child as HTMLElement).toBeInTheDocument();
    expect(child as HTMLElement).toHaveTextContent("Hello World" as string);
  });

  test("applies correct Tailwind classes", () => {
    const { container }: { container: HTMLElement } = render(
      <Wrapper>
        <div />
      </Wrapper>
    );

    const wrapperDiv: HTMLElement = container.firstChild as HTMLElement;
    expect(wrapperDiv as HTMLElement).toHaveClass(
      "flex" as string,
      "flex-col-reverse" as string,
      "w-[100%]" as string,
      "md:w-[70%]" as string,
      "lg:w-[70%]" as string,
      "h-[460px]" as string,
      "overflow-y-auto" as string,
      "text-text" as string
    );
  });
});