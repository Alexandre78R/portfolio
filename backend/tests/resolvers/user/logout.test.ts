import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User as GraphQLUser, UserRole } from "../../../src/entities/user.entity";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { LoginResponse, Response } from "../../../src/types/response.types";

jest.mock("argon2");
jest.mock("jose", () => {
  const original = jest.requireActual("jose");
  return {
    ...original,
    SignJWT: jest.fn().mockImplementation(() => ({
      setProtectedHeader: jest.fn().mockReturnThis(),
      setIssuedAt: jest.fn().mockReturnThis(),
      setExpirationTime: jest.fn().mockReturnThis(),
      sign: jest.fn().mockResolvedValue("fake-jwt-token"),
    })),
  };
});

describe("UserResolver - logout", () => {
  let resolver: UserResolver;
  let cookiesMock: DeepMockProxy<Cookies>;
  let baseContext: Readonly<MyContext>;

  const gqlUserMock: Readonly<GraphQLUser> = {
    id: 1,
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    role: UserRole.admin,
    isPasswordChange: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    resolver = new UserResolver(prismaMock);
    cookiesMock = mockDeep<Cookies>();

    baseContext = {
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: {} as Cookies,
      user: null,
      apiKey: undefined,
      token: undefined,
    };
  });

  it("should log out successfully and clear cookie", async () => {
    const context: MyContext = { ...baseContext, user: gqlUserMock, cookies: cookiesMock };

    const result: Response = await resolver.logout(context);

    expect(result.code as number).toBe(200);
    expect(result.message as string).toBe("Logged out successfully.");

    expect(cookiesMock.set).toHaveBeenCalledTimes(1);
    expect(cookiesMock.set).toHaveBeenCalledWith(
      "token",
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "lax",
        path: "/",
        expires: expect.any(Date),
      }),
    );

    const setArgs = cookiesMock.set.mock.calls[0];
    expect(setArgs[2]?.expires?.getTime()).toBe(0);

    expect(context.user).toBeNull();
  });

  it("should return 401 if no user authenticated during logout", async () => {
    const context: MyContext = { ...baseContext, user: null, cookies: cookiesMock };

    const result: Response = await resolver.logout(context);

    expect(result.code as number).toBe(401);
    expect(result.message as string).toBe("Authentication required.");
    expect(cookiesMock.set).not.toHaveBeenCalled();
  });
});