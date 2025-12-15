import React from "react";
import { render, screen, RenderResult } from '@test-utils';
import About from "@/components/Terminal/components/Commands/About";
import "@testing-library/jest-dom";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang } => ({
    translations: {
      titleAboutMe: "À propos de moi",
      descriptionAboutMe1: "Je suis développeur fullstack.",
      descriptionAboutMe2: "J'aime coder en React et Node.js.",
      descriptionAboutMe3: "Je travaille aussi sur des projets personnels.",
    } as Lang,
  }),
}));

jest.mock("@/components/Terminal/components/Message", () => ({
  Message: ({ children }: { children: React.ReactNode }): JSX.Element => (
    <div data-testid="message">{children}</div>
  ),
}));

describe("About command component", () => {
  const renderComponent = (): RenderResult => render(<About />);

  it("renders correctly with translations", (): void => {
    renderComponent();

    const messageWrapper: HTMLElement = screen.getByTestId("message");
    expect(messageWrapper).toBeInTheDocument();

    const title: HTMLElement = screen.getByText("À propos de moi");
    expect(title).toBeInTheDocument();

    const heading: HTMLElement = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("À propos de moi");

    const desc1: HTMLElement = screen.getByText("Je suis développeur fullstack.");
    const desc2: HTMLElement = screen.getByText("J'aime coder en React et Node.js.");
    const desc3: HTMLElement = screen.getByText("Je travaille aussi sur des projets personnels.");

    expect(desc1).toBeInTheDocument();
    expect(desc2).toBeInTheDocument();
    expect(desc3).toBeInTheDocument();
  });
});
