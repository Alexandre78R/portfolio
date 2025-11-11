import "reflect-metadata";

import { UserResolver } from "../../../src/resolvers/user.resolver";
import { PrismaClient, User as PrismaUser, Role } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { UserResponse } from "../../../src/types/response.types";

type MockPrismaUser = {
  findFirst: jest.Mock<Promise<PrismaUser | null>, [any?]>;
};

describe("UserResolver - userById", () => {
  let resolver: UserResolver;
  let mockDb: { user: MockPrismaUser };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const editorCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;

  const fakeUser: PrismaUser = {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "hashedPassword123",
    role: Role.admin,  // Utiliser l'enum de Prisma
    isPasswordChange: true,
  };

  beforeEach(() => {
    mockDb = {
      user: {
        findFirst: jest.fn<Promise<PrismaUser | null>, [any?]>(),
      },
    };

    resolver = new UserResolver(mockDb as unknown as PrismaClient);
  });

  it("should return user when found by admin", async () => {
    mockDb.user.findFirst.mockResolvedValue(fakeUser);

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("User found");
    expect(result.user).toBeDefined();
    expect(result.user?.id).toBe(1);
    expect(result.user?.firstname).toBe("John");
    expect(result.user?.lastname).toBe("Doe");
    expect(result.user?.email).toBe("john.doe@example.com");
    expect(result.user?.role).toBe(UserRole.admin);
    expect(result.user?.isPasswordChange).toBe(true);
    expect(mockDb.user.findFirst).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return 404 when user not found", async () => {
    mockDb.user.findFirst.mockResolvedValue(null);

    const result: UserResponse = await resolver.userById(999, adminCtx);
    
    expect(result.code).toBe(404);
    expect(result.message).toBe("User not found");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.findFirst).toHaveBeenCalledWith({ where: { id: 999 } });
  });

  it("should handle database errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockDb.user.findFirst.mockRejectedValue(new Error("Database connection failed"));

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error");
    expect(result.user).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it("should map user with editor role correctly", async () => {
    const editorUser: PrismaUser = {
      ...fakeUser,
      id: 2,
      role: Role.editor,  // Utiliser l'enum de Prisma
      isPasswordChange: false,
    };
    
    mockDb.user.findFirst.mockResolvedValue(editorUser);

    const result: UserResponse = await resolver.userById(2, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.user?.role).toBe(UserRole.editor);
    expect(result.user?.isPasswordChange).toBe(false);
  });

  it("should not include password in returned user object", async () => {
    mockDb.user.findFirst.mockResolvedValue(fakeUser);

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.user).toBeDefined();
    expect(result.user).not.toHaveProperty("password");
  });

  it("should handle admin role correctly", async () => {
    const adminUser: PrismaUser = { ...fakeUser, role: Role.admin };
    mockDb.user.findFirst.mockResolvedValue(adminUser);

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.user?.role).toBe(UserRole.admin);
  });

  it("should handle editor role correctly", async () => {
    const editorUser: PrismaUser = { ...fakeUser, role: Role.editor };
    mockDb.user.findFirst.mockResolvedValue(editorUser);

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.user?.role).toBe(UserRole.editor);
  });

  it("should handle view role correctly", async () => {
    const viewUser: PrismaUser = { ...fakeUser, role: Role.view };
    mockDb.user.findFirst.mockResolvedValue(viewUser);

    const result: UserResponse = await resolver.userById(1, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.user?.role).toBe(UserRole.view);
  });
});