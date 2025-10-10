import React from "react";
import { render, screen, fireEvent, RenderResult } from "@testing-library/react";
import WhoamiSkills from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiSkills";
import { useSelector } from "react-redux";
import { useLang } from "@/context/Lang/LangContext";
import { SkillTab } from "@/components/Skills/typeSkills";

// 🔹 Mock des hooks et composants
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

jest.mock("@/components/Button/Button", () => {
  const MockButton = (props: { disable?: boolean; onClick?: () => void; text: string }): JSX.Element => (
    <button disabled={props.disable} onClick={props.onClick}>
      {props.text}
    </button>
  );
  MockButton.displayName = "MockButton";
  return { __esModule: true, default: MockButton };
});

jest.mock("@/components/Terminal/components/Message", () => ({
  Message: ({ children }: { children: React.ReactNode }): JSX.Element => <div>{children}</div>,
}));

describe("WhoamiSkills Component", () => {
  const mockSkills: SkillTab[] = [
    { id: 1, category: "Frontend", skills: { name: "React", image: "react.png" } },
    { id: 2, category: "Backend", skills: { name: "Node", image: "node.png" } },
    { id: 3, category: "Database", skills: { name: "MySQL", image: "mysql.png" } },
    { id: 4, category: "DevOps", skills: { name: "Docker", image: "docker.png" } },
  ];

  beforeEach(() => {
    const mockedUseSelector: jest.MockedFunction<typeof useSelector> = useSelector as jest.MockedFunction<typeof useSelector>;
    mockedUseSelector.mockReturnValue(mockSkills);

    const mockedUseLang: jest.MockedFunction<typeof useLang> = useLang as jest.MockedFunction<typeof useLang>;
    mockedUseLang.mockReturnValue({
      lang: "fr",
      setLang: jest.fn(),
      listLang: ["fr", "en"],
      translations: {
        buttonPaginationPrevious: "Previous",
        buttonPaginationNext: "Next",
      },
    });
  });

  const renderComponent = (): RenderResult => render(<WhoamiSkills />);

  it("renders first page of skills correctly", (): void => {
    const { getByText, queryByText } = renderComponent();

    const frontendCategory: HTMLElement = getByText("1. Frontend");
    const backendCategory: HTMLElement = getByText("2. Backend");
    const databaseCategory: HTMLElement = getByText("3. Database");
    const devopsCategory: HTMLElement | null = queryByText("4. DevOps");

    expect(frontendCategory).toBeInTheDocument();
    expect(backendCategory).toBeInTheDocument();
    expect(databaseCategory).toBeInTheDocument();
    expect(devopsCategory).toBeNull();
  });

  it("pagination next button works", (): void => {
    const { getByText, queryByText } = renderComponent();

    const nextBtn: HTMLButtonElement = getByText("Next") as HTMLButtonElement;
    fireEvent.click(nextBtn);

    const devopsCategory: HTMLElement = getByText("4. DevOps");
    expect(devopsCategory).toBeInTheDocument();

    expect(queryByText("1. Frontend")).toBeNull();
    expect(queryByText("2. Backend")).toBeNull();
    expect(queryByText("3. Database")).toBeNull();
  });

  it("pagination previous button works", (): void => {
    const { getByText } = renderComponent();

    const nextBtn: HTMLButtonElement = getByText("Next") as HTMLButtonElement;
    fireEvent.click(nextBtn);

    const prevBtn: HTMLButtonElement = getByText("Previous") as HTMLButtonElement;
    fireEvent.click(prevBtn);

    const frontendCategory: HTMLElement = getByText("1. Frontend");
    expect(frontendCategory).toBeInTheDocument();
  });

  it("disables previous button on first page", (): void => {
    const { getByText } = renderComponent();

    const prevBtn: HTMLButtonElement = getByText("Previous") as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);
  });

  it("disables next button on last page", (): void => {
    const { getByText } = renderComponent();

    const nextBtn: HTMLButtonElement = getByText("Next") as HTMLButtonElement;
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    expect(nextBtn.disabled).toBe(true);
  });
});