import React from "react";
import { render, screen } from "@testing-library/react";
import About from "../../../../../src/components/Terminal/components/Commands/About";
import "@testing-library/jest-dom";

// Mock du context useLang
jest.mock("../../../../../src/context/Lang/LangContext", () => ({
  useLang: () => ({
    translations: {
      titleAboutMe: "À propos de moi" as const,
      descriptionAboutMe1: "Je suis développeur fullstack." as const,
      descriptionAboutMe2: "J'aime coder en React et Node.js." as const,
      descriptionAboutMe3: "Je travaille aussi sur des projets personnels." as const,
    } as const,
  } as const),
}as const));

// Mock uniquement Message, pas About
jest.mock("../../../../../src/components/Terminal/components/Message", () => ({
  Message: ({ children }: any) => <div data-testid="message">{children}</div>,
}));

describe("About command component", () => {
  it("renders correctly with translations", () => {
    render(<About /> as React.ReactElement);

    const messageWrapper: HTMLElement = screen.getByTestId("message"as const);
    expect(messageWrapper as HTMLElement).toBeInTheDocument();

    expect(screen.getByText("À propos de moi" as const)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 } as const)).toHaveTextContent("À propos de moi");

    expect(screen.getByText("Je suis développeur fullstack." as const)).toBeInTheDocument();
    expect(screen.getByText("J'aime coder en React et Node.js." as const)).toBeInTheDocument();
    expect(screen.getByText("Je travaille aussi sur des projets personnels." as const)).toBeInTheDocument();
  });
});