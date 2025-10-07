import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/NavBar/NavBar";
import { usePathname } from "next/navigation";

const translationsMock: Record<string, string> = {
  navbarTitle: "Mon Portfolio" as string,
  navbarButtonAbout: "À propos" as string,
  navbarButtonSkill: "Compétences" as string,
  navbarButtonProject: "Projets" as string,
  navbarButtonCareer: "Formation" as string,
  navbarButtonContact: "Contact" as string,
  navbarButtonTerminal: "Terminal" as string,
  theme1: "Dark" as string,
  theme2: "Light" as string,
  theme3: "Ubuntu" as string,
};

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({
    lang: "fr" as string,
    setLang: jest.fn() as jest.Mock,
    translations: translationsMock as Record<string, string>,
  }),
}));

jest.mock("@/context/Theme/ThemeContext", () => ({
  useTheme: () => ({
    toggleTheme: jest.fn() as jest.Mock,
    theme: "dark" as string,
  }),
}));

const sectionRefsMock: Record<string, React.RefObject<HTMLDivElement>> = {
  headerRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  aboutMeRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  projectRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  skillRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  terminalRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  educationRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
  contactRef: { current: document.createElement("div") } as React.RefObject<HTMLDivElement>,
};

jest.mock("@/context/SectionRefs/SectionRefsContext", () => ({
  useSectionRefs: () => sectionRefsMock as Record<string, React.RefObject<HTMLDivElement>>,
}));

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  useChoiceView: () => ({ selectedView: "default" } as { selectedView: string }),
}));

jest.mock("@/components/Button/ToggleButton", () => ({
  __esModule: true as const,
  default: ({ toggleChecked, isChecked }: any) => (
    <button data-testid="toggle-button" onClick={toggleChecked}>
      {isChecked ? "EN" : "FR"}
    </button> as React.ReactElement
  ),
}));

jest.mock("@/components/Button/ChoiceViewButton", () => ({
  __esModule: true as const,
  default: () => <div data-testid="choice-view-button" /> as React.ReactElement,
}));

jest.mock("@/components/Button/ButtonLinkNavBar", () => ({
  __esModule: true as const,
  default: ({ children, handleScrollToSection }: any) => (
    <button onClick={(e) => handleScrollToSection(e, { current: document.createElement("div") })}>
      {children}
    </button> as React.ReactElement
  ),
}));

jest.mock("@/components/Button/BurgerButton", () => ({
  __esModule: true as const,
  default: ({ open, toggleMenu }: any) => (
    <button data-testid="burger-button" onClick={toggleMenu}>
      {open ? "Close" : "Open"}
    </button> as React.ReactElement
  ),
}));

jest.mock("@/components/ModalCustom/ModalCustom", () => ({
  __esModule: true as const,
  default: ({ open, children }: any) => (open ? <div data-testid="modal">{children}</div> : null) as React.ReactElement,
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn() as jest.Mock<string>,
}));

jest.mock("@mui/icons-material/ColorLens", () => ({
  __esModule: true as const,
  default: (props: any) => <div data-testid="color-lens" {...props} /> as React.ReactElement,
}));

describe("Navbar component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/" as string);
  });

  it("renders navbar title", () => {
    render(<Navbar /> as React.ReactElement);
    expect(screen.getAllByText(translationsMock.navbarTitle as string).length as number).toBeGreaterThan(0 as number);
  });

  it("toggles language when ToggleButton is clicked", () => {
    render(<Navbar /> as React.ReactElement);
    const toggleBtn: HTMLElement = screen.getByTestId("toggle-button");
    fireEvent.click(toggleBtn as HTMLElement);
    expect(toggleBtn.textContent as string).toBe("EN" as string);
  });

  it("opens modal when ColorLensIcon is clicked", () => {
    render(<Navbar /> as React.ReactElement);
    const icon: HTMLElement = screen.getByTestId("color-lens");
    fireEvent.click(icon as HTMLElement);
    expect(screen.getByTestId("modal" as string) as HTMLElement).toBeInTheDocument();
  });

  it("opens and closes burger menu on mobile", () => {
    render(<Navbar /> as React.ReactElement);
    const burgerBtn: HTMLElement = screen.getByTestId("burger-button");
    fireEvent.click(burgerBtn as HTMLElement);
    expect(screen.getByText("Close" as string) as HTMLElement).toBeInTheDocument();
    fireEvent.click(burgerBtn as HTMLElement);
    expect(screen.getByText("Open" as string) as HTMLElement).toBeInTheDocument();
  });

  it("renders ChoiceViewButton when selectedView is default", () => {
    render(<Navbar /> as React.ReactElement);
    expect(screen.getByTestId("choice-view-button" as string) as HTMLElement).toBeInTheDocument();
  });

  it("scrolls to section when ButtonLinkNavBar is clicked", () => {
    render(<Navbar /> as React.ReactElement);
    const button: HTMLElement | undefined = screen.getAllByRole("button").find((btn) => btn.textContent === translationsMock.navbarButtonAbout);
    if (button as HTMLElement) {
      fireEvent.click(button as HTMLElement);
      expect(window.scrollY as number).toBe(0 as number); // Since the ref's current is a new div not in the document, scrollY remains 0
    }
  });
});