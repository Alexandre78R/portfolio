import "reflect-metadata";

import { SocialResolver } from "../../../src/resolvers/social.resolver";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { SocialResponse } from "../../../src/types/response.types";

type MockPrismaSocial = {
  findUnique: jest.Mock<Promise<PrismaSocial | null>, [any?]>;
  delete: jest.Mock<Promise<PrismaSocial>, [any?]>;
};

describe("SocialResolver - deleteSocial", () => {
  let resolver: SocialResolver;
  let mockDb: { social: MockPrismaSocial };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const editorCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;
  const noUserCtx: MyContext = {} as MyContext;

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
        delete: jest.fn<Promise<PrismaSocial>, [any?]>(),
      },
    };

    resolver = new SocialResolver();
    Object.defineProperty(resolver, "db", {
      value: mockDb as unknown as PrismaClient,
      writable: true,
    });
  });

  it("should delete social for admin", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(fakeSocial);
    mockDb.social.delete.mockResolvedValue(fakeSocial);

    const result: SocialResponse = await resolver.deleteSocial(1, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("Social deleted successfully");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should return 403 for non-admin user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.deleteSocial(1, editorCtx);
    
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.delete).not.toHaveBeenCalled();
  });

  it("should return 401 if no user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.deleteSocial(1, noUserCtx);
    
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.delete).not.toHaveBeenCalled();
  });

  it("should return 404 if social does not exist", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(null);

    const result: SocialResponse = await resolver.deleteSocial(999, adminCtx);
    
    expect(result.code).toBe(404);
    expect(result.message).toBe("Social not found");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    mockDb.social.findUnique.mockRejectedValue(new Error("DB error"));

    const result: SocialResponse = await resolver.deleteSocial(1, adminCtx);
    
    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to delete social");
    expect(result.social).toBeUndefined();
  });
});
