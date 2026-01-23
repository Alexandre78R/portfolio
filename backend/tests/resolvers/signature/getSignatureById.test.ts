import "reflect-metadata";

import { PrismaClient, Signature as PrismaSignature } from "@prisma/client";
import { SignatureResolver } from "../../../src/resolvers/signature.resolver";
import { SignatureResponse } from "../../../src/types/response.types";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    signature: {
      findUnique: jest.fn(),
    },
  })),
}));

describe("SignatureResolver - getSignatureById", () => {
  let resolver: SignatureResolver;
  let mockDb: jest.Mocked<PrismaClient>;

  const mockSignature1: PrismaSignature = {
    id: 1,
    name: "Signature1",
    description: "<p><strong>Cordialement,</strong></p><p>Alexandre</p>",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = new PrismaClient() as jest.Mocked<PrismaClient>;
    resolver = new SignatureResolver(mockDb);
  });

  it("Should return a signature by ID", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(
      mockSignature1
    );

    const result: SignatureResponse = await resolver.getSignatureById(1);

    expect(result.code).toBe(200);
    expect(result.message).toBe("Signature fetched successfully");
    expect(result.signature).toEqual(mockSignature1);
    expect(mockDb.signature.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("Should return 404 when signature not found", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result: SignatureResponse = await resolver.getSignatureById(999);

    expect(result.code).toBe(404);
    expect(result.message).toBe("Signature with ID 999 not found");
    expect(result.signature).toBeUndefined();
  });

  it("Should return 400 for invalid ID", async () => {
    const result: SignatureResponse = await resolver.getSignatureById(-1);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 400 for non-integer ID", async () => {
    const result: SignatureResponse = await resolver.getSignatureById(1.5);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should return 400 for zero ID", async () => {
    const result: SignatureResponse = await resolver.getSignatureById(0);

    expect(result.code).toBe(400);
    expect(result.message).toBe("Invalid signature ID");
  });

  it("Should handle database error", async () => {
    (mockDb.signature.findUnique as jest.Mock).mockRejectedValueOnce(
      new Error("Database error")
    );

    const result: SignatureResponse = await resolver.getSignatureById(1);

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching signature");
  });
});
