import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import { User, UserRole } from "../../../src/entities/user.entity";
import { MyContext } from "../../../src";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { UsersResponse } from "../../../src/types/response.types";

describe("UserResolver - userList", () => {
  let resolver: UserResolver;
  let mockCookies: DeepMockProxy<Cookies>;
  let baseContext: Readonly<MyContext>;

  const adminUser: Readonly<User> = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const regularUser: Readonly<User> = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "user@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  const usersFromDb: (User & { password: string })[] = [
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
    mockCookies = mockDeep<Cookies>();

    baseContext = {
      req: {} as MyContext["req"],
      res: {} as MyContext["res"],
      cookies: mockCookies,
      user: null,
      apiKey: undefined,
      token: undefined,
    };
  });

  it("should return a list of users for an authenticated admin user", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };

    prismaMock.user.findMany.mockResolvedValueOnce(usersFromDb);

    const result: UsersResponse = await resolver.userList(context);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Users fetched");
    expect(result.users).toHaveLength(2);
    expect(result.users?.[0].email).toBe("admin@example.com");
    expect(result.users?.[1].email).toBe("user@example.com");

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 401 if no user is authenticated", async () => {
    const context: MyContext = { ...baseContext, user: null };

    const result: UsersResponse = await resolver.userList(context);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should return 403 if authenticated user is not an admin", async () => {
    const context: MyContext = { ...baseContext, user: regularUser };

    const result: UsersResponse = await resolver.userList(context);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should return 500 for unexpected server errors during user fetching", async () => {
    const context: MyContext = { ...baseContext, user: adminUser };

    prismaMock.user.findMany.mockRejectedValueOnce(new Error("Database connection error"));

    const result: UsersResponse = await resolver.userList(context);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching users");
    expect(result.users).toBeUndefined();

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });
});