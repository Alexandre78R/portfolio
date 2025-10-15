import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonCustom, { ButtonCustomProps} from "@/components/Button/Button";

describe("ButtonCustom component", () => {
  const buttonText: string = "Click Me";

  it("renders button with correct text", (): void => {
    const props: ButtonCustomProps = { text: buttonText };
    render(<ButtonCustom {...props} />);

    const buttonElement: HTMLButtonElement = screen.getByRole("button", { name: buttonText }) as HTMLButtonElement;
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.textContent).toBe(buttonText);
  });

  it("calls onClick when clicked", (): void => {
    const onClickMock: jest.Mock = jest.fn();
    const props: ButtonCustomProps = { text: buttonText, onClick: onClickMock };
    render(<ButtonCustom {...props} />);

    const buttonElement: HTMLButtonElement = screen.getByRole("button", { name: buttonText }) as HTMLButtonElement;
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it("applies styles correctly (basic checks)", (): void => {
    const props: ButtonCustomProps = { text: buttonText };
    render(<ButtonCustom {...props} />);

    const buttonElement: HTMLButtonElement = screen.getByRole("button", { name: buttonText }) as HTMLButtonElement;
    expect(buttonElement).toHaveStyle("font-size: 12px");
    expect(buttonElement).toHaveStyle("border-radius: 999px");
    expect(buttonElement).toHaveStyle("margin-top: 16px"); // mt: 2 -> 16px
  });

  it("renders ReactNode text correctly", (): void => {
    const nodeText: React.ReactNode = <span>Node Text</span>;
    const props: ButtonCustomProps = { text: nodeText };
    render(<ButtonCustom {...props} />);

    expect(screen.getByText("Node Text")).toBeInTheDocument();
  });

  it("sets disabled prop correctly", (): void => {
    const props: ButtonCustomProps = { text: buttonText, disable: true };
    render(<ButtonCustom {...props} />);

    const buttonElement: HTMLButtonElement = screen.getByRole("button", { name: buttonText }) as HTMLButtonElement;
    expect(buttonElement.disabled).toBe(true);
  });
});