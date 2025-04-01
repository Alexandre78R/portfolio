import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import { UserRole } from "../../../src/entities/user.entity";
import { MyContext } from "../../../src";
import Cookies from 'cookies'; 
import { mockDeep } from 'jest-mock-extended'; 

jest.mock("argon2");
jest.mock("jsonwebtoken");

describe("UserResolver - login", () => {
  let resolver: UserResolver;

  // Créons un mock profond pour la classe Cookies.
  const mockCookies = mockDeep<Cookies>();

  // Mock pour MyContext, incluant toutes les propriétés requises par MyContext
  const mockContext: MyContext = {
    req: {} as any, // Mock un objet req vide ou minimal si non utilisé
    res: {} as any, // Mock un objet res vide ou minimal si non utilisé
    cookies: mockCookies,
    user: null,
    apiKey: undefined, 

  };

  const mockExistingUser = {
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

  const loginInput = {
    email: mockExistingUser.email,
    password: "plain_password",
  };

  const originalJwtSecret = process.env.JWT_SECRET;

  beforeEach(() => {
    jest.clearAllMocks(); // Efface l'historique de tous les mocks Jest
    prismaMock.user.findUnique.mockReset(); 

    resolver = new UserResolver(prismaMock);

    // Mocks par défaut pour les dépendances externes
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

    // mockCookies est un mock profond, donc 'mockClear()' fonctionne sans problème de type.
    mockCookies.set.mockClear(); 
    mockCookies.get.mockClear(); 


    process.env.JWT_SECRET = "your_test_secret"; 
  });

  afterEach(() => {
 
    process.env.JWT_SECRET = originalJwtSecret;
  });

  // --- Scénarios de Test ---

  it("should successfully log in a user and set a cookie", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);

    const result = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Login successful.");
    expect(result.token).toBe("fake-jwt-token");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: loginInput.email },
    });

    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith(
      mockExistingUser.password,
      loginInput.password
    );

    expect(jwt.sign).toHaveBeenCalledTimes(1);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: mockExistingUser.id },
      "your_test_secret",
      { expiresIn: "7d" }
    );

    expect(mockContext.cookies.set).toHaveBeenCalledTimes(1);
    expect(mockContext.cookies.set).toHaveBeenCalledWith(
      "jwt",
      "fake-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      })
    );
  });

  it("should return 401 if user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(mockContext.cookies.set).not.toHaveBeenCalled();
  });

  it("should return 401 if password is incorrect", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

    const result = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Invalid credentials (email or password incorrect).");
    expect(result.token).toBeUndefined();
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(mockContext.cookies.set).not.toHaveBeenCalled();
  });

  it("should return 500 if JWT_SECRET is not set", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    delete process.env.JWT_SECRET; // Supprime le secret JWT pour ce test

    const result = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Please check your JWT configuration !");
    expect(result.token).toBeUndefined();
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(mockContext.cookies.set).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error", async () => {
    const errorMessage = "Database connection failed";
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.login(loginInput, mockContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe(errorMessage);
    expect(result.token).toBeUndefined();
    expect(argon2.verify).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
    expect(mockContext.cookies.set).not.toHaveBeenCalled();
  });
});