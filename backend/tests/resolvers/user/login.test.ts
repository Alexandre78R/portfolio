import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import * as argon2 from "argon2";
import { MyContext } from "../../../src";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { UserRole } from "../../../src/entities/user.entity";
import { LoginResponse } from "../../../src/types/response.types";

jest.mock("jose", () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue("fake-jwt-token"),
  })),
}));

jest.mock("argon2");

interface LoginInput {
  email: string;
  password: string;
}

describe("UserResolver - login", () => {
  let resolver: UserResolver;
  let cookiesMock: DeepMockProxy<Cookies>;

  const prismaUserMock: Readonly<{
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    isPasswordChange: boolean;
    pseudo: string | null;
    ban: boolean;
  }> = {
    id: 1,
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    password: "hashed_password_from_db",
    role: UserRole.admin,
    isPasswordChange: false,
    pseudo: null,
    ban: false,
  };

  const loginInput: LoginInput = {
    email: prismaUserMock.email,
    password: "plain_password",
  };

  const baseContext: Readonly<MyContext> = {
    req: {} as MyContext["req"],
    res: {} as MyContext["res"],
    cookies: {} as Cookies,
    user: null,
    apiKey: undefined,
    token: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.findUnique.mockReset();

    resolver = new UserResolver(prismaMock);
    cookiesMock = mockDeep<Cookies>();

    (argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValue(true);
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("should successfully log in a user and set a cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(prismaUserMock);

    const context: MyContext = { ...baseContext, cookies: cookiesMock };

    const result: LoginResponse = await resolver.login(loginInput, context);

    expect(result.code as number).toBe(200);
    expect(result.message as string).toBe("Login successful.");
    expect(result.token as string).toBe("fake-jwt-token");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginInput.email },
    });

    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith(prismaUserMock.password, loginInput.password);

    expect(cookiesMock.set).toHaveBeenCalledTimes(1);
    expect(cookiesMock.set).toHaveBeenCalledWith(
      "token",
      "fake-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      }),
    );
  });

  it("should return 401 if the user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const context: MyContext = { ...baseContext, cookies: cookiesMock };

    const result: LoginResponse = await resolver.login(loginInput, context);

    expect(result.code as number).toBe(401);
    expect(result.message as string).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if password is invalid", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(prismaUserMock);
    (argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValueOnce(false);

    const context: MyContext = { ...baseContext, cookies: cookiesMock };

    const result: LoginResponse = await resolver.login(loginInput, context);

    expect(result.code as number).toBe(401);
    expect(result.message as string).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();

    expect(argon2.verify).toHaveBeenCalledTimes(1);
  });

  it("should return 500 if JWT_SECRET is not set", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(prismaUserMock);
    delete process.env.JWT_SECRET;

    const context: MyContext = { ...baseContext, cookies: cookiesMock };

    const result: LoginResponse = await resolver.login(loginInput, context);

    expect(result.code as number).toBe(500);
    expect(result.message as string).toBe("Please check your JWT configuration !");
    expect(result.token).toBeUndefined();
  });

  it("should return 500 for unexpected errors", async () => {
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error("Database connection failed"));

    const context: MyContext = { ...baseContext, cookies: cookiesMock };

    const result: LoginResponse = await resolver.login(loginInput, context);

    expect(result.code as number).toBe(500);
    expect(result.message as string).toBe("Database connection failed");
    expect(result.token).toBeUndefined();
  });
});