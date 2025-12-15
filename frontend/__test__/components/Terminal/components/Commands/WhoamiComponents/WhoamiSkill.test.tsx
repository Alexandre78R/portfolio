import React, { ReactElement } from "react";
import { render, screen, fireEvent, RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import WhoamiSkills from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiSkills";
import { useSelector } from "react-redux";
import { useLang } from "@/context/Lang/LangContext";
import { SkillTab } from "@/components/Skills/typeSkills";

interface SkillTabData extends SkillTab {
  id: number;
  category: string;
  skills: { name: string; image: string };
}

interface LangContextType {
  lang: string;
  setLang: (lang: string) => void;
  listLang: string[];
  translations: {
    buttonPaginationPrevious: string;
    buttonPaginationNext: string;
  };
}

jest.mock("react-redux", (): object => ({
  useSelector: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", (): object => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/Button/Button", (): object => {
  const MockButton = (props: {
    disable?: boolean;
    onClick?: () => void;
    text: string;
  }): ReactElement => (
    <button disabled={props.disable} onClick={props.onClick}>
      {props.text}
    </button>
  );
  MockButton.displayName = "MockButton";
  return { __esModule: true, default: MockButton };
});

jest.mock("@/components/Terminal/components/Message", (): object => ({
  Message: ({ children }: { children: React.ReactNode }): ReactElement => (
    <div>{children}</div>
  ),
}));

const mockSkills: SkillTabData[] = [
  {
    id: 1,
    category: "Frontend",
    skills: { name: "React", image: "react.png" },
  },
  {
    id: 2,
    category: "Backend",
    skills: { name: "Node", image: "node.png" },
  },
  {
    id: 3,
    category: "Database",
    skills: { name: "MySQL", image: "mysql.png" },
  },
  {
    id: 4,
    category: "DevOps",
    skills: { name: "Docker", image: "docker.png" },
  },
];

const mockLangContext: LangContextType = {
  lang: "fr",
  setLang: jest.fn(),
  listLang: ["fr", "en"],
  translations: {
    buttonPaginationPrevious: "Previous",
    buttonPaginationNext: "Next",
  },
};

function getButton(text: string): HTMLButtonElement {
  const element: HTMLElement | null = screen.queryByText(text);
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error(`Button with text '${text}' not found`);
  }
  return element;
}
describe("WhoamiSkills Component", (): void => {
  beforeEach((): void => {
    jest.clearAllMocks();

    const mockedUseSelector: jest.MockedFunction<typeof useSelector> =
      useSelector as jest.MockedFunction<typeof useSelector>;
    mockedUseSelector.mockReturnValue(mockSkills);

    const mockedUseLang: jest.MockedFunction<typeof useLang> =
      useLang as jest.MockedFunction<typeof useLang>;
    mockedUseLang.mockReturnValue(mockLangContext as unknown as import("@/context/Lang/LangContext").LangContextType);
  });

  const renderComponent = (): RenderResult => render(<WhoamiSkills />);

  it("renders first page of skills correctly", (): void => {
    const { getByText, queryByText }: RenderResult = renderComponent();

    const frontendCategory: HTMLElement = getByText("1. Frontend");
    const backendCategory: HTMLElement = getByText("2. Backend");
    const databaseCategory: HTMLElement = getByText("3. Database");
    const devopsCategory: HTMLElement | null = queryByText("4. DevOps");

    expect(frontendCategory).toBeInTheDocument();
    expect(backendCategory).toBeInTheDocument();
    expect(databaseCategory).toBeInTheDocument();
    expect(devopsCategory).not.toBeInTheDocument();
  });

  it("pagination next button works", (): void => {
    const { getByText, queryByText }: RenderResult = renderComponent();

    const nextBtn: HTMLButtonElement = getButton("Next");
    fireEvent.click(nextBtn);

    const devopsCategory: HTMLElement = getByText("4. DevOps");
    expect(devopsCategory).toBeInTheDocument();

    expect(queryByText("1. Frontend")).not.toBeInTheDocument();
    expect(queryByText("2. Backend")).not.toBeInTheDocument();
    expect(queryByText("3. Database")).not.toBeInTheDocument();
  });

  it("pagination previous button works", (): void => {
    const { getByText }: RenderResult = renderComponent();

    const nextBtn: HTMLButtonElement = getButton("Next");
    fireEvent.click(nextBtn);

    const prevBtn: HTMLButtonElement = getButton("Previous");
    fireEvent.click(prevBtn);

    const frontendCategory: HTMLElement = getByText("1. Frontend");
    expect(frontendCategory).toBeInTheDocument();
  });

  it("disables previous button on first page", (): void => {
    const { getByText }: RenderResult = renderComponent();

    const prevBtn: HTMLButtonElement = getButton("Previous");
    expect(prevBtn.disabled).toBe(true);
  });

  it("disables next button on last page", (): void => {
    const { getByText }: RenderResult = renderComponent();

    const nextBtn: HTMLButtonElement = getButton("Next");
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(nextBtn.disabled).toBe(true);
  });
});
