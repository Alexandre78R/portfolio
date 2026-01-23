import "reflect-metadata";

import { PrismaClient, Signature as PrismaSignature } from "@prisma/client";
import { SignatureResolver } from "../../../src/resolvers/signature.resolver";
import { SignatureResponse } from "../../../src/types/response.types";
import { MyContext } from "../../../src/index";
import { UserRole } from "../../../src/entities/user.entity";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    signature: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  })),
}));

describe("SignatureResolver - deleteSignature", () => {
  let resolver: SignatureResolver;
  let mockDb: jest.Mocked<PrismaClient>;

  const mockSignature1: PrismaSignature = {
    id: 1,
    name: "Signature1",
    description: "<p><strong>Cordialement,</strong></p><p>Alexandre</p>",
  };

  const mockAdminContext: MyContext = {
    user: {
      id: 1,
      firstname: "Admin",
      lastname: "User",
      email: "admin@test.com",
      role: UserRole.admin,
      isPasswordChange: true,
    },
  } as MyContext;

  const mockEditorContext: MyContext = {
    user: {
      id: 2,
      firstname: "Editor",
      lastname: "User",
      email: "editor@test.com",
      role: UserRole.editor,
      isPasswordChange: false,
    },
  } as MyContext;

  const mockNoAuthContext: MyContext = {
    user: null,
  } as MyContext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = new PrismaClient() as jest.Mocked<PrismaClient>;
    resolver = new SignatureResolver(mockDb);
  });

  it("Should delete a signature successfully", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.delete as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.deleteSignature(
      1,
      mockAdminContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Signature deleted successfully");
    expect(mockDb.signature.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("Should return 401 when not authenticated", async () => {
    const result: SignatureResponse = await resolver.deleteSignature(
      1,
      mockNoAuthContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required");
  });

  it("Should return 403 when user is not admin", async () => {
    const result: SignatureResponse = await resolver.deleteSignature(
      1,
      mockEditorContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Only admins can delete signatures");
  });

  it("Should return 400 for invalid ID", async () => {
    const result: SignatureResponse = await resolver.deleteSignature(
      -1,
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 400 for non-integer ID", async () => {
    const result: SignatureResponse = await resolver.deleteSignature(
      1.5,
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 400 for zero ID", async () => {
    const result: SignatureResponse = await resolver.deleteSignature(
      0,
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 404 when signature not found", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result: SignatureResponse = await resolver.deleteSignature(
      999,
      mockAdminContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Signature with ID 999 not found");
  });

  it("Should handle database error during deletion", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.delete as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const result: SignatureResponse = await resolver.deleteSignature(
      1,
      mockAdminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error deleting signature");
  });
});
