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

interface UserMock {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  isPasswordChange: boolean;
  pseudo: string | null;
  ban: boolean;
}

describe("UserResolver - login", () => {
  let resolver: UserResolver;
  let mockCookies: DeepMockProxy<Cookies>;
  let mockContext: MyContext;

  const mockExistingUser: UserMock = {
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
    email: mockExistingUser.email,
    password: "plain_password",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.findUnique.mockReset();

    resolver = new UserResolver(prismaMock);

    mockCookies = mockDeep<Cookies>();
    mockContext = {
      req: {} as any,
      res: {} as any,
      cookies: mockCookies,
      user: null,
      apiKey: undefined,
      token: undefined,
    };

    (argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValue(true);
    process.env.JWT_SECRET = "test_secret";
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("should successfully log in a user and set a cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);

    const result: LoginResponse = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Login successful.");
    expect(result.token).toBe("fake-jwt-token");

    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginInput.email },
    });
    expect(argon2.verify).toHaveBeenCalledWith(mockExistingUser.password, loginInput.password);

    expect(mockContext.cookies.set).toHaveBeenCalledTimes(1);
    expect(mockContext.cookies.set).toHaveBeenCalledWith(
      "token",
      "fake-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      })
    );
  });

  it("should return 401 if user not found", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result: LoginResponse = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();
  });

  it("should return 401 if password invalid", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    (argon2.verify as jest.MockedFunction<typeof argon2.verify>).mockResolvedValueOnce(false);

    const result: LoginResponse = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();
  });

  it("should return 500 if JWT_SECRET not set", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    delete process.env.JWT_SECRET;

    const result: LoginResponse = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Please check your JWT configuration !");
    expect(result.token).toBeUndefined();
  });

  it("should return 500 for unexpected errors", async () => {
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error("Database connection failed"));

    const result: LoginResponse = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Database connection failed");
    expect(result.token).toBeUndefined();
  });
});