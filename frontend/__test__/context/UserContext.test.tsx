import { type ReactNode } from "react";
import { render, screen, act } from '@testing-library/react';
import "@testing-library/jest-dom";
import { UserProvider, useUser, type UserContextType } from "@/context/UserContext/UserContext";
import { type UseGetMeQueryMock } from "./context.types";
import { useGetMeQuery } from "@/types/graphql";

const mockRefetch: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => {
  const originalModule: Record<string, unknown> = jest.requireActual("@/types/graphql");
  return {
    ...originalModule,
    useGetMeQuery: jest.fn(),
  };
});

const TestComponent: React.FC<{ children?: ReactNode }> = (): React.ReactElement => {
  const { user, loading, error, refetch }: UserContextType = useUser();

  return (
    <div>
      <span data-testid="user">{user ? user.email : "null"}</span>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <span data-testid="error">{error ? error.message : "null"}</span>
      <button
        type="button"
        data-testid="refetch"
        onClick={() => refetch()}
      >
        Refetch
      </button>
    </div>
  );
};

describe("UserContext", () => {
  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it("provides default values when data is undefined", (): void => {
    (useGetMeQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: true,
      error: null,
      refetch: mockRefetch,
    } as UseGetMeQueryMock);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const userSpan: HTMLElement = screen.getByTestId("user");
    const loadingSpan: HTMLElement = screen.getByTestId("loading");
    const errorSpan: HTMLElement = screen.getByTestId("error");

    expect(userSpan).toHaveTextContent("null");
    expect(loadingSpan).toHaveTextContent("true");
    expect(errorSpan).toHaveTextContent("null");
  });

  it("sets user when data is available", (): void => {
    const fakeUser: { id: string; email: string } = { id: "1", email: "test@example.com" };
    (useGetMeQuery as jest.Mock).mockReturnValue({
      data: { me: fakeUser },
      loading: false,
      error: null,
      refetch: mockRefetch,
    } as UseGetMeQueryMock);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const userSpan: HTMLElement = screen.getByTestId("user");
    const loadingSpan: HTMLElement = screen.getByTestId("loading");
    const errorSpan: HTMLElement = screen.getByTestId("error");

    expect(userSpan).toHaveTextContent("test@example.com");
    expect(loadingSpan).toHaveTextContent("false");
    expect(errorSpan).toHaveTextContent("null");
  });

  it("handles errors", (): void => {
    const fakeError: Error = new Error("Network error");
    (useGetMeQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: fakeError,
      refetch: mockRefetch,
    } as UseGetMeQueryMock);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const userSpan: HTMLElement = screen.getByTestId("user");
    const loadingSpan: HTMLElement = screen.getByTestId("loading");
    const errorSpan: HTMLElement = screen.getByTestId("error");

    expect(userSpan).toHaveTextContent("null");
    expect(loadingSpan).toHaveTextContent("false");
    expect(errorSpan).toHaveTextContent("Network error");
  });

  it("calls refetch when button clicked", (): void => {
    (useGetMeQuery as jest.Mock).mockReturnValue({
      data: undefined,
      loading: false,
      error: null,
      refetch: mockRefetch,
    } as UseGetMeQueryMock);

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    const refetchButton: HTMLButtonElement = screen.getByTestId("refetch") as HTMLButtonElement;

    act(() => {
      refetchButton.click();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("throws error when used outside provider", () => {
    const consoleErrorSpy: jest.SpyInstance = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const renderOutsideProvider = () => render(<TestComponent />);
    expect(renderOutsideProvider).toThrow(
      "useUser must be used within a UserProvider"
    );

    consoleErrorSpy.mockRestore();
  });
})
