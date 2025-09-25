import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  SectionRefsProvider,
  useSectionRefs,
} from "@/context/SectionRefs/SectionRefsContext";

type TestComponentProps = Record<string, never>;

const TestComponent: React.FC<TestComponentProps> = (): React.ReactElement => {
  const {
    aboutMeRef,
    projectRef,
    headerRef,
    skillRef,
    terminalRef,
    educationRef,
    contactRef,
  } = useSectionRefs();

  return (
    <div>
      <span data-testid="aboutMeRef">
        {aboutMeRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="projectRef">
        {projectRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="headerRef">
        {headerRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="skillRef">
        {skillRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="terminalRef">
        {terminalRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="educationRef">
        {educationRef.current === null ? "null" : "defined"}
      </span>
      <span data-testid="contactRef">
        {contactRef.current === null ? "null" : "defined"}
      </span>
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

    expect(screen.getByTestId("aboutMeRef")).toHaveTextContent("null");
    expect(screen.getByTestId("projectRef")).toHaveTextContent("null");
    expect(screen.getByTestId("headerRef")).toHaveTextContent("null");
    expect(screen.getByTestId("skillRef")).toHaveTextContent("null");
    expect(screen.getByTestId("terminalRef")).toHaveTextContent("null");
    expect(screen.getByTestId("educationRef")).toHaveTextContent("null");
    expect(screen.getByTestId("contactRef")).toHaveTextContent("null");
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