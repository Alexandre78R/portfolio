import "reflect-metadata";

import { UserResolver } from "../../../src/resolvers/user.resolver";
import { PrismaClient, User as PrismaUser, Role } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { UserResponse } from "../../../src/types/response.types";

type MockPrismaUser = {
  findUnique: jest.Mock<Promise<PrismaUser | null>, [any?]>;
  update: jest.Mock<Promise<PrismaUser>, [any?]>;
};

describe("UserResolver - updateUser", () => {
  let resolver: UserResolver;
  let mockDb: { user: MockPrismaUser };

  const adminCtx: MyContext = { 
    user: { id: 1, role: UserRole.admin, email: "admin@example.com" } 
  } as MyContext;
  
  const editorCtx: MyContext = { 
    user: { id: 2, role: UserRole.editor, email: "editor@example.com" } 
  } as MyContext;

  const fakeUser: PrismaUser = {
    id: 3,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "hashedPassword123",
    role: Role.editor,
    isPasswordChange: false,
  };

  const updatedUser: PrismaUser = {
    id: 3,
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    password: "hashedPassword123",
    role: Role.admin,
    isPasswordChange: false,
  };

  beforeEach(() => {
    mockDb = {
      user: {
        findUnique: jest.fn<Promise<PrismaUser | null>, [any?]>(),
        update: jest.fn<Promise<PrismaUser>, [any?]>(),
      },
    };

    resolver = new UserResolver(mockDb as unknown as PrismaClient);
  });

  it("should update user successfully with all fields", async () => {
    mockDb.user.findUnique
      .mockResolvedValueOnce(fakeUser) // Premier appel : trouver l'utilisateur
      .mockResolvedValueOnce(null); // Deuxième appel : vérifier que le nouvel email n'existe pas
    mockDb.user.update.mockResolvedValue(updatedUser);

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      "Smith",
      "jane.smith@example.com",
      UserRole.admin,
      adminCtx
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("User updated successfully.");
    expect(result.user).toBeDefined();
    expect(result.user?.firstname).toBe("Jane");
    expect(result.user?.lastname).toBe("Smith");
    expect(result.user?.email).toBe("jane.smith@example.com");
    expect(result.user?.role).toBe(UserRole.admin);
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        role: UserRole.admin,
      },
    });
  });

  it("should update only firstname", async () => {
    const partialUpdate: PrismaUser = { ...fakeUser, firstname: "Jane" };
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockResolvedValue(partialUpdate);

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      undefined,
      undefined,
      adminCtx
    );

    expect(result.code).toBe(200);
    expect(result.user?.firstname).toBe("Jane");
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { firstname: "Jane" },
    });
  });

  it("should update only role", async () => {
    const roleUpdate: PrismaUser = { ...fakeUser, role: Role.admin };
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockResolvedValue(roleUpdate);

    const result: UserResponse = await resolver.updateUser(
      3,
      undefined,
      undefined,
      undefined,
      UserRole.admin,
      adminCtx
    );

    expect(result.code).toBe(200);
    expect(result.user?.role).toBe(UserRole.admin);
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: { role: UserRole.admin },
    });
  });

  it("should return 404 when user not found", async () => {
    mockDb.user.findUnique.mockResolvedValue(null);

    const result: UserResponse = await resolver.updateUser(
      999,
      "Jane",
      undefined,
      undefined,
      undefined,
      adminCtx
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("User not found");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("should return 401 when user is not authenticated", async () => {
    const unauthenticatedCtx: MyContext = { user: null } as MyContext;

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      undefined,
      undefined,
      unauthenticatedCtx
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not admin", async () => {
    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      undefined,
      undefined,
      editorCtx
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.findUnique).not.toHaveBeenCalled();
  });

  it("should return 409 when email already exists", async () => {
    const existingEmailUser: PrismaUser = {
      id: 5,
      firstname: "Other",
      lastname: "User",
      email: "existing@example.com",
      password: "hashedPassword",
      role: Role.view,
      isPasswordChange: true,
    };

    mockDb.user.findUnique
      .mockResolvedValueOnce(fakeUser) // Premier appel : trouver l'utilisateur à mettre à jour
      .mockResolvedValueOnce(existingEmailUser); // Deuxième appel : email existe déjà

    const result: UserResponse = await resolver.updateUser(
      3,
      undefined,
      undefined,
      "existing@example.com",
      undefined,
      adminCtx
    );

    expect(result.code).toBe(409);
    expect(result.message).toBe("Email already exists");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("should return 400 when email format is invalid", async () => {
    mockDb.user.findUnique.mockResolvedValue(fakeUser);

    const result: UserResponse = await resolver.updateUser(
      3,
      undefined,
      undefined,
      "invalid-email",
      undefined,
      adminCtx
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("You have entered an invalid email address.");
    expect(result.user).toBeUndefined();
    expect(mockDb.user.update).not.toHaveBeenCalled();
  });

  it("should allow updating to same email", async () => {
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockResolvedValue(fakeUser);

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      "john.doe@example.com", // Même email
      undefined,
      adminCtx
    );

    expect(result.code).toBe(200);
    expect(mockDb.user.update).toHaveBeenCalled();
    // Ne devrait pas vérifier si l'email existe car c'est le même
    expect(mockDb.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it("should handle database errors gracefully", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockRejectedValue(new Error("Database error"));

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      undefined,
      undefined,
      adminCtx
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Internal server error while updating user.");
    expect(result.user).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error in updateUser:", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it("should not include password in returned user object", async () => {
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockResolvedValue(updatedUser);

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      undefined,
      undefined,
      undefined,
      adminCtx
    );

    expect(result.user).toBeDefined();
    expect(result.user).not.toHaveProperty("password");
  });

  it("should update multiple fields at once", async () => {
    const multiUpdate: PrismaUser = {
      ...fakeUser,
      firstname: "Jane",
      lastname: "Smith",
      role: Role.admin,
    };
    
    mockDb.user.findUnique.mockResolvedValue(fakeUser);
    mockDb.user.update.mockResolvedValue(multiUpdate);

    const result: UserResponse = await resolver.updateUser(
      3,
      "Jane",
      "Smith",
      undefined,
      UserRole.admin,
      adminCtx
    );

    expect(result.code).toBe(200);
    expect(result.user?.firstname).toBe("Jane");
    expect(result.user?.lastname).toBe("Smith");
    expect(result.user?.role).toBe(UserRole.admin);
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: 3 },
      data: {
        firstname: "Jane",
        lastname: "Smith",
        role: UserRole.admin,
      },
    });
  });
});