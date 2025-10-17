import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BurgerButton, { BurgerButtonProps } from "@/components/Button/BurgerButton";

const mockToggleMenu: jest.Mock<() => void, []> = jest.fn();

const props: BurgerButtonProps = {
  open: false,
  toggleMenu: mockToggleMenu,
  className: "custom-class",
};

describe("BurgerButton Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the button element correctly when closed", () => {
    const { container }: { container: HTMLElement } = render(
      <BurgerButton {...props} />
    );

    const button: HTMLButtonElement | null = screen.getByRole("button", {
      name: /ouvrir le menu/i,
    });

    expect(button).toBeInTheDocument();
    expect(button.className).toContain("text-text");
    expect(button.className).toContain("custom-class");

    const svgClosed: SVGSVGElement | null = container.querySelector("svg");
    expect(svgClosed).toBeInTheDocument();
    expect(svgClosed?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  test("renders the button element correctly when open", () => {
    const { container }: { container: HTMLElement } = render(
      <BurgerButton {...props} open={true} />
    );
    const button: HTMLButtonElement | null = screen.getByRole("button", {
      name: /fermer le menu/i,
    });
    expect(button).toBeInTheDocument();

    const svgOpen: SVGSVGElement | null = container.querySelector("svg");
    expect(svgOpen).toBeInTheDocument();
    const pathElements: NodeListOf<SVGPathElement> = container.querySelectorAll(
      "path"
    );
    expect(pathElements.length).toBeGreaterThan(0);
  });

  test("calls toggleMenu on click", () => {
    const button: HTMLButtonElement = render(<BurgerButton {...props} />)
      .getByRole("button") as HTMLButtonElement;

    fireEvent.click(button);

    expect(mockToggleMenu).toHaveBeenCalledTimes(1);
  });
});