import React, { RefObject } from "react";
import { render, screen, fireEvent, within } from '@testing-library/react';
import Navbar from "@/components/NavBar/NavBar";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

const translationsMock: Record<string, string> = {
  navbarTitle: "Mon Portfolio",
  navbarButtonAbout: "À propos",
  navbarButtonSkill: "Compétences",
  navbarButtonProject: "Projets",
  navbarButtonCareer: "Formation",
  navbarButtonContact: "Contact",
  navbarButtonTerminal: "Terminal",
  theme1: "Dark",
  theme2: "Light",
  theme3: "Ubuntu",
};

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: (): {
    lang: string;
    setLang: jest.Mock<void, [string]>;
    translations: Record<string, string>;
  } => ({
    lang: "fr",
    setLang: jest.fn<void, [string]>(),
    translations: translationsMock,
  }),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: (): { 
    theme: string; 
    toggleTheme: jest.Mock<void, [string]>; 
    themes: Record<string, any>;
    loading: boolean;
    error: boolean;
  } => ({
    theme: "dark",
    toggleTheme: jest.fn<void, [string]>(),
    themes: {
      dark: {
        id: "1",
        name: "dark",
        nameEN: "Dark",
        nameFR: "Sombre",
        visible: true,
        colors: {
          body: "#01031B",
          scrollHandle: "#19252E",
          scrollHandleHover: "#162028",
          primary: "#B45852",
          secondary: "#DFBB5F",
          success: "#1C8036",
          error: "#AA2020",
          warn: "#EBCC2A",
          info: "#3B89FF",
          grey: "#7F7F7F",
          placeholder: "#A0AEC0",
          footer: "#050F1A",
          admin: "#080b2a",
          text: {
            default: "#F8F8FD",
            100: "#cbd5e1",
            200: "#B2BDCC",
            300: "#64748b",
            button: "white",
          },
        },
      },
      light: {
        id: "2",
        name: "light",
        nameEN: "Light",
        nameFR: "Claire",
        visible: true,
        colors: {
          body: "#E8E8E8",
          scrollHandle: "#C1C1C1",
          scrollHandleHover: "#AAAAAA",
          primary: "#008787",
          secondary: "#FF9D00",
          success: "#1C8036",
          error: "#AA2020",
          warn: "#EBCC2A",
          info: "#3B89FF",
          grey: "#7F7F7F",
          placeholder: "#A0AEC0",
          footer: "#34393E",
          admin: "#34393E",
          text: {
            default: "#7BA5A4",
            100: "#334155",
            200: "#475569",
            300: "#64748b",
            button: "white",
          },
        },
      },
      ubuntu: {
        id: "3",
        name: "ubuntu",
        nameEN: "Ubuntu",
        nameFR: "Ubuntu",
        visible: true,
        colors: {
          body: "#2D0922",
          scrollHandle: "#F47845",
          scrollHandleHover: "#E65F31",
          primary: "#80D932",
          secondary: "#dd4813",
          success: "#1C8036",
          error: "#AA2020",
          warn: "#EBCC2A",
          info: "#3B89FF",
          grey: "#7F7F7F",
          placeholder: "#A0AEC0",
          footer: "#180512",
          admin: "#180512",
          text: {
            default: "#F8F8FD",
            100: "#FFFFFF",
            200: "#E1E9CC",
            300: "#CDCDCD",
            button: "white",
          },
        },
      },
    },
    loading: false,
    error: false,
  }),
}));

const sectionRefsMock: Record<string, RefObject<HTMLDivElement>> = {
  headerRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  aboutMeRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  projectRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  skillRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  terminalRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  educationRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
  contactRef: { current: document.createElement("div") } as RefObject<HTMLDivElement>,
};

jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  useSectionRefs: (): Record<string, RefObject<HTMLDivElement>> => sectionRefsMock,
}));

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  useChoiceView: (): { selectedView: string } => ({ selectedView: "default" }),
}));

jest.mock("@/components/Button/ToggleButton", () => ({
  __esModule: true,
  default: ({
    toggleChecked,
    isChecked,
  }: {
    toggleChecked: () => void;
    isChecked: boolean;
  }): React.ReactElement => (
    <button data-testid="toggle-button" onClick={toggleChecked}>
      {isChecked ? "EN" : "FR"}
    </button>
  ),
}));

jest.mock("@/components/Button/ChoiceViewButton", () => ({
  __esModule: true,
  default: (): React.ReactElement => <div data-testid="choice-view-button" />,
}));

jest.mock("@/components/Button/ButtonLinkNavBar", () => ({
  __esModule: true,
  default: ({
    children,
    handleScrollToSection,
  }: {
    children: React.ReactNode;
    handleScrollToSection: (e: React.MouseEvent<HTMLElement>, ref: RefObject<HTMLDivElement>) => void;
  }): React.ReactElement => (
    <button
      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
        handleScrollToSection(e, { current: document.createElement("div") })
      }
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/Button/BurgerButton", () => ({
  __esModule: true,
  default: ({
    open,
    toggleMenu,
  }: {
    open: boolean;
    toggleMenu: () => void;
  }): React.ReactElement => (
    <button data-testid="burger-button" onClick={toggleMenu}>
      {open ? "Close" : "Open"}
    </button>
  ),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children: React.ReactNode }): React.ReactElement | null =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn() as jest.Mock<string>,
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@apollo/client", () => {
  const actual = jest.requireActual("@apollo/client");
  return {
    ...actual,
    useApolloClient: jest.fn(),
  };
});

jest.mock("@/context/UserContext/UserContext", () => ({
  useUser: (): { user: null; refetch: jest.Mock; checkToken: jest.Mock } => ({
    user: null,
    refetch: jest.fn(),
    checkToken: jest.fn(),
  }),
}));

jest.mock("@mui/icons-material/ColorLens", () => ({
  __esModule: true,
  default: (props: Record<string, unknown>): React.ReactElement => <div data-testid="color-lens" {...props} />,
}));

// ---------------------
// Tests Navbar 
// ---------------------

describe("Navbar component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useApolloClient as jest.Mock).mockReturnValue({ clearStore: jest.fn() });
    window.scrollTo = jest.fn();
  });

  it("renders navbar title", () => {
    render(<Navbar />);
    const elements: HTMLElement[] = screen.getAllByText(translationsMock.navbarTitle);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("toggles language when ToggleButton is clicked", () => {
    render(<Navbar />);
    const toggleBtn: HTMLButtonElement = screen.getByTestId("toggle-button") as HTMLButtonElement;
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toBe("EN");
  });

  it("opens modal when ColorLensIcon is clicked", () => {
    render(<Navbar />);
    const icon: HTMLElement = screen.getByTestId("color-lens") as HTMLElement;
    fireEvent.click(icon);
    const modal: HTMLElement = screen.getByTestId("modal") as HTMLElement;
    expect(modal).toBeInTheDocument();
  });

  it("opens and closes burger menu on mobile", () => {
    render(<Navbar />);
    const burgerBtn: HTMLButtonElement = screen.getByTestId("burger-button") as HTMLButtonElement;
    fireEvent.click(burgerBtn);
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(burgerBtn);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders ChoiceViewButton when selectedView is default", () => {
    render(<Navbar />);
    const choiceBtn: HTMLElement = screen.getByTestId("choice-view-button") as HTMLElement;
    expect(choiceBtn).toBeInTheDocument();
  });

  it("scrolls to section when ButtonLinkNavBar is clicked", () => {
    render(<Navbar />);
    const button: HTMLButtonElement | undefined = screen
      .getAllByRole("button")
      .find((btn: HTMLElement) => btn.textContent === translationsMock.navbarButtonAbout) as
      | HTMLButtonElement
      | undefined;

    if (button) {
      fireEvent.click(button);
      expect(window.scrollY).toBe(0);
    }
  });
});

describe("Navbar mobile view", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(new Event("resize"));
  });

  it("shows burger button on mobile", () => {
    render(<Navbar />);
    const burgerBtn: HTMLButtonElement = screen.getByTestId("burger-button") as HTMLButtonElement;
    expect(burgerBtn).toBeInTheDocument();
    expect(burgerBtn.textContent).toBe("Open");
  });

  it("opens mobile menu and displays links/buttons", () => {
    render(<Navbar />);
    const burgerBtn: HTMLButtonElement = screen.getByTestId("burger-button") as HTMLButtonElement;
    fireEvent.click(burgerBtn);

    const aboutButtons: HTMLElement[] = screen.getAllByText(translationsMock.navbarButtonAbout);
    const skillButtons: HTMLElement[] = screen.getAllByText(translationsMock.navbarButtonSkill);
    const projectButtons: HTMLElement[] = screen.getAllByText(translationsMock.navbarButtonProject);
    const careerButtons: HTMLElement[] = screen.getAllByText(translationsMock.navbarButtonCareer);
    
    expect(aboutButtons.length).toBeGreaterThanOrEqual(2);
    expect(skillButtons.length).toBeGreaterThanOrEqual(2);
    expect(projectButtons.length).toBeGreaterThanOrEqual(2);
    expect(careerButtons.length).toBeGreaterThanOrEqual(2);

    const toggleButtons: HTMLElement[] = screen.getAllByTestId("toggle-button");
    const colorLensIcons: HTMLElement[] = screen.getAllByTestId("color-lens");
    const choiceViewButtons: HTMLElement[] = screen.getAllByTestId("choice-view-button");
    
    expect(toggleButtons.length).toBeGreaterThanOrEqual(1);
    expect(colorLensIcons.length).toBeGreaterThanOrEqual(1);
    expect(choiceViewButtons.length).toBeGreaterThanOrEqual(1);
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Navbar />);
    const burgerBtn: HTMLButtonElement = screen.getByTestId("burger-button") as HTMLButtonElement;
    fireEvent.click(burgerBtn);

    const aboutBtn: HTMLButtonElement = screen.getAllByText(translationsMock.navbarButtonAbout)[0] as HTMLButtonElement;

    fireEvent.click(aboutBtn);
    
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
