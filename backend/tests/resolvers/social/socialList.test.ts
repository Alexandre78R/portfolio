import "reflect-metadata";

import { SocialResolver } from "../../../src/resolvers/social.resolver";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";

type MockPrismaSocial = {
  findMany: jest.Mock<Promise<PrismaSocial[]>, [any?]>;
};

describe("SocialResolver - socialList", () => {
  let resolver: SocialResolver;
  let mockDb: { social: MockPrismaSocial };

  const fakeSocials: PrismaSocial[] = [
    {
      id: 1,
      title: "GitHub",
      url: "https://github.com/Alexandre78R",
      tab: 3,
    },
    {
      id: 2,
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/alexandrerenard/",
      tab: 3,
    },
  ];

  beforeEach((): void => {
    mockDb = {
      social: {
        findMany: jest.fn<Promise<PrismaSocial[]>, [any?]>(),
      },
    };

    resolver = new SocialResolver();
    Object.defineProperty(resolver, "db", {
      value: mockDb as unknown as PrismaClient,
      writable: true,
    });
  });

  it("should return all socials", async (): Promise<void> => {
    mockDb.social.findMany.mockResolvedValue(fakeSocials);

    const result: PrismaSocial[] = await resolver.socialList();
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("GitHub");
    expect(result[1].title).toBe("LinkedIn");
    expect(mockDb.social.findMany).toHaveBeenCalledWith({
      orderBy: { id: "asc" },
    });
  });

  it("should return empty array if no socials", async (): Promise<void> => {
    mockDb.social.findMany.mockResolvedValue([]);

    const result: PrismaSocial[] = await resolver.socialList();
    
    expect(result).toHaveLength(0);
    expect(mockDb.social.findMany).toHaveBeenCalled();
  });
});
