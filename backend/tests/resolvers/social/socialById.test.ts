import "reflect-metadata";

import { SocialResolver } from "../../../src/resolvers/social.resolver";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";
import type { SocialResponse } from "../../../src/types/response.types";

type MockPrismaSocial = {
  findUnique: jest.Mock<Promise<PrismaSocial | null>, [any?]>;
};

describe("SocialResolver - getSocialById", () => {
  let resolver: SocialResolver;
  let mockDb: { social: MockPrismaSocial };

  const fakeSocial: PrismaSocial = {
    id: 1,
    title: "GitHub",
    url: "https://github.com/Alexandre78R",
    tab: 3,
  };

  beforeEach((): void => {
    mockDb = {
      social: {
        findUnique: jest.fn<Promise<PrismaSocial | null>, [any?]>(),
      },
    };

    resolver = new SocialResolver();
    Object.defineProperty(resolver, "db", {
      value: mockDb as unknown as PrismaClient,
      writable: true,
    });
  });

  it("should return social by id", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(fakeSocial);

    const result: SocialResponse = await resolver.getSocialById(1);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("Social fetched successfully");
    expect(result.social?.id).toBe(1);
    expect(result.social?.title).toBe("GitHub");
    expect(mockDb.social.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return 404 if social not found", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(null);

    const result: SocialResponse = await resolver.getSocialById(999);
    
    expect(result.code).toBe(404);
    expect(result.message).toBe("Social not found");
    expect(result.social).toBeUndefined();
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    mockDb.social.findUnique.mockRejectedValue(new Error("DB error"));

    const result: SocialResponse = await resolver.getSocialById(1);
    
    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to fetch social");
    expect(result.social).toBeUndefined();
  });
});
