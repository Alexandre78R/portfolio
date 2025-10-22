import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Custom404 from "@/pages/404";
import { useLang } from "@/context/Lang/LangContext";
import { useRouter } from "next/router";
import "@testing-library/jest-dom";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

interface MockRouter {
  push: jest.Mock;
}
interface MockTranslations {
  titleHTMLNotFound: string;
  messagePageNotFoundH1: string;
  messagePageNotFoundP: string;
  messagePageNotFoundButtom: string;
}

describe("Custom404 Component", () => {
  let mockRouter: MockRouter;
  let mockTranslations: MockTranslations;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    mockTranslations = {
      titleHTMLNotFound: "Page Not Found - Portfolio",
      messagePageNotFoundH1: "Oops! Page not found",
      messagePageNotFoundP: "Sorry, the page you are looking for does not exist.",
      messagePageNotFoundButtom: "Go Home",
    };
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

  it("should redirect to /404 on mount", async () => {
    render(<Custom404 />);
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/404");
      expect(mockRouter.push).toHaveBeenCalledTimes(1);
    });
  });

  it("should navigate to home when button is clicked", async () => {
    render(<Custom404 />);
    const button: HTMLButtonElement = screen.getByRole("button", {
      name: mockTranslations.messagePageNotFoundButtom,
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/404");
    });
  });
});