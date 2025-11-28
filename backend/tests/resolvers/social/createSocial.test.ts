import "reflect-metadata";

import { SocialResolver } from "../../../src/resolvers/social.resolver";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { SocialResponse } from "../../../src/types/response.types";
import type { CreateSocialInput } from "../../../src/entities/inputs/social.input";

type MockPrismaSocial = {
  create: jest.Mock<Promise<PrismaSocial>, [any?]>;
};

describe("SocialResolver - createSocial", () => {
  let resolver: SocialResolver;
  let mockDb: { social: MockPrismaSocial };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const editorCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;
  const noUserCtx: MyContext = {} as MyContext;

  const fakeInput: CreateSocialInput = {
    title: "GitHub",
    url: "https://github.com/Alexandre78R",
    tab: 3,
  };

  const fakeSocial: PrismaSocial = { ...fakeInput, id: 1 };

  beforeEach((): void => {
    mockDb = {
      social: {
        create: jest.fn<Promise<PrismaSocial>, [any?]>(),
      },
    };

    resolver = new SocialResolver();
    Object.defineProperty(resolver, "db", {
      value: mockDb as unknown as PrismaClient,
      writable: true,
    });
  });

  it("should create social for admin", async (): Promise<void> => {
    mockDb.social.create.mockResolvedValue(fakeSocial);

    const result: SocialResponse = await resolver.createSocial(fakeInput, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("Social created successfully");
    expect(result.social?.id).toBe(1);
    expect(result.social?.title).toBe("GitHub");
    expect(mockDb.social.create).toHaveBeenCalledWith({
      data: {
        title: fakeInput.title,
        url: fakeInput.url,
        tab: fakeInput.tab,
      },
    });
  });

  it("should return 403 for non-admin user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.createSocial(fakeInput, editorCtx);
    
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin role required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.create).not.toHaveBeenCalled();
  });

  it("should return 401 if no user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.createSocial(fakeInput, noUserCtx);
    
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.create).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    mockDb.social.create.mockRejectedValue(new Error("DB error"));

    const result: SocialResponse = await resolver.createSocial(fakeInput, adminCtx);
    
    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to create social");
    expect(result.social).toBeUndefined();
  });
});
