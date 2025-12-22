import React, { type ReactElement } from "react";
import { render, screen, waitFor } from '@testing-library/react';
import AdminPage from "@/pages/admin/[...slug]";
import { useRouter, type NextRouter } from "next/router";
import { useUser, type UserContextType } from "@/context/UserContext/UserContext";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: () => any) => {
    const MockComponent: React.FC = () => <div data-testid="dynamic-component">Dynamic</div>;
    MockComponent.displayName = "MockDynamicComponent";
    return MockComponent;
  },
}));

jest.mock("@/context/UserContext/UserContext");

jest.mock("@/components/Loading/LoadingCustom", () => {
  const MockLoading: React.FC = () => <div data-testid="loading">Loading...</div>;
  MockLoading.displayName = "LoadingCustom";
  return MockLoading;
});

jest.mock("@/components/AdminLayout/AdminLayout", () => {
  const MockLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div data-testid="admin-layout">{children}</div>
  );
  MockLayout.displayName = "AdminLayout";
  return MockLayout;
});


describe("AdminPage [...slug] Component", () => {
  let mockReplace: jest.Mock;

  beforeEach(() => {
    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: undefined },
      replace: mockReplace,
    } as unknown as NextRouter);

    jest.clearAllMocks();
  });

  it("displays loading while user data is loading", (): void => {
    (useUser as jest.Mock).mockReturnValue({ user: null, loading: true } as UserContextType);

    render(<AdminPage />);

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to dashboard if user has no access", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({ user: { role: "view" }, loading: false } as UserContextType);

    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: "users/create" },
      replace: mockReplace,
    } as unknown as NextRouter);

    render(<AdminPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("renders the dynamic component and AdminLayout when ready and access granted", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({ user: { role: "admin" }, loading: false } as UserContextType);

    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: "dashboard" },
      replace: mockReplace,
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();

    const dynamicComp: HTMLElement | null = await screen.findByTestId("dynamic-component");
    expect(dynamicComp).toBeInTheDocument();

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("handles slug as array", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({ user: { role: "admin" }, loading: false } as UserContextType);

    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["projects", "list"] },
      replace: mockReplace,
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();

    const dynamicComp: HTMLElement | null = await screen.findByTestId("dynamic-component");
    expect(dynamicComp).toBeInTheDocument();

    expect(mockReplace).not.toHaveBeenCalled();
  });
});