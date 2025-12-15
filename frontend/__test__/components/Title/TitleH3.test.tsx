import React, { ReactElement } from "react";
import { render, screen } from '@test-utils';
import TitleH3, { TitleH3Props } from "@/components/Title/TitleH3";

describe("TitleH3 component", () => {
  const titleText: string = "Test Title";

  it("renders the title inside h3 Typography", (): void => {
    const props: TitleH3Props = { title: titleText };
    render(<TitleH3 {...props} /> as ReactElement);

    const headingElement: HTMLElement = screen.getByText(titleText) as HTMLElement;
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe("H3");
  });

  it("applies MUI Typography styling correctly", (): void => {
    const props: TitleH3Props = { title: titleText };
    render(<TitleH3 {...props} /> as ReactElement);

    const headingElement: HTMLElement = screen.getByText(titleText) as HTMLElement;

    expect(headingElement).toHaveStyle("font-weight: 700");
    expect(headingElement).toHaveStyle("font-size: 2rem");
    expect(headingElement).toHaveStyle("color: var(--text-color)");
  });

  it("is wrapped inside a Box component", (): void => {
    const props: TitleH3Props = { title: titleText };
    const { container } = render(<TitleH3 {...props} /> as ReactElement);

    const boxElement: HTMLElement | null = container.firstChild as HTMLElement | null;
    expect(boxElement).toBeInTheDocument();
  });
});
