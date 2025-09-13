import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User as GraphQLUser, UserRole } from "../../../src/entities/user.entity";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import * as argon2 from "argon2";

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

describe("UserResolver - login & logout", () => {
  let resolver: UserResolver;
  let mockCookies: DeepMockProxy<Cookies>;
  let baseMockContext: MyContext;

  const prismaUserMock: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    isPasswordChange: boolean;
  } = {
    id: 1,
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    password: "hashed_password_from_db",
    role: UserRole.admin,
    isPasswordChange: false,
  };

  const gqlUserMock: GraphQLUser = {
    id: 1,
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    role: UserRole.admin,
    isPasswordChange: false,
  };

  const loginInput = {
    email: prismaUserMock.email,
    password: "plain_password",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    resolver = new UserResolver(prismaMock);

    mockCookies = mockDeep<Cookies>();

    baseMockContext = {
      req: {} as any,
      res: {} as any,
      cookies: mockCookies,
      user: null,
      apiKey: undefined,
      token: undefined,
    };

    (argon2.verify as jest.Mock).mockResolvedValue(true);
  });

  // ------------------------
  // LOGIN
  // ------------------------
  it("should log in successfully and set cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(prismaUserMock);

    const result = await resolver.login(loginInput, baseMockContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Login successful.");
    expect(result.token).toBe("fake-jwt-token");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginInput.email },
    });

    expect(argon2.verify).toHaveBeenCalledWith(prismaUserMock.password, loginInput.password);

    expect(mockCookies.set).toHaveBeenCalledWith(
      "token",
      "fake-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    );
  });

  // ------------------------
  // LOGOUT
  // ------------------------
  it("should log out successfully and clear cookie", async () => {
    const context: MyContext = {
      ...baseMockContext,
      user: gqlUserMock,
    };

    const result = await resolver.logout(context);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Logged out successfully.");

    expect(mockCookies.set).toHaveBeenCalledWith(
      "token",
      "",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "lax",
        path: "/",
        expires: expect.any(Date),
      })
    );

    const setArgs = mockCookies.set.mock.calls[0];
    expect(setArgs[2]?.expires?.getTime()).toBe(0);

    expect(context.user).toBeNull();
  });

  it("should return 401 if no user authenticated", async () => {
    const context: MyContext = { ...baseMockContext, user: null };

    const result = await resolver.logout(context);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(mockCookies.set).not.toHaveBeenCalled();
  });
});