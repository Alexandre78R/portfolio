import React from "react";
import { render, screen, fireEvent, waitFor } from '@test-utils';
import Custom404 from "@/pages/404";
import { useLang } from "@/context/Lang/LangContext";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";
import Lang from "@/lang/typeLang";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

interface MockRouter {
  push: jest.Mock;
}

describe("Custom404 Component", () => {
  let mockRouter: MockRouter;
  let mockTranslations: Lang;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockTranslations = {
      titleHTMLNotFound: "Page Not Found - Portfolio",
      messagePageNotFoundH1: "Oops! Page not found",
      messagePageNotFoundP: "Sorry, the page you are looking for does not exist.",
      messagePageNotFoundButtom: "Go Home",
    } as Lang;
    (useLang as jest.Mock).mockReturnValue({ translations: mockTranslations });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the 404 page with correct texts and SVG", () => {
    render(<Custom404 />);

    const h1: HTMLElement = screen.getByText(mockTranslations.messagePageNotFoundH1);
    expect(h1).toBeInTheDocument();

    const p: HTMLElement = screen.getByText(mockTranslations.messagePageNotFoundP);
    expect(p).toBeInTheDocument();

    const button: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageNotFoundButtom,
    });
    expect(button).toBeInTheDocument();

    const svg: SVGSVGElement | null = screen.getByText("404")?.closest("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have a button that links to home page", () => {
    render(<Custom404 />);
    const button: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageNotFoundButtom,
    });

    expect(button.closest("a")).toHaveAttribute("href", "/");
  });
});
