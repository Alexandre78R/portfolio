import React from "react";
import { render, screen } from "@testing-library/react";
import About from "../../../../../src/components/Terminal/components/Commands/About";
import "@testing-library/jest-dom";

// Mock du context useLang
jest.mock("../../../../../src/context/Lang/LangContext", () => ({
  useLang: () => ({
    translations: {
      titleAboutMe: "À propos de moi",
      descriptionAboutMe1: "Je suis développeur fullstack.",
      descriptionAboutMe2: "J'aime coder en React et Node.js.",
      descriptionAboutMe3: "Je travaille aussi sur des projets personnels.",
    },
  }),
}));

// Mock uniquement Message, pas About
jest.mock("../../../../../src/components/Terminal/components/Message", () => ({
  Message: ({ children }: any) => <div data-testid="message">{children}</div>,
}));

describe("About command component", () => {
  it("renders correctly with translations", () => {
    render(<About />);

    const messageWrapper: HTMLElement = screen.getByTestId("message");
    expect(messageWrapper).toBeInTheDocument();

    expect(screen.getByText("À propos de moi")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("À propos de moi");

    expect(screen.getByText("Je suis développeur fullstack.")).toBeInTheDocument();
    expect(screen.getByText("J'aime coder en React et Node.js.")).toBeInTheDocument();
    expect(screen.getByText("Je travaille aussi sur des projets personnels.")).toBeInTheDocument();
  });
});