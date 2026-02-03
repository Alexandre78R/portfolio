import { type ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminIndexPage from "@/pages/admin/index";
import { useUser } from "@/context/UserContext/UserContext";
import { useRouter, type NextRouter } from "next/router";

jest.mock("@/context/UserContext/UserContext");

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/components/Loading/LoadingCustom", () => {
  const MockLoadingCustom: React.FC = () => <div data-testid="loading">Loading...</div>;
  MockLoadingCustom.displayName = "LoadingCustom";
  return MockLoadingCustom;
});

describe("AdminIndexPage", () => {
  let mockRouterReplace: jest.Mock;

  beforeEach(() => {
    mockRouterReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockRouterReplace,
    } as unknown as NextRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays the loading component while the user data is loading", (): void => {
    (useUser as jest.Mock).mockReturnValue({ user: null, loading: true });

    render(<AdminIndexPage />);

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
    expect(mockRouterReplace).not.toHaveBeenCalled();
  });

  it("redirects to the dashboard if the user is logged in and password is already changed", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Alex", isPasswordChange: true },
      loading: false,
    });

    render(<AdminIndexPage />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/admin/dashboard");
    });

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("redirects to change-password when password has not been changed", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: 1, name: "Alex", isPasswordChange: false },
      loading: false,
    });

    render(<AdminIndexPage />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/admin/auth/change-password");
    });

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("redirects to the login page if the user is not logged in", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue({ user: null, loading: false });

    render(<AdminIndexPage />);

    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/admin/auth/login");
    });

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });
});
