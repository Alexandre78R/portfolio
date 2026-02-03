import "reflect-metadata";
import { AdminResolver } from "../../../src/resolvers/admin.resolver";
import { UserRole } from "../../../src/entities/user.entity";
import { PrismaClient } from "@prisma/client";
import { GlobalStatsResponse } from "../../../src/types/response.types";

interface MockPrismaClient {
  user: {
    count: jest.Mock<Promise<number>, []>;
    groupBy: jest.Mock<
      Promise<
        Array<{
          role: UserRole | string;
          _count: { id: number };
        }>
      >,
      []
    >;
  };
  project: { count: jest.Mock<Promise<number>, []> };
  skill: { count: jest.Mock<Promise<number>, []> };
  education: { count: jest.Mock<Promise<number>, []> };
  experience: { count: jest.Mock<Promise<number>, []> };
}

describe("AdminResolver.getGlobalStats", (): void => {
  let mockDb: MockPrismaClient;
  let resolver: AdminResolver;

  beforeEach((): void => {
    mockDb = {
      user: {
        count: jest.fn<Promise<number>, []>(),
        groupBy: jest.fn<Promise<Array<{ role: UserRole | string; _count: { id: number } }>>, []>(),
      },
      project: { count: jest.fn<Promise<number>, []>() },
      skill: { count: jest.fn<Promise<number>, []>() },
      education: { count: jest.fn<Promise<number>, []>() },
      experience: { count: jest.fn<Promise<number>, []>() },
    };

    resolver = new AdminResolver(mockDb as unknown as PrismaClient);
  });

  it("should return correct global statistics", async (): Promise<void> => {

    mockDb.user.count.mockResolvedValue(10);
    mockDb.project.count.mockResolvedValue(5);
    mockDb.skill.count.mockResolvedValue(15);
    mockDb.education.count.mockResolvedValue(7);
    mockDb.experience.count.mockResolvedValue(8);

    mockDb.user.groupBy.mockResolvedValue([
      { role: UserRole.admin, _count: { id: 3 } },
      { role: UserRole.editor, _count: { id: 4 } },
      { role: UserRole.view, _count: { id: 3 } },
    ]);

    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.code).toBe(200);
    expect(result.stats).toBeDefined();

    if (result.stats) {
      expect(result.stats.totalUsers).toBe(10);
      expect(result.stats.usersByRoleAdmin).toBe(3);
      expect(result.stats.usersByRoleEditor).toBe(4);
      expect(result.stats.usersByRoleView).toBe(3);
    }

    expect(mockDb.user.count).toHaveBeenCalled();
    expect(mockDb.user.groupBy).toHaveBeenCalled();
  });

  it("should return error code and message if user.count throws", async (): Promise<void> => {
   
    mockDb.user.count.mockRejectedValue(new Error("DB error"));
    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.code).not.toBe(200);
    expect(result.stats).toBeUndefined();
    expect(result.message).toBeDefined();

  });

  it("should handle empty users groupBy gracefully", async (): Promise<void> => {
    mockDb.user.count.mockResolvedValue(0);
    mockDb.user.groupBy.mockResolvedValue([]);

    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.code).toBe(200);
    expect(result.stats).toBeDefined();

    if (result.stats) {
      expect(result.stats.totalUsers).toBe(0);
      expect(result.stats.usersByRoleAdmin).toBe(0);
      expect(result.stats.usersByRoleEditor).toBe(0);
      expect(result.stats.usersByRoleView).toBe(0);
    }
  });

  it("should call count for all entities", async (): Promise<void> => {
    mockDb.user.count.mockResolvedValue(10);
    mockDb.project.count.mockResolvedValue(5);
    mockDb.skill.count.mockResolvedValue(15);
    mockDb.education.count.mockResolvedValue(7);
    mockDb.experience.count.mockResolvedValue(8);
    mockDb.user.groupBy.mockResolvedValue([]);

    await resolver.getGlobalStats();

    expect(mockDb.user.count).toHaveBeenCalled();
    expect(mockDb.project.count).toHaveBeenCalled();
    expect(mockDb.skill.count).toHaveBeenCalled();
    expect(mockDb.education.count).toHaveBeenCalled();
    expect(mockDb.experience.count).toHaveBeenCalled();
  });

  it("should correctly count users by each role", async (): Promise<void> => {
    mockDb.user.count.mockResolvedValue(10);
    mockDb.user.groupBy.mockResolvedValue([
      { role: UserRole.admin, _count: { id: 2 } },
      { role: UserRole.editor, _count: { id: 5 } },
      { role: UserRole.view, _count: { id: 3 } },
    ]);

    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.stats).toBeDefined();

    if (result.stats) {
      expect(result.stats.usersByRoleAdmin).toBe(2);
      expect(result.stats.usersByRoleEditor).toBe(5);
      expect(result.stats.usersByRoleView).toBe(3);
    }
  });

  it("should ignore unknown user roles in groupBy", async (): Promise<void> => {
    mockDb.user.count.mockResolvedValue(5);
    mockDb.user.groupBy.mockResolvedValue([
      { role: "superadmin" as string, _count: { id: 5 } },
    ]);

    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.stats).toBeDefined();

    if (result.stats) {
      expect(result.stats.usersByRoleAdmin).toBe(0);
      expect(result.stats.usersByRoleEditor).toBe(0);
      expect(result.stats.usersByRoleView).toBe(0);
      expect(result.stats.totalUsers).toBe(5);
    }
  });

  it("should have totalUsers greater or equal to sum of usersByRole", async (): Promise<void> => {
    mockDb.user.count.mockResolvedValue(10);
    mockDb.user.groupBy.mockResolvedValue([
      { role: UserRole.admin, _count: { id: 3 } },
      { role: UserRole.editor, _count: { id: 4 } },
      { role: UserRole.view, _count: { id: 2 } },
    ]);

    const result: GlobalStatsResponse = await resolver.getGlobalStats();

    expect(result.stats).toBeDefined();

    if (result.stats) {
      const sumRoles: number =
        (result.stats.usersByRoleAdmin ?? 0) +
        (result.stats.usersByRoleEditor ?? 0) +
        (result.stats.usersByRoleView ?? 0);
      expect(result.stats.totalUsers).toBeGreaterThanOrEqual(sumRoles);
    }
  });
});