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
      update: jest.fn(),
    },
  })),
}));

describe("SignatureResolver - updateSignature", () => {
  let resolver: SignatureResolver;
  let mockDb: jest.Mocked<PrismaClient>;

  const mockSignature1: PrismaSignature = {
    id: 1,
    name: "Signature1",
    description: "<p><strong>Cordialement,</strong></p><p>Alexandre</p>",
  };

  const mockSignature2: PrismaSignature = {
    id: 2,
    name: "Signature2",
    description: "<p>Bien à vous,</p><p><strong>Alex</strong></p>",
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

  it("Should update signature name and description", async () => {
    const updatedSignature: PrismaSignature = {
      ...mockSignature1,
      name: "UpdatedSignature1",
      description: "Updated description",
    };

    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.update as jest.Mock).mockResolvedValueOnce(
      updatedSignature
    );

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "UpdatedSignature1",
        description: "Updated description",
      },
      mockAdminContext
    );

    expect(result.code).toBe(200);
    expect(result.message).toBe("Signature updated successfully");
    expect(result.signature?.name).toBe("UpdatedSignature1");
  });

  it("Should update only name when description is not provided", async () => {
    const updatedSignature: PrismaSignature = {
      ...mockSignature1,
      name: "UpdatedSignature1",
    };

    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.update as jest.Mock).mockResolvedValueOnce(
      updatedSignature
    );

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "UpdatedSignature1",
      },
      mockAdminContext
    );

    expect(result.code).toBe(200);
    expect(mockDb.signature.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: "UpdatedSignature1" },
    });
  });

  it("Should return 401 when not authenticated", async () => {
    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "UpdatedSignature1",
      },
      mockNoAuthContext
    );

    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required");
  });

  it("Should return 403 when user is not admin", async () => {
    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "UpdatedSignature1",
      },
      mockEditorContext
    );

    expect(result.code).toBe(403);
    expect(result.message).toBe("Only admins can update signatures");
  });

  it("Should return 400 for invalid ID", async () => {
    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: -1,
        name: "UpdatedSignature1",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 400 for non-integer ID", async () => {
    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1.5,
        name: "UpdatedSignature1",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 404 when signature not found", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 999,
        name: "UpdatedSignature1",
      },
      mockAdminContext
    );

    expect(result.code).toBe(404);
    expect(result.message).toBe("Signature with ID 999 not found");
  });

  it("Should return 400 when name is empty", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature name cannot be empty");
  });

  it("Should return 400 when description is empty", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        description: "",
      },
      mockAdminContext
    );

    expect(result.code).toBe(400);
    expect(result.message).toBe("Signature description cannot be empty");
  });

  it("Should return 409 when new name already exists", async () => {
    (mockDb.signature.findUnique as jest.Mock)
      .mockResolvedValueOnce(mockSignature1)
      .mockResolvedValueOnce(mockSignature2);

    const result: SignatureResponse = await resolver.updateSignature(
      {
        id: 1,
        name: "Signature2",
      },
      mockAdminContext
    );

    expect(result.code).toBe(409);
    expect(result.message).toBe(
      'Signature with name "Signature2" already exists'
    );
  });

  it("Should not check for duplicate if name is unchanged", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.update as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    await resolver.updateSignature(
      {
        id: 1,
        name: "Signature1",
      },
      mockAdminContext
    );

    expect(mockDb.signature.findUnique).toHaveBeenCalledTimes(1);
  });

  it("Should trim name before update", async () => {
    const updatedSignature: PrismaSignature = {
      ...mockSignature1,
      name: "UpdatedSignature1",
    };

    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );
    (mockDb.signature.update as jest.Mock).mockResolvedValueOnce(
      updatedSignature
    );

    await resolver.updateSignature(
      {
        id: 1,
        name: "  UpdatedSignature1  ",
      },
      mockAdminContext
    );

    expect(mockDb.signature.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: "UpdatedSignature1" },
    });
  });
});
