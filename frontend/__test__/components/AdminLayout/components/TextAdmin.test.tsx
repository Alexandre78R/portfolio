import React from "react";
import { render, screen } from "@testing-library/react";
import TextAdmin, { TextAdminType, TextAdminProps } from "@/components/AdminLayout/components/Text/TextAdmin";

describe("TextAdmin Component", () => {
  const types: Array<TextAdminType> = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"];

  it("renders children correctly", () => {
    const props: TextAdminProps = { type: "h1", children: "Hello World" };
    const element: React.ReactElement = <TextAdmin {...props} />;
    render(element);

    const childElement: HTMLElement = screen.getByText("Hello World") as HTMLElement;
    expect(childElement).toBeInTheDocument();
  });

  it("renders correct tag for each type", () => {
    types.forEach((type: TextAdminType) => {
      const props: TextAdminProps = { type, children: type };
      const { unmount }: { unmount: () => void } = render(<TextAdmin {...props} />);

      const element: HTMLElement = screen.getByText(type) as HTMLElement;
      expect(element.tagName.toLowerCase()).toBe(type);

      const typographyElement: HTMLElement | null = element.closest(".MuiTypography-root") as HTMLElement;
      expect(typographyElement).toBeInTheDocument();

      unmount();
    });
  });

  it("applies correct fontSize and color", () => {
    const fontSizeMap: Record<TextAdminType, string> = {
      h1: "2rem", h2: "1.75rem", h3: "1.5rem", h4: "1.25rem",
      h5: "1.125rem", h6: "1rem", p: "0.875rem", span: "0.75rem",
    };

    const colorMap: Record<TextAdminType, string> = {
      h1: "var(--primary-color)", h2: "var(--primary-color)", h3: "var(--primary-color)", h4: "var(--primary-color)",
      h5: "var(--primary-color)", h6: "var(--primary-color)", p: "var(--text-color)", span: "var(--text-color)",
    };

    types.forEach((type: TextAdminType) => {
      const props: TextAdminProps = { type, children: type };
      const { unmount }: { unmount: () => void } = render(<TextAdmin {...props} />);

      const element: HTMLElement = screen.getByText(type) as HTMLElement;

      expect(element).toHaveStyle(`font-size: ${fontSizeMap[type]}`);
      expect(element).toHaveStyle(`color: ${colorMap[type]}`);
      expect(element).toHaveStyle("font-weight: 700");

      unmount();
    });
  });
});