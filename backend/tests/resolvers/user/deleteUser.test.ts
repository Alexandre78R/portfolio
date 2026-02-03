import "reflect-metadata";

import { UserResolver } from "../../../src/resolvers/user.resolver";
import { PrismaClient, User as PrismaUser, Role } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { Response } from "../../../src/types/response.types";

type MockPrismaUser = {
  findUnique: jest.Mock<Promise<PrismaUser | null>, [any?]>;
  delete: jest.Mock<Promise<PrismaUser>, [any?]>;
};

describe("UserResolver - deleteUser", () => {
  let resolver: UserResolver;
  let mockDb: { user: MockPrismaUser };

  const adminCtx: MyContext = { 
    user: { id: 1, role: UserRole.admin, email: "admin@example.com" } 
  } as MyContext;
  
  const editorCtx: MyContext = { 
    user: { id: 2, role: UserRole.editor, email: "editor@example.com" } 
  } as MyContext;

  const fakeAdminUser: PrismaUser = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    password: "hashedPassword123",
    role: Role.admin,
    isPasswordChange: true,
  };

  const fakeUserToDelete: PrismaUser = {
    id: 3,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "hashedPassword456",
    role: Role.editor,
    isPasswordChange: false,
  };

  beforeEach(() => {
    mockDb = {
      user: {
        findUnique: jest.fn<Promise<PrismaUser | null>, [any?]>(),
        delete: jest.fn<Promise<PrismaUser>, [any?]>(),
      },
    };

    resolver = new UserResolver(mockDb as unknown as PrismaClient);
  });

  it("should delete user successfully when admin", async () => {
    mockDb.user.findUnique.mockResolvedValue(fakeUserToDelete);
    mockDb.user.delete.mockResolvedValue(fakeUserToDelete);

    const result: Response = await resolver.deleteUser(3, adminCtx);

    expect(result.code).toBe(200);
    expect(result.message).toBe("User deleted successfully.");
    expect(mockDb.user.findUnique).toHaveBeenCalledWith({ where: { id: 3 } });
    expect(mockDb.user.delete).toHaveBeenCalledWith({ where: { id: 3 } });
  });

  it("should return 404 when user not found", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const result: Response = await resolver.deleteUser(999, adminCtx);

    expect(result.code).toBe(404);
    expect(result.message).toBe("User not found");
    expect(mockDb.user.delete).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not authenticated", async () => {
    const unauthenticatedCtx: MyContext = { user: null } as MyContext;

    const result: Response = await resolver.deleteUser(3, unauthenticatedCtx);

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(mockDb.user.delete).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not admin", async () => {
    const result: Response = await resolver.deleteUser(3, editorCtx);

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
    expect(mockDb.user.delete).not.toHaveBeenCalled();
  });

  it("should prevent admin from deleting their own account", async () => {
    mockDb.user.findUnique.mockResolvedValue(fakeAdminUser);

    const result: Response = await resolver.deleteUser(1, adminCtx);

    expect(result.code).toBe(400);
    expect(result.message).toBe("You cannot delete your own account.");
    expect(mockDb.user.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockDb.user.findUnique.mockResolvedValue(fakeUserToDelete);
    mockDb.user.delete.mockRejectedValue(new Error("Database error"));

    const result: Response = await resolver.deleteUser(3, adminCtx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error while deleting user.");
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error in deleteUser:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it("should handle database error when finding user", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockDb.user.findUnique.mockRejectedValue(new Error("Database connection failed"));

    const result: Response = await resolver.deleteUser(3, adminCtx);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error while deleting user.");
    expect(mockDb.user.delete).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});