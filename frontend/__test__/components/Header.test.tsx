import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header/Header";
import themes from "@/context/Theme/themes";

const translationsMock: Record<string, string> = {
  headerTitle: "Bienvenue sur mon portfolio",
} as const;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({ translations: translationsMock as Record<string, string> }),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark" as string }),
}));

const headerRefMock: React.RefObject<HTMLElement> = { current: null };
jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  useSectionRefs: () => ({ headerRef: headerRefMock as React.RefObject<HTMLElement> }),
}));

jest.mock("@/components/ui/SparklesCore", () => ({
  SparklesCore: (props: Record<string, unknown>) => <div data-testid="sparkles" {...props} />,
}));

describe("Header component", () => {
  it("renders the header title from translations", () => {
    render(<Header />);
    const title: HTMLElement = screen.getByText(translationsMock.headerTitle);
    expect(title).toBeInTheDocument();
  });

  it("passes correct theme color to SparklesCore", () => {
    render(<Header />);
    const sparkles: HTMLElement = screen.getByTestId("sparkles");
    expect(sparkles).toHaveAttribute(
      "particleColor",
      themes["dark"].colors.primary as string
    );
  });

  it("renders header element with correct ref", () => {
    render(<Header />);
    const headerEl: HTMLElement = screen.getByRole("banner");
    expect(headerEl).toBeInTheDocument();
  });
});