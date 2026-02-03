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
      create: jest.fn(),
    },
  })),
}));

describe("SignatureResolver - createSignature", () => {
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

  it("Should create a new signature successfully", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (mockDb.signature.create as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "<p><strong>Cordialement,</strong></p><p>Alexandre</p>",
      },
      mockAdminContext
    );

    expect(result.code).toBe(201);
    expect(result.message).toBe("Signature created successfully");
    expect(result.signature).toEqual(mockSignature1);
    expect(mockDb.signature.create).toHaveBeenCalledWith({
      data: {
        name: "Signature1",
        description: "<p><strong>Cordialement,</strong></p><p>Alexandre</p>",
      },
    });
  });

  it("Should return 401 when not authenticated", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "Description",
      },
      mockNoAuthContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required");
  });

  it("Should return 403 when user is not admin", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "Description",
      },
      mockEditorContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Only admins can create signatures");
  });

  it("Should return 400 when name is empty", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "",
        description: "Description",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature name is required");
  });

  it("Should return 400 when name is only whitespace", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "   ",
        description: "Description",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature name is required");
  });

  it("Should return 400 when description is empty", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature description is required");
  });

  it("Should return 400 when description is only whitespace", async () => {
    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "   ",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature description is required");
  });

  it("Should return 409 when signature name already exists", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "New description",
      },
      mockAdminContext
    );

    expect(result.code).toBe(409);
    expect(result.message).toBe(
      'Signature with name "Signature1" already exists'
    );
  });

  it("Should handle database error during creation", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (mockDb.signature.create as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const result: SignatureResponse = await resolver.createSignature(
      {
        name: "Signature1",
        description: "Description",
      },
      mockAdminContext
    );

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error creating signature");
  });

  it("Should trim name before creation", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (mockDb.signature.create as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    await resolver.createSignature(
      {
        name: "  Signature1  ",
        description: "Description",
      },
      mockAdminContext
    );

    expect(mockDb.signature.create).toHaveBeenCalledWith({
      data: {
        name: "Signature1",
        description: "Description",
      },
    });
  });
});
