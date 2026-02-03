import { type ReactElement } from "react";
import { render, screen } from '@test-utils';
import TitleH2, { TitleH2Props } from "@/components/Title/TitleH2";

describe("TitleH2 component", () => {
  const titleText: string = "Heading H2";

  it("renders the title inside h2 Typography", (): void => {
    const props: TitleH2Props = { title: titleText };
    render(<TitleH2 {...props} /> as ReactElement);

    const headingElement: HTMLElement = screen.getByText(titleText) as HTMLElement;

    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe("H2");
  });

  it("applies MUI Typography styling correctly", (): void => {
    const props: TitleH2Props = { title: titleText };
    render(<TitleH2 {...props} /> as ReactElement);

    const headingElement: HTMLElement = screen.getByText(titleText) as HTMLElement;

    expect(headingElement).toHaveStyle("font-weight: 700");
    expect(headingElement).toHaveStyle("font-size: 2rem");
    expect(headingElement).toHaveStyle("color: var(--text-color)");
  });

  it("is wrapped inside a Box component", (): void => {
    const props: TitleH2Props = { title: titleText };
    const { container } = render(<TitleH2 {...props} /> as ReactElement);

    const boxElement: HTMLElement | null = container.firstChild as HTMLElement | null;
    expect(boxElement).toBeInTheDocument();
  });
});
