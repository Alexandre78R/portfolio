import "reflect-metadata";

import { PrismaClient, Signature as PrismaSignature } from "@prisma/client";
import { SignatureResolver } from "../../../src/resolvers/signature.resolver";
import { SignaturesResponse } from "../../../src/types/response.types";

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    signature: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  })),
}));

describe("SignatureResolver - listSignatures", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = new PrismaClient() as jest.Mocked<PrismaClient>;
    resolver = new SignatureResolver(mockDb);
  });

  it("Should return signatures with pagination", async () => {
    const mockSignatures: PrismaSignature[] = [
      mockSignature1,
      mockSignature2,
    ];

    (mockDb.signature.findMany as jest.Mock).mockResolvedValueOnce(
      mockSignatures
    );
    (mockDb.signature.count as jest.Mock).mockResolvedValueOnce(2);

    const result: SignaturesResponse = await resolver.listSignatures({
      page: 1,
      limit: 10,
      searchTerm: undefined,
    });

    expect(result.code).toBe(200);
    expect(result.message).toBe("Signatures fetched successfully");
    expect(result.signatures).toEqual(mockSignatures);
    expect(result.total).toBe(2);
    expect(mockDb.signature.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      orderBy: { id: "desc" },
    });
  });

  it("Should filter signatures by search term", async () => {
    const filteredSignatures: PrismaSignature[] = [mockSignature1];

    (mockDb.signature.findMany as jest.Mock).mockResolvedValueOnce(
      filteredSignatures
    );
    (mockDb.signature.count as jest.Mock).mockResolvedValueOnce(1);

    const result: SignaturesResponse = await resolver.listSignatures({
      page: 1,
      limit: 10,
      searchTerm: "Signature1",
    });

    expect(result.code).toBe(200);
    expect(result.signatures?.length).toBe(1);
    expect(result.signatures?.[0]?.name).toBe("Signature1");
    expect(mockDb.signature.findMany).toHaveBeenCalledWith({
      where: {
        name: { contains: "Signature1", mode: "insensitive" },
      },
      skip: 0,
      take: 10,
      orderBy: { id: "desc" },
    });
  });

  it("Should handle pagination correctly", async () => {
    (mockDb.signature.findMany as jest.Mock).mockResolvedValueOnce([
      mockSignature2,
    ]);
    (mockDb.signature.count as jest.Mock).mockResolvedValueOnce(2);

    const result: SignaturesResponse = await resolver.listSignatures({
      page: 2,
      limit: 1,
      searchTerm: undefined,
    });

    expect(result.code).toBe(200);
    expect(mockDb.signature.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 1,
      take: 1,
      orderBy: { id: "desc" },
    });
  });

  it("Should return error on database failure", async () => {
    const error: Error = new Error("Database connection failed");
    (mockDb.signature.findMany as jest.Mock).mockRejectedValueOnce(error);

    const result: SignaturesResponse = await resolver.listSignatures({
      page: 1,
      limit: 10,
      searchTerm: undefined,
    });

    expect(result.code).toBe(500);
    expect(result.message).toBe("Error fetching signatures");
  });

  it("Should return empty array when no signatures exist", async () => {
    (mockDb.signature.findMany as jest.Mock).mockResolvedValueOnce([]);
    (mockDb.signature.count as jest.Mock).mockResolvedValueOnce(0);

    const result: SignaturesResponse = await resolver.listSignatures({
      page: 1,
      limit: 10,
      searchTerm: undefined,
    });

    expect(result.code).toBe(200);
    expect(result.signatures).toEqual([]);
    expect(result.total).toBe(0);
  });
});
