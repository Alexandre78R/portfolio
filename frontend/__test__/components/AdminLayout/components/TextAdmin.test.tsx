import React from "react";
import { render, screen } from "@testing-library/react";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";

describe("TextAdmin Component", () => {
  const types: Array<React.ComponentProps<typeof TextAdmin>["type"]> = [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"
  ];

  it("renders children correctly", () => {
    render(<TextAdmin type="h1">Hello World</TextAdmin>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders correct variant and component for each type", () => {
    types.forEach((type) => {
      const { unmount }: { unmount: () => void } = render(<TextAdmin type={type}>{type}</TextAdmin>);
      const element: HTMLElement = screen.getByText(type) as HTMLElement;

      expect(element.tagName.toLowerCase()).toBe(type);

      const typography: HTMLElement | null = element.closest('.MuiTypography-root');
      expect(typography).toBeInTheDocument();

      unmount();
    });
  });

  it("applies correct fontSize and color", () => {
    const typeFontSizeMap: Record<typeof types[number], string> = {
      h1: "2rem" as string,
      h2: "1.75rem" as string,
      h3: "1.5rem" as string,
      h4: "1.25rem" as string,
      h5: "1.125rem" as string,
      h6: "1rem" as string,
      p: "0.875rem" as string,
      span: "0.75rem" as string,
    };

    const typeColorMap: Record<typeof types[number], string> = {
      h1: "var(--primary-color)" as string,
      h2: "var(--primary-color)" as string,
      h3: "var(--primary-color)" as string,
      h4: "var(--primary-color)" as string,
      h5: "var(--primary-color)" as string,
      h6: "var(--primary-color)" as string,
      p: "var(--text-color)" as string,
      span: "var(--text-color)" as string,
    };

    types.forEach((type) => {
      const { unmount }: { unmount: () => void } = render(<TextAdmin type={type}>{type}</TextAdmin>);
      const element: HTMLElement = screen.getByText(type) as HTMLElement;
      expect(element).toHaveStyle(`font-size: ${typeFontSizeMap[type]}`);
      expect(element).toHaveStyle(`color: ${typeColorMap[type]}`);
      // expect(element).toHaveStyle("font-weight: bold");
      expect(element).toHaveStyle("font-weight: 700");
      unmount();
    });
  });
});