import React, { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonLinkNavBar from "@/components/Button/ButtonLinkNavBar";
import { usePathname } from "next/navigation";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn() as jest.Mock<string>,
}));

describe("ButtonLinkNavBar", () => {
  let mockHandleScroll: jest.Mock<void, [React.MouseEvent<HTMLElement>, React.RefObject<HTMLDivElement>]>;
  let mockRef: React.RefObject<HTMLDivElement>;
  const childrenText: ReactNode = "Test Button";

  beforeEach(() => {
    mockHandleScroll = jest.fn();
    mockRef = { current: document.createElement("div") } as React.RefObject<HTMLDivElement>;
    jest.clearAllMocks();
  });

  test("renders button when pathname is '/'", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(
      <ButtonLinkNavBar
        sectionRef={mockRef}
        handleScrollToSection={mockHandleScroll}
        className="custom-class"
      >
        {childrenText}
      </ButtonLinkNavBar>
    );

    const button: HTMLButtonElement = screen.getByRole("button", { name: /test button/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("custom-class");
    expect(button.textContent).toBe(childrenText);
  });

  test("does not render button when pathname is not '/'", () => {
    (usePathname as jest.Mock).mockReturnValue("/other");

    render(
      <ButtonLinkNavBar
        sectionRef={mockRef}
        handleScrollToSection={mockHandleScroll}
      >
        {childrenText}
      </ButtonLinkNavBar>
    );

    const button: HTMLButtonElement | null = screen.queryByRole("button");
    expect(button).toBeNull();
  });

  test("calls handleScrollToSection on click", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(
      <ButtonLinkNavBar
        sectionRef={mockRef}
        handleScrollToSection={mockHandleScroll}
      >
        {childrenText}
      </ButtonLinkNavBar>
    );

    const button: HTMLButtonElement = screen.getByRole("button", { name: /test button/i });
    fireEvent.click(button as HTMLButtonElement);

    expect(mockHandleScroll).toHaveBeenCalledTimes(1);
    expect(mockHandleScroll).toHaveBeenCalledWith(expect.any(Object) as React.MouseEvent<HTMLButtonElement>, mockRef);
  });
});