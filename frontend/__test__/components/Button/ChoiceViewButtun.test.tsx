import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ChoiceViewButton from "@/components/Button/ChoiceViewButton";
import { useChoiceView } from "@/context/ChoiceView/ChoiceViewContext";

jest.mock("@/context/ChoiceView/ChoiceViewContext", () => ({
  useChoiceView: jest.fn(),
}));

jest.mock("@mui/icons-material/Terminal", () => {
  const TerminalIconMock: React.FC = () => <svg data-testid="terminal-icon" />;
  TerminalIconMock.displayName = "TerminalIcon";
  return TerminalIconMock;
});

jest.mock("@mui/icons-material/Mouse", () => {
  const MouseIconMock: React.FC = () => <svg data-testid="mouse-icon" />;
  MouseIconMock.displayName = "MouseIcon";
  return MouseIconMock;
});

describe("ChoiceViewButton", () => {
  const mockSetSelectedView: jest.Mock<void, [string]> = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (selectedView: "text" | "terminal") => {
    (useChoiceView as jest.Mock).mockReturnValue({
      selectedView,
      setSelectedView: mockSetSelectedView,
    });

    return render(<ChoiceViewButton />);
  };

  test("renders ToggleButton with correct initial state when selectedView is 'text'", () => {
    renderComponent("text");

    // On récupère le toggle button
    const toggleButton: HTMLElement = screen.getByTestId("toggle-button");
    expect(toggleButton).toBeInTheDocument();

    // On reste en HTMLElement pour éviter l'erreur de conversion SVG
    const mouseIcon: HTMLElement = screen.getByTestId("mouse-icon");
    const terminalIcon: HTMLElement = screen.getByTestId("terminal-icon");

    expect(mouseIcon).toBeInTheDocument();
    expect(terminalIcon).toBeInTheDocument();
  });

  test("renders ToggleButton with correct initial state when selectedView is 'terminal'", () => {
    renderComponent("terminal");

    const toggleButton: HTMLElement = screen.getByTestId("toggle-button");
    expect(toggleButton).toBeInTheDocument();

    const mouseIcon: HTMLElement = screen.getByTestId("mouse-icon");
    const terminalIcon: HTMLElement = screen.getByTestId("terminal-icon");

    expect(mouseIcon).toBeInTheDocument();
    expect(terminalIcon).toBeInTheDocument();
  });

  test("toggles view and calls setSelectedView on click when initial state is 'text'", () => {
    renderComponent("text");

    const toggleButton: HTMLElement = screen.getByTestId("toggle-button");
    fireEvent.click(toggleButton);

    expect(mockSetSelectedView).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedView).toHaveBeenCalledWith("terminal");
  });

  test("toggles view back when initial state is 'terminal'", () => {
    renderComponent("terminal");

    const toggleButton: HTMLElement = screen.getByTestId("toggle-button");
    fireEvent.click(toggleButton);

    expect(mockSetSelectedView).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedView).toHaveBeenCalledWith("text");
  });
});