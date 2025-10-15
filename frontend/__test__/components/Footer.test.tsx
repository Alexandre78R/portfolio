import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer/Footer";
import Lang  from "@/lang/typeLang";

const translationsMock: Record<string, string> = {
  footerTitle: "Footer Test" as string,
  footerAdmin: "Admin" as string,
  footerNetworks: "Réseaux" as string,
  footerCopyright: "Alexandre Renard" as string,
} as Lang;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({ translations: translationsMock as Record<string, string> }),
}));

jest.mock("@mui/icons-material/GitHub", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="github-icon" {...props} />,
}));

jest.mock("@mui/icons-material/LinkedIn", () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="linkedin-icon" {...props} />,
}));

// ----- Tests -----
describe("Footer component", () => {
  it("renders the footer title", () => {
    render(<Footer /> as React.ReactElement);
    expect(screen.getByText(translationsMock.footerTitle)).toBeInTheDocument();
  });

  it("renders the admin link with correct text", () => {
    render(<Footer /> as React.ReactElement);
    const adminLink: HTMLElement = screen.getByText(translationsMock.footerAdmin);
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute("href", "/admin");
  });

  it("renders the networks section with GitHub and LinkedIn icons", () => {
    render(<Footer /> as React.ReactElement);
    expect(screen.getByText(translationsMock.footerNetworks)).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
  });

  it("renders the copyright with current year", () => {
    const currentYear: number = new Date().getFullYear();
    render(<Footer /> as React.ReactElement);
    expect(
      screen.getByText(`© 2024 - ${currentYear} ${translationsMock.footerCopyright}`)
    ).toBeInTheDocument();
  });

  it("has correct links for GitHub and LinkedIn", () => {
    render(<Footer /> as React.ReactElement);
    const githubLink: HTMLElement = screen.getByTitle("Github");
    const linkedinLink: HTMLElement = screen.getByTitle("Linkedin");

    expect(githubLink).toHaveAttribute("href", "https://github.com/Alexandre78R");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/alexandrerenard/"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });
});
