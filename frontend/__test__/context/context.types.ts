import { GetMeQuery } from "@/types/graphql";

export type TestComponentProps = Record<string, never>;

export type LocalStorageMock = {
  getItem: jest.Mock<string | null, [string]>;
  setItem: jest.Mock<void, [string, string]>;
  removeItem: jest.Mock<void, [string]>;
  clear: jest.Mock<void, []>;
};

export type UseGetMeQueryMock = {
  data?: GetMeQuery;
  loading: boolean;
  error: Error | null;
  refetch: jest.Mock;
};
