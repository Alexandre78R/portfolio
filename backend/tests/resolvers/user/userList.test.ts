import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import { User, UserRole } from "../../../src/entities/user.entity"; // Assure-toi que User et UserRole sont bien importés
import { MyContext } from "../../../src";
import Cookies from 'cookies';
import { mockDeep } from 'jest-mock-extended';

describe("UserResolver - userList", () => {
  let resolver: UserResolver;

  const mockCookies = mockDeep<Cookies>();

  
  const mockAdminUserInContext: User = { 
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true, 
  };

  const mockRegularUserInContext: User = { 
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "user@example.com",
    role: UserRole.view, 
    isPasswordChange: true,
  };

  // Contexte mock de base. Nous modifierons la propriété 'user' pour chaque cas de test.
  const baseMockContext: MyContext = {
    req: {} as any, 
    res: {} as any, 
    cookies: mockCookies,
    user: null, 
    apiKey: undefined, 
  };

  // Les utilisateurs mockés retournés par Prisma's findMany.
  const mockUsersFromDb = [
    {
      id: 1,
      firstname: "Admin",
      lastname: "User",
      email: "admin@example.com",
      password: "hashed_password_admin", 
      role: UserRole.admin,
      isPasswordChange: true,
    },
    {
      id: 2,
      firstname: "Regular",
      lastname: "User",
      email: "user@example.com",
      password: "hashed_password_user",
      role: UserRole.admin,
      isPasswordChange: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.findMany.mockReset(); 
    
    resolver = new UserResolver(prismaMock);

    mockCookies.set.mockClear(); 
    mockCookies.get.mockClear();
  });

  // --- Scénarios de Test ---

  it("should return a list of users for an authenticated admin user", async () => {
    // Définis le contexte pour un utilisateur admin en utilisant le mockAdminUserInContext
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUserInContext, // Utilise le mock sans 'password'
    };

    // Mock le findMany de Prisma pour retourner une liste d'utilisateurs
    prismaMock.user.findMany.mockResolvedValueOnce(mockUsersFromDb as any); // Caste si nécessaire pour s'assurer que Prisma le consomme bien

    const result = await resolver.userList(adminContext);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Users fetched");
    expect(result.users).toBeDefined();
    expect(result.users?.length).toBe(2);
    expect(result.users?.[0].email).toBe("admin@example.com");
    expect(result.users?.[1].email).toBe("user@example.com");

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated (ctx.user is null)", async () => {
    const unauthenticatedContext: MyContext = {
      ...baseMockContext,
      user: null, // Correctement défini à null
    };

    const result = await resolver.userList(unauthenticatedContext);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    // Définis le contexte pour un utilisateur standard en utilisant le mockRegularUserInContext
    const regularUserContext: MyContext = {
      ...baseMockContext,
      user: mockRegularUserInContext, // Utilise le mock sans 'password'
    };

    const result = await resolver.userList(regularUserContext);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should return 500 for an unexpected server error during user fetching", async () => {
    // Définis le contexte pour un utilisateur admin
    const adminContext: MyContext = {
      ...baseMockContext,
      user: mockAdminUserInContext, // Utilise le mock sans 'password'
    };

    const errorMessage = "Database connection error during findMany";
    prismaMock.user.findMany.mockRejectedValueOnce(new Error(errorMessage));

    const result = await resolver.userList(adminContext);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching users");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });
});