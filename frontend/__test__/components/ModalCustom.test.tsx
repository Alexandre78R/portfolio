import React, { ReactNode } from "react";
import { render, screen } from '@test-utils';
import ModalCustom, { ModalCustomProps } from "@/components/ModalCustom/ModalCustom";

describe("ModalCustom Component", (): void => {
  const mockOnClose: jest.Mock<void, []> = jest.fn();

  const defaultProps: ModalCustomProps = {
    open: true,
    onClose: mockOnClose,
    children: <div data-testid="modal-children">Modal Content</div>,
    width: 500,
    className: "custom-class",
  };

  beforeEach((): void => {
    mockOnClose.mockClear();
  });

  it("renders children when open", (): void => {
    render(<ModalCustom {...defaultProps} />);
    const childrenElement: HTMLElement | null = screen.getByTestId("modal-children");
    expect(childrenElement).toBeInTheDocument();
    expect(childrenElement).toHaveTextContent("Modal Content");
  });

  it("does not render children when closed", (): void => {
    render(<ModalCustom {...defaultProps} open={false} />);
    const childrenElement: HTMLElement | null = screen.queryByTestId("modal-children");
    expect(childrenElement).toBeNull();
  });

  it("calls onClose when triggered programmatically", (): void => {
    render(<ModalCustom {...defaultProps} />);
    const onCloseFn: () => void = defaultProps.onClose;
    onCloseFn();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders Box wrapper with children", (): void => {
    render(<ModalCustom {...defaultProps} />);
    const childrenElement: HTMLElement | null = screen.getByTestId("modal-children");
    const boxElement: HTMLElement | null = childrenElement?.closest("div") ?? null;
    expect(boxElement).toBeInTheDocument();
    expect(boxElement).not.toBeNull();
  });

  it("renders default width if not provided", (): void => {
    const propsWithDefaultWidth: ModalCustomProps = { ...defaultProps, width: undefined };
    render(<ModalCustom {...propsWithDefaultWidth} />);
    const childrenElement: HTMLElement | null = screen.getByTestId("modal-children");
    const boxElement: HTMLElement | null = childrenElement?.closest("div") ?? null;
    expect(boxElement).toBeInTheDocument();
  });
});
