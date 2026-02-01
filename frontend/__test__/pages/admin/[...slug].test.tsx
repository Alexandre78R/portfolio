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


describe("AdminPage [...slug] Component", (): void => {
  let mockReplace: jest.Mock<Promise<boolean>, [string]>;

  const mockUserAdmin: UserContextType = {
    user: {
      id: "1",
      email: "admin@example.com",
      username: "admin",
      role: "admin",
      isPasswordChange: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    loading: false,
    logout: jest.fn(),
  };

  const mockUserPasswordNotChanged: UserContextType = {
    user: {
      id: "1",
      email: "admin@example.com",
      username: "admin",
      role: "admin",
      isPasswordChange: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    loading: false,
    logout: jest.fn(),
  };

  const mockUserLoading: UserContextType = {
    user: undefined,
    loading: true,
    logout: jest.fn(),
  };

  beforeEach((): void => {
    mockReplace = jest.fn().mockResolvedValue(true);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: undefined },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    jest.clearAllMocks();
  });

  it("displays loading while user data is loading", (): void => {
    (useUser as jest.Mock).mockReturnValue(mockUserLoading);

    render(<AdminPage />);

    const loadingElement: HTMLElement | null = screen.getByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("redirects to change password page when user has not changed password", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserPasswordNotChanged);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["dashboard"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    render(<AdminPage />);

    await waitFor((): void => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/auth/changePassword");
    });
  });

  it("displays loading while page is initializing", (): void => {
    (useUser as jest.Mock).mockReturnValue(mockUserLoading);

    const { container } = render(<AdminPage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders the admin layout when ready and access granted", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["dashboard"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalledWith("/admin/dashboard");
  });

  it("renders dynamic component when page is valid", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["dashboard"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const dynamicComp: HTMLElement | null = await screen.findByTestId("dynamic-component");
    expect(dynamicComp).toBeInTheDocument();
  });

  it("handles slug as array", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["projects", "list"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/projects/list",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();

    const dynamicComp: HTMLElement | null = await screen.findByTestId("dynamic-component");
    expect(dynamicComp).toBeInTheDocument();

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("defaults to dashboard when no slug provided", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: undefined },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();
  });

  it("redirects to dashboard for invalid page slug", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["nonexistent", "page"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/nonexistent/page",
    } as unknown as NextRouter);

    render(<AdminPage />);

    await waitFor((): void => {
      expect(mockReplace).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("handles nested slug paths correctly", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["skills", "categories", "list"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/skills/categories/list",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("allows admin role to access any valid page", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["users", "create"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/users/create",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("shows loading state when user is undefined and not loading", (): void => {
    (useUser as jest.Mock).mockReturnValue({
      user: undefined,
      loading: false,
      logout: jest.fn(),
    });
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["dashboard"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    render(<AdminPage />);

    // When user is undefined and loading is false, should show loading state initially
    const loadingElement: HTMLElement | null = screen.queryByTestId("admin-loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders translations list page when accessing translations", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["translations", "list"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/translations/list",
    } as unknown as NextRouter);

    render(<AdminPage />);

    const layout: HTMLElement | null = await screen.findByTestId("admin-layout");
    expect(layout).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("ensures ready state before checking page access", async (): Promise<void> => {
    (useUser as jest.Mock).mockReturnValue(mockUserAdmin);
    (useRouter as jest.Mock).mockReturnValue({
      query: { slug: ["dashboard"] },
      replace: mockReplace,
      basePath: "",
      pathname: "/admin/[...slug]",
      route: "/admin/[...slug]",
      asPath: "/admin/dashboard",
    } as unknown as NextRouter);

    render(<AdminPage />);

    await waitFor((): void => {
      expect(screen.getByTestId("admin-layout")).toBeInTheDocument();
    });
  });
});