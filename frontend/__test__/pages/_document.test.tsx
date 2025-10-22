import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import "@testing-library/jest-dom";

jest.mock("next/document", () => {
  const Html = ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHtmlElement>): React.ReactElement => (
    <html {...props}>{children}</html>
  );
  Html.displayName = "Html";

  const Head = ({
    children,
  }: {
    children?: React.ReactNode;
  }): React.ReactElement => <head>{children}</head>;
  Head.displayName = "Head";

  const Main = (): React.ReactElement => (
    <main data-testid="main-content" />
  );
  Main.displayName = "Main";

  const NextScript = (): React.ReactElement => (
    <script data-testid="next-script" />
  );
  NextScript.displayName = "NextScript";

  return { Html, Head, Main, NextScript };
});

jest.mock("next/script", () => {
  const Script = ({
    children,
    id,
  }: {
    children?: React.ReactNode;
    id?: string;
  }): React.ReactElement => <script id={id}>{children}</script>;

  Script.displayName = "Script";
  return Script;
});

import Document from "@/pages/_document";

describe("Custom Document (static HTML rendering)", () => {
  let html: string;

  beforeAll((): void => {
    html = renderToStaticMarkup(<Document />);
  });

  it("renders Html with correct lang and translate attributes", () => {
    expect(html).toContain('<html lang="fr" translate="no">');
  });

  it("renders Head, Main and NextScript", () => {
    expect(html).toContain('data-testid="main-content"');
    expect(html).toContain('data-testid="next-script"');
  });

  it("renders GTM noscript iframe with correct attributes", () => {
    expect(html).toContain("<noscript>");
    expect(html).toContain(
      "https://www.googletagmanager.com/ns.html?id=GTM-MT75FPT5"
    );
    expect(html).toContain('height="0"');
    expect(html).toContain('width="0"');
    expect(html).toContain(
      'style="display:none;visibility:hidden"'
    );
  });

  it("injects GTM script with correct content", () => {
    expect(html).toContain('id="gtm-init"');
    expect(html).toContain("googletagmanager.com/gtm.js");
    expect(html).toContain("GTM-MT75FPT5");
    expect(html).toContain("dataLayer");
  });
});