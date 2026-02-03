import "reflect-metadata";

import { SocialResolver } from "../../../src/resolvers/social.resolver";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";
import { UserRole } from "../../../src/entities/user.entity";
import type { MyContext } from "../../../src";
import type { SocialResponse } from "../../../src/types/response.types";
import type { UpdateSocialInput } from "../../../src/entities/inputs/social.input";

type MockPrismaSocial = {
  findUnique: jest.Mock<Promise<PrismaSocial | null>, [any?]>;
  update: jest.Mock<Promise<PrismaSocial>, [any?]>;
};

describe("SocialResolver - updateSocial", () => {
  let resolver: SocialResolver;
  let mockDb: { social: MockPrismaSocial };

  const adminCtx: MyContext = { user: { id: 1, role: UserRole.admin } } as MyContext;
  const editorCtx: MyContext = { user: { id: 2, role: UserRole.editor } } as MyContext;
  const viewerCtx: MyContext = { user: { id: 3, role: UserRole.view } } as MyContext;
  const noUserCtx: MyContext = {} as MyContext;

  const fakeExisting: PrismaSocial = {
    id: 1,
    title: "GitHub",
    url: "https://github.com/Alexandre78R",
    tab: 3,
  };

  const updateInput: UpdateSocialInput = {
    title: "GitHub Updated",
    url: "https://github.com/newuser",
  };

  const updatedSocial: PrismaSocial = { 
    ...fakeExisting, 
    title: "GitHub Updated",
    url: "https://github.com/newuser",
  };

  beforeEach((): void => {
    mockDb = {
      social: {
        findUnique: jest.fn<Promise<PrismaSocial | null>, [any?]>(),
        update: jest.fn<Promise<PrismaSocial>, [any?]>(),
      },
    };

    resolver = new SocialResolver();
    Object.defineProperty(resolver, "db", {
      value: mockDb as unknown as PrismaClient,
      writable: true,
    });
  });

  it("should update social for admin", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(fakeExisting);
    mockDb.social.update.mockResolvedValue(updatedSocial);

    const result: SocialResponse = await resolver.updateSocial(1, updateInput, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("Social updated successfully");
    expect(result.social?.title).toBe("GitHub Updated");
    expect(result.social?.url).toBe("https://github.com/newuser");
    expect(mockDb.social.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        title: updateInput.title ?? fakeExisting.title,
        url: updateInput.url ?? fakeExisting.url,
        tab: updateInput.tab ?? fakeExisting.tab,
      },
    });
  });

  it("should update social for editor", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(fakeExisting);
    mockDb.social.update.mockResolvedValue(updatedSocial);

    const result: SocialResponse = await resolver.updateSocial(1, updateInput, editorCtx);
    
    expect(result.code).toBe(200);
    expect(result.message).toBe("Social updated successfully");
    expect(result.social?.title).toBe("GitHub Updated");
  });

  it("should return 403 for viewer user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.updateSocial(1, updateInput, viewerCtx);
    
    expect(result.code).toBe(403);
    expect(result.message).toBe("Access denied. Admin or Editor role required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.update).not.toHaveBeenCalled();
  });

  it("should return 401 if no user", async (): Promise<void> => {
    const result: SocialResponse = await resolver.updateSocial(1, updateInput, noUserCtx);
    
    expect(result.code).toBe(401);
    expect(result.message).toBe("Authentication required.");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.update).not.toHaveBeenCalled();
  });

  it("should return 404 if social does not exist", async (): Promise<void> => {
    mockDb.social.findUnique.mockResolvedValue(null);

    const result: SocialResponse = await resolver.updateSocial(999, updateInput, adminCtx);
    
    expect(result.code).toBe(404);
    expect(result.message).toBe("Social not found");
    expect(result.social).toBeUndefined();
    expect(mockDb.social.update).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async (): Promise<void> => {
    mockDb.social.findUnique.mockRejectedValue(new Error("DB error"));

    const result: SocialResponse = await resolver.updateSocial(1, updateInput, adminCtx);
    
    expect(result.code).toBe(500);
    expect(result.message).toBe("Failed to update social");
    expect(result.social).toBeUndefined();
  });

  it("should update only provided fields", async (): Promise<void> => {
    const partialUpdate: UpdateSocialInput = { title: "New Title Only" };
    const partialUpdatedSocial: PrismaSocial = { ...fakeExisting, title: "New Title Only" };

    mockDb.social.findUnique.mockResolvedValue(fakeExisting);
    mockDb.social.update.mockResolvedValue(partialUpdatedSocial);

    const result: SocialResponse = await resolver.updateSocial(1, partialUpdate, adminCtx);
    
    expect(result.code).toBe(200);
    expect(result.social?.title).toBe("New Title Only");
    expect(result.social?.url).toBe(fakeExisting.url); // unchanged
    expect(result.social?.tab).toBe(fakeExisting.tab); // unchanged
  });
});
