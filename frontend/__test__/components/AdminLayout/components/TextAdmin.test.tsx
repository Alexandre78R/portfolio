import React from "react";
import { render, screen } from "@testing-library/react";
import TextAdmin from "@/components/AdminLayout/components/Text/TextAdmin";

describe("TextAdmin Component", () => {
  const types: Array<React.ComponentProps<typeof TextAdmin>["type"]> = [
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "span"
  ] as const;

  it("renders children correctly", () => {
    render(<TextAdmin type="h1">Hello World</TextAdmin> as React.ReactElement);
    expect(screen.getByText("Hello World" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders correct variant and component for each type", () => {
    types.forEach((type) => {
      const { unmount }: { unmount: () => void } = render(<TextAdmin type={type}>{type}</TextAdmin>);
      const element: HTMLElement = screen.getByText(type) as HTMLElement;

      expect(element.tagName.toLowerCase() as string).toBe(type);

      const typography: HTMLElement | null = element.closest('.MuiTypography-root' as string) as HTMLElement;
      expect(typography as HTMLElement).toBeInTheDocument();

      unmount() as void;
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
      expect(element as HTMLElement).toHaveStyle(`font-size: ${typeFontSizeMap[type]}` as string);
      expect(element as HTMLElement).toHaveStyle(`color: ${typeColorMap[type]}` as string);
      // expect(element).toHaveStyle("font-weight: bold");
      expect(element as HTMLElement).toHaveStyle("font-weight: 700" as string);
      unmount() as void;
    });
  });
});