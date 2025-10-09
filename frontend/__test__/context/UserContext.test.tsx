import React, { ReactNode } from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserProvider, useUser } from "@/context/UserContext/UserContext";
import { UseGetMeQueryMock } from "./context.types";

const mockRefetch: jest.Mock = jest.fn();

jest.mock("@/types/graphql", () => {
  const originalModule: Record<string, unknown> = jest.requireActual("@/types/graphql");
  return {
    ...originalModule,
    useGetMeQuery: jest.fn(),
  };
});

import { useGetMeQuery } from "@/types/graphql";

const TestComponent: React.FC<{ children?: ReactNode }> = () => {
  const { user, loading, error, refetch } = useUser();

  return (
    <div>
      <span data-testid="user">{user ? user.email : "null"}</span>
      <span data-testid="loading">{loading ? "true" : "false"}</span>
      <span data-testid="error">{error ? error.message : "null"}</span>
      <button data-testid="refetch" onClick={() => refetch()}>
        Refetch
      </button>
    </div>
  );
};

describe("UserContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("provides default values when data is undefined", () => {
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

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("loading")).toHaveTextContent("true");
    expect(screen.getByTestId("error")).toHaveTextContent("null");
  });

  it("sets user when data is available", () => {
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

    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("null");
  });

  it("handles errors", () => {
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

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("error")).toHaveTextContent("Network error");
  });

  it("calls refetch when button clicked", () => {
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

    act(() => {
      screen.getByTestId("refetch").click();
    });

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("throws error when used outside provider", () => {
    const renderOutsideProvider: () => void = () => render(<TestComponent />);
    expect(renderOutsideProvider).toThrow(
      "useUser must be used within a UserProvider"
    );
  });
});