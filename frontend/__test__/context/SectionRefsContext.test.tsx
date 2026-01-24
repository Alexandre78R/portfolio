import React, { ReactElement } from "react";
import { render, screen } from '@test-utils';
import "@testing-library/jest-dom";
import {
  SectionRefsProvider,
  useSectionRefs,
  SectionRefsContextProps,
} from "@/context/SectionRefs/SectionRefsContext";
import { TestComponentProps } from "./context.types";

const TestComponent: React.FC<TestComponentProps> = (): ReactElement => {
  const {
    aboutMeRef,
    projectRef,
    headerRef,
    skillRef,
    terminalRef,
    educationRef,
    contactRef,
  }: SectionRefsContextProps = useSectionRefs();

  const renderRefStatus: (ref: React.RefObject<HTMLDivElement>) => string = (ref: React.RefObject<HTMLDivElement>): string =>
    ref.current === null ? "null" : "defined";

  return (
    <div>
      <span data-testid="aboutMeRef">{renderRefStatus(aboutMeRef)}</span>
      <span data-testid="projectRef">{renderRefStatus(projectRef)}</span>
      <span data-testid="headerRef">{renderRefStatus(headerRef)}</span>
      <span data-testid="skillRef">{renderRefStatus(skillRef)}</span>
      <span data-testid="terminalRef">{renderRefStatus(terminalRef)}</span>
      <span data-testid="educationRef">{renderRefStatus(educationRef)}</span>
      <span data-testid="contactRef">{renderRefStatus(contactRef)}</span>
    </div>
  );
};

describe("SectionRefsContext", () => {
  it("provides all section refs with initial null values", (): void => {
    render(
      <SectionRefsProvider>
        <TestComponent />
      </SectionRefsProvider>
    );

    const aboutMeSpan: HTMLElement = screen.getByTestId("aboutMeRef");
    const projectSpan: HTMLElement = screen.getByTestId("projectRef");
    const headerSpan: HTMLElement = screen.getByTestId("headerRef");
    const skillSpan: HTMLElement = screen.getByTestId("skillRef");
    const terminalSpan: HTMLElement = screen.getByTestId("terminalRef");
    const educationSpan: HTMLElement = screen.getByTestId("educationRef");
    const contactSpan: HTMLElement = screen.getByTestId("contactRef");

    expect(aboutMeSpan).toHaveTextContent("null");
    expect(projectSpan).toHaveTextContent("null");
    expect(headerSpan).toHaveTextContent("null");
    expect(skillSpan).toHaveTextContent("null");
    expect(terminalSpan).toHaveTextContent("null");
    expect(educationSpan).toHaveTextContent("null");
    expect(contactSpan).toHaveTextContent("null");
  });

  it("throws an error when useSectionRefs is used outside provider", (): void => {
    const renderOutsideProvider = (): void => {
      render(<TestComponent />);
    };

    expect(renderOutsideProvider).toThrow(
      "useSectionRefs must be used within a SectionRefsProvider"
    );
  });
});
