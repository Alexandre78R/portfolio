import React from "react";
import { render } from "@testing-library/react";
import Seo from "@/components/Seo/Seo";
import { useLang, LangContextType } from "@/context/Lang/LangContext";
import { useRouter } from "next/router";
import fr from "@/lang/fr";

jest.mock("next/head", () => {
  return function Head({
    children,
  }: {
    children: React.ReactNode;
  }): React.ReactElement {
    return <>{children}</>;
  };
});

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/Lang/LangContext", () => ({
  useLang: jest.fn(),
}));

describe("Seo component", () => {
  const mockSetLang: jest.MockedFunction<(lang: "fr" | "en") => void> =
    jest.fn();

  const mockLangContextValue: LangContextType = {
    lang: "fr",
    setLang: mockSetLang,
    translations: fr,
    listLang: ["fr", "en"],
  };

  beforeEach((): void => {
    window.history.pushState({}, "", "/projects");

    (useLang as jest.MockedFunction<typeof useLang>).mockReturnValue(
      mockLangContextValue
    );

    (useRouter as jest.MockedFunction<typeof useRouter>).mockReturnValue({
      asPath: "/projects",
    } as ReturnType<typeof useRouter>);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it("renders without crashing", (): void => {
    const { container } = render(<Seo />);
    expect(container).toBeTruthy();
  });

  it("sets document language from translations", (): void => {
    render(<Seo />);
    expect(document.documentElement.lang).toBe(fr.file);
  });

  it("renders correct title", (): void => {
    render(<Seo />);
    expect(document.title).toBe(fr.titleHTML);
  });

  it("renders SEO meta tags correctly", (): void => {
    render(<Seo />);

    const metaTitle: HTMLMetaElement | null = document.querySelector(
      'meta[name="title"]'
    );
    const metaDescription: HTMLMetaElement | null = document.querySelector(
      'meta[name="description"]'
    );

    expect(metaTitle).toBeInTheDocument();
    expect(metaTitle?.content).toBe(fr.titleHTML);

    expect(metaDescription).toBeInTheDocument();
    expect(metaDescription?.content).toBe(fr.descHTML);
  });

  it("sets canonical URL correctly", (): void => {
    render(<Seo />);

    const canonicalLink: HTMLLinkElement | null =
      document.querySelector('link[rel="canonical"]');

    expect(canonicalLink).toBeInTheDocument();

    expect(canonicalLink?.href).toBe("http://localhost/projects");
  });


  it("renders Open Graph meta tags", (): void => {
    render(<Seo />);

    const ogTitle: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:title"]'
    );
    const ogUrl: HTMLMetaElement | null = document.querySelector(
      'meta[property="og:url"]'
    );

    expect(ogTitle).toBeInTheDocument();
    expect(ogTitle?.content).toBe(fr.titleHTML);

    expect(ogUrl).toBeInTheDocument();
    expect(ogUrl?.content).toBe("http://localhost/projects");
  });

  it("renders Twitter meta tags", (): void => {
    render(<Seo />);

    const twitterTitle: HTMLMetaElement | null = document.querySelector(
      'meta[property="twitter:title"]'
    );
    const twitterDescription: HTMLMetaElement | null = document.querySelector(
      'meta[property="twitter:description"]'
    );

    expect(twitterTitle).toBeInTheDocument();
    expect(twitterTitle?.content).toBe(fr.titleHTML);

    expect(twitterDescription).toBeInTheDocument();
    expect(twitterDescription?.content).toBe(fr.descHTML);
  });

  it("renders JSON-LD structured data script", (): void => {
    render(<Seo />);

    const jsonLdScript: HTMLScriptElement | null =
      document.querySelector('script[type="application/ld+json"]');

    expect(jsonLdScript).toBeInTheDocument();
    expect(jsonLdScript?.textContent).toContain("Organization");
    expect(jsonLdScript?.textContent).toContain("BreadcrumbList");
  });
});