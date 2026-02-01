import React from "react";
import { render, screen } from '@test-utils';
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Footer from "@/components/Footer/Footer";
import type Lang  from "@/lang/typeLang";
import { Social } from "@/store/slices/socialsSlice";
import socialsReducer from "@/store/slices/socialsSlice";

const translationsMock: Lang = {
  footerTitle: "Footer Test" as string,
  footerAdmin: "Admin" as string,
  footerNetworks: "Réseaux" as string,
  footerCopyright: "Alexandre Renard" as string,
} as Lang;

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: () => ({ translations: translationsMock as Lang }),
}));

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

jest.mock("@mui/icons-material/GitHub", () => ({
  __esModule: true,
  default: (props: IconProps): React.ReactElement => <div data-testid="github-icon" {...props} />,
}));

jest.mock("@mui/icons-material/LinkedIn", () => ({
  __esModule: true,
  default: (props: IconProps): React.ReactElement => <div data-testid="linkedin-icon" {...props} />,
}));

jest.mock("@mui/icons-material/Link", () => ({
  __esModule: true,
  default: (props: IconProps): React.ReactElement => <div data-testid="link-icon" {...props} />,
}));

interface StoreState {
  socials: {
    dataSocials: Social[];
  };
}

const createMockStore = (initialState: StoreState) => {
  return configureStore({
    reducer: socialsReducer,
    preloadedState: initialState,
  });
};

describe("Footer component", () => {
  const mockSocials: Social[] = [
    { id: 1, title: "GitHub", url: "https://github.com/Alexandre78R", tab: 3 },
    { id: 2, title: "LinkedIn", url: "https://www.linkedin.com/in/alexandrerenard/", tab: 3 },
  ];

  it("renders the footer title", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: mockSocials } });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.getByText(translationsMock.footerTitle)).toBeInTheDocument();
  });

  it("renders the admin link with correct text", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: mockSocials } });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    const adminLink: HTMLElement = screen.getByText(translationsMock.footerAdmin);
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute("href", "/admin");
  });

  it("renders the networks section with GitHub and LinkedIn icons from Redux", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: mockSocials } });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.getByText(translationsMock.footerNetworks)).toBeInTheDocument();
    expect(screen.getByTestId("github-icon")).toBeInTheDocument();
    expect(screen.getByTestId("linkedin-icon")).toBeInTheDocument();
  });

  it("renders the copyright with current year", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: mockSocials } });
    const currentYear: number = new Date().getFullYear();
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(
      screen.getByText(`© 2024 - ${currentYear} ${translationsMock.footerCopyright}`)
    ).toBeInTheDocument();
  });

  it("has correct links for GitHub and LinkedIn from Redux data", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: mockSocials } });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    const githubLink: HTMLElement = screen.getByTitle("GitHub");
    const linkedinLink: HTMLElement = screen.getByTitle("LinkedIn");

    expect(githubLink).toHaveAttribute("href", "https://github.com/Alexandre78R");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/alexandrerenard/"
    );
    expect(githubLink).toHaveAttribute("target", "_blank");
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });

  it("renders nothing when dataSocials is empty", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({ socials: { dataSocials: [] } });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.queryByTestId("github-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("linkedin-icon")).not.toBeInTheDocument();
  });

  it("renders default link icon for unknown social types", () => {
    const store: ReturnType<typeof configureStore> = createMockStore({
      socials: {
        dataSocials: [
          { id: 1, title: "Twitter", url: "https://twitter.com/example", tab: 3 },
        ],
      },
    });
    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );
    expect(screen.getByTestId("link-icon")).toBeInTheDocument();
    const link: HTMLElement = screen.getByTitle("Twitter");
    expect(link).toHaveAttribute("href", "https://twitter.com/example");
  });
});
