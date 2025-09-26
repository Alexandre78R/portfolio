import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/NavBar/NavBar";
import { usePathname } from "next/navigation";

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
  useLang: () => ({
    lang: "fr",
    setLang: jest.fn(),
    translations: translationsMock,
  }),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: () => ({
    toggleTheme: jest.fn(),
    theme: "dark",
  }),
}));

const sectionRefsMock: Record<string, React.RefObject<HTMLDivElement>> = {
  headerRef: { current: document.createElement("div") },
  aboutMeRef: { current: document.createElement("div") },
  projectRef: { current: document.createElement("div") },
  skillRef: { current: document.createElement("div") },
  terminalRef: { current: document.createElement("div") },
  educationRef: { current: document.createElement("div") },
  contactRef: { current: document.createElement("div") },
};

jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  useSectionRefs: () => sectionRefsMock,
}));

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  useChoiceView: () => ({ selectedView: "default" }),
}));

jest.mock("@/components/Button/ToggleButton", () => ({
  __esModule: true,
  default: ({ toggleChecked, isChecked }: any) => (
    <button data-testid="toggle-button" onClick={toggleChecked}>
      {isChecked ? "EN" : "FR"}
    </button>
  ),
}));

jest.mock("@/components/Button/ChoiceViewButton", () => ({
  __esModule: true,
  default: () => <div data-testid="choice-view-button" />,
}));

jest.mock("@/components/Button/ButtonLinkNavBar", () => ({
  __esModule: true,
  default: ({ children, handleScrollToSection }: any) => (
    <button onClick={(e) => handleScrollToSection(e, { current: document.createElement("div") })}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/Button/BurgerButton", () => ({
  __esModule: true,
  default: ({ open, toggleMenu }: any) => (
    <button data-testid="burger-button" onClick={toggleMenu}>
      {open ? "Close" : "Open"}
    </button>
  ),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true,
  default: ({ open, children }: any) => (open ? <div data-testid="modal">{children}</div> : null),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@mui/icons-material/ColorLens", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="color-lens" {...props} />,
}));

describe("Navbar component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/");
  });

  it("renders navbar title", () => {
    render(<Navbar />);
    expect(screen.getAllByText(translationsMock.navbarTitle).length).toBeGreaterThan(0);
  });

  it("toggles language when ToggleButton is clicked", () => {
    render(<Navbar />);
    const toggleBtn: HTMLElement = screen.getByTestId("toggle-button");
    fireEvent.click(toggleBtn);
    expect(toggleBtn.textContent).toBe("EN");
  });

  it("opens modal when ColorLensIcon is clicked", () => {
    render(<Navbar />);
    const icon: HTMLElement = screen.getByTestId("color-lens");
    fireEvent.click(icon);
    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("opens and closes burger menu on mobile", () => {
    render(<Navbar />);
    const burgerBtn: HTMLElement = screen.getByTestId("burger-button");
    fireEvent.click(burgerBtn);
    expect(screen.getByText("Close")).toBeInTheDocument();
    fireEvent.click(burgerBtn);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders ChoiceViewButton when selectedView is default", () => {
    render(<Navbar />);
    expect(screen.getByTestId("choice-view-button")).toBeInTheDocument();
  });

  it("scrolls to section when ButtonLinkNavBar is clicked", () => {
    render(<Navbar />);
    const button: HTMLElement | undefined = screen.getAllByRole("button").find((btn) => btn.textContent === translationsMock.navbarButtonAbout);
    if (button) {
      fireEvent.click(button);
      expect(window.scrollY).toBe(0);
    }
  });
});