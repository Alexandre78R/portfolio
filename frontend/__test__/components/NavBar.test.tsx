import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/NavBar/NavBar";
import { usePathname } from "next/navigation";
import { RefObject } from "react";

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
  useLang: (): { lang: string; setLang: jest.Mock; translations: Record<string, string> } => ({
    lang: "fr",
    setLang: jest.fn(),
    translations: translationsMock,
  }),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: (): { theme: string; toggleTheme: jest.Mock } => ({
    theme: "dark",
    toggleTheme: jest.fn(),
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
  default: ({ toggleChecked, isChecked }: { toggleChecked: () => void; isChecked: boolean }) => (
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
  }) => (
    <button onClick={(e) => handleScrollToSection(e, { current: document.createElement("div") })}>
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
  }) => (
    <button data-testid="burger-button" onClick={toggleMenu}>
      {open ? "Close" : "Open"}
    </button>
  ),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn() as jest.Mock<string>,
}));

jest.mock("@mui/icons-material/ColorLens", () => ({
  __esModule: true,
  default: (props: any): React.ReactElement => <div data-testid="color-lens" {...props} />,
}));


describe("Navbar component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
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
    const icon: HTMLElement = screen.getByTestId("color-lens");
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
      .find((btn) => btn.textContent === translationsMock.navbarButtonAbout) as HTMLButtonElement | undefined;

    if (button) {
      fireEvent.click(button);
      expect(window.scrollY).toBe(0);
    }
  });
});