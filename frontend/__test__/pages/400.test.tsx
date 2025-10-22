import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Custom400 from "@/pages/400";
import { useLang } from "@/context/Lang/LangContext";
import { useRouter, NextRouter } from "next/router";
import "@testing-library/jest-dom";
import Lang from "@/lang/typeLang";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

interface MockRouter extends Partial<NextRouter> {
  push: jest.Mock;
}

describe("Custom400 Component", () => {
  let mockRouter: MockRouter;
  let mockTranslations: Lang;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockTranslations = {
      titleHTMLUnauthorizedAccess: "Unauthorized Access - Portfolio",
      messagePageUnauthorizedH1: "Access Denied",
      messagePageUnauthorizedP: "You do not have permission to view this page.",
      messagePageUnauthorizedButtom: "Go Home",
    } as Lang;
    (useLang as jest.Mock).mockReturnValue({ translations: mockTranslations });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the 400 page with correct texts and SVG", (): void => {
    render(<Custom400 />);

    const h1: HTMLElement = screen.getByText(mockTranslations.messagePageUnauthorizedH1);
    expect(h1).toBeInTheDocument();

    const p: HTMLElement = screen.getByText(mockTranslations.messagePageUnauthorizedP);
    expect(p).toBeInTheDocument();

    const button: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageUnauthorizedButtom,
    });
    expect(button).toBeInTheDocument();

    const svg: SVGSVGElement | null = screen.getByText("400")?.closest("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should redirect to /400 on mount", async (): Promise<void> => {
    render(<Custom400 />);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/400");
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
    });
  });

  it("should navigate to home when button is clicked", async (): Promise<void> => {
    render(<Custom400 />);
    const button: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageUnauthorizedButtom,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/400");
    });
  });

  it("should have the correct title in Head (mocked)", (): void => {
    render(<Custom400 />);
    expect(mockTranslations.titleHTMLUnauthorizedAccess).toBe(
      "Unauthorized Access - Portfolio"
    );
  });
});