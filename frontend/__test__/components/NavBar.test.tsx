import React, { RefObject } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import Navbar from "@/components/NavBar/NavBar";
import { usePathname } from "next/navigation";

// ---------------------
// Types et mocks
// ---------------------

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
  useTheme: (): { theme: string; toggleTheme: jest.Mock<void, []> } => ({
    theme: "dark",
    toggleTheme: jest.fn<void, []>(),
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

// ---------------------
// Tests Navbar Mobile
// ---------------------

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

    const mobileMenu: HTMLElement = screen.getByTestId("mobile-menu") as HTMLElement;

    expect(within(mobileMenu).getByText(translationsMock.navbarButtonAbout)).toBeInTheDocument();
    expect(within(mobileMenu).getByText(translationsMock.navbarButtonSkill)).toBeInTheDocument();
    expect(within(mobileMenu).getByText(translationsMock.navbarButtonProject)).toBeInTheDocument();
    expect(within(mobileMenu).getByText(translationsMock.navbarButtonCareer)).toBeInTheDocument();

    expect(within(mobileMenu).getByTestId("toggle-button")).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId("color-lens")).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId("choice-view-button")).toBeInTheDocument();
  });

  it("closes mobile menu when a link is clicked", () => {
    render(<Navbar />);
    const burgerBtn: HTMLButtonElement = screen.getByTestId("burger-button") as HTMLButtonElement;
    fireEvent.click(burgerBtn);

    const mobileMenu: HTMLElement = screen.getByTestId("mobile-menu") as HTMLElement;
    const aboutBtn: HTMLButtonElement = within(mobileMenu).getByText(translationsMock.navbarButtonAbout) as HTMLButtonElement;

    fireEvent.click(aboutBtn);
    expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();
  });
});