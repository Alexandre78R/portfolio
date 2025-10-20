import React from "react";
import { render } from "@testing-library/react";
import ToastProvider from "@/components/ToastCustom/ToastProvider";

describe("ToastProvider Component", (): void => {
  it("renders ToastContainer", (): void => {
    const { container }: { container: HTMLElement; asFragment: () => DocumentFragment } = render(<ToastProvider />);
    
    const toastElement: HTMLElement | null = container.querySelector(".Toastify");
    expect(toastElement).toBeInTheDocument();
  });

  it("matches snapshot", (): void => {
    const { asFragment }: { container: HTMLElement; asFragment: () => DocumentFragment } = render(<ToastProvider />);
    expect(asFragment()).toMatchSnapshot();
  });
});