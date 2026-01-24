import React, { ReactElement } from "react";
import { render, screen, fireEvent, RenderResult } from '@test-utils';
import "@testing-library/jest-dom";
import WhoamiSkills from "@/components/Terminal/components/Commands/WhoamiComponents/WhoamiSkills";
import { SkillTab } from "@/components/Skills/typeSkills";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import skillsReducer from "@/store/slices/skillsSlice";
import { useLang } from "@/context/Lang/LangContext";

interface SkillTabData extends SkillTab {
  id: number;
  category: string;
  skills: { name: string; image: string };
}

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
  MockButton.displayName = "ButtonCustom";
  return MockButton;
});

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

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

function getButton(text: string): HTMLButtonElement {
  const element: HTMLElement | null = screen.queryByText(text);
  if (!element || !(element instanceof HTMLButtonElement)) {
    throw new Error(`Button with text '${text}' not found`);
  }
  return element;
}

describe("WhoamiSkills Component", (): void => {
  const renderComponent = (): RenderResult => {
    const store = configureStore({
      reducer: {
        skills: skillsReducer,
      },
      preloadedState: {
        skills: {
          dataSkills: mockSkills,
        },
      },
    });

    return render(
      <Provider store={store}>
        <WhoamiSkills />
      </Provider>
    );
  };

  beforeEach((): void => {
    jest.clearAllMocks();

    (useLang as jest.Mock).mockReturnValue({
      translations: {
        buttonPaginationPrevious: "Previous",
        buttonPaginationNext: "Next",
      },
      lang: "en",
    });
  });

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
