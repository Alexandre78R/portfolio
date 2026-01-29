import React from "react";
import { render, screen, RenderResult } from '@test-utils';
import About from "@/components/Terminal/components/Commands/About";
import "@testing-library/jest-dom";
import Lang from "@/lang/typeLang";

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): { translations: Lang; lang: string } => ({
    translations: {
      titleAboutMe: "<h3 class='text-title font-bold text-2xl mb-4'>À propos de moi</h3>",
      descriptionAboutMe: "Je suis développeur fullstack. J'aime coder en React et Node.js. Je travaille aussi sur des projets personnels.",
    } as Lang,
    lang: "fr",
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

    const title: HTMLElement = screen.getByText(/À propos de moi/);
    expect(title).toBeInTheDocument();

    const description: HTMLElement = screen.getByText(/Je suis développeur fullstack/);
    expect(description).toBeInTheDocument();
  });
});
