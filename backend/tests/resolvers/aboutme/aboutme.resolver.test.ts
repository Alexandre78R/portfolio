import "reflect-metadata";
import { AboutMeResolver } from "../../../src/resolvers/aboutme.resolver";
import { prismaMock } from "../../singleton";
import { MyContext } from "../../../src";
import { User, UserRole } from "../../../src/entities/user.entity";
import { CreateAboutMeInput, UpdateAboutMeInput } from "../../../src/entities/inputs/aboutme.input";
import { AboutMeResponse, AboutMesResponse } from "../../../src/types/response.types";
import { AboutMe as PrismaAboutMe } from "@prisma/client";
import Cookies from "cookies";
import { mockDeep, DeepMockProxy } from "jest-mock-extended";
import { Request, Response } from "express";

describe("AboutMeResolver", (): void => {
  let resolver: AboutMeResolver;
  let mockCookies: DeepMockProxy<Cookies>;
  let mockReq: DeepMockProxy<Request>;
  let mockRes: DeepMockProxy<Response>;

  const mockAdminUser: User = {
    id: 1,
    firstname: "Admin",
    lastname: "User",
    email: "admin@example.com",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  const mockRegularUser: User = {
    id: 2,
    firstname: "Regular",
    lastname: "User",
    email: "regular@example.com",
    role: UserRole.view,
    isPasswordChange: true,
  };

  let baseMockContext: MyContext;

  const mockAboutMe: PrismaAboutMe = {
    id: 1,
    titleEN: "Title EN",
    titleFR: "Title FR",
    descriptionEN: "Desc EN",
    descriptionFR: "Desc FR",
    isVisible: true,
  };

  beforeEach((): void => {
    jest.clearAllMocks();

    resolver = new AboutMeResolver(prismaMock);

    mockReq = mockDeep<Request>();
    mockRes = mockDeep<Response>();
    mockCookies = mockDeep<Cookies>();

    baseMockContext = {
      req: mockReq,
      res: mockRes,
      cookies: mockCookies,
      user: null,
      apiKey: undefined,
      token: undefined,
    };

    prismaMock.aboutMe.findFirst.mockReset();
    prismaMock.aboutMe.findMany.mockReset();
    prismaMock.aboutMe.create.mockReset();
    prismaMock.aboutMe.findUnique.mockReset();
    prismaMock.aboutMe.update.mockReset();
    prismaMock.aboutMe.delete.mockReset();
  });

  describe("getAboutMe", (): void => {
    it("should return visible AboutMe when exists", async (): Promise<void> => {
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(mockAboutMe);

      const result: AboutMeResponse = await resolver.getAboutMe();

      expect(result.code).toBe(200);
      expect(result.aboutMe).toEqual(mockAboutMe);
      expect(prismaMock.aboutMe.findFirst).toHaveBeenCalledTimes(1);
    });

    it("should return 404 when no visible AboutMe exists", async (): Promise<void> => {
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(null);

      const result: AboutMeResponse = await resolver.getAboutMe();

      expect(result.code).toBe(404);
      expect(result.aboutMe).toBeUndefined();
    });
  });

  describe("listAboutMe", (): void => {
    it("should return list of all AboutMe entries", async (): Promise<void> => {
      const items: PrismaAboutMe[] = [mockAboutMe];
      prismaMock.aboutMe.findMany.mockResolvedValueOnce(items);

      const result: AboutMesResponse = await resolver.listAboutMe();

      expect(result.code).toBe(200);
      expect(result.aboutMes).toEqual(items);
      expect(prismaMock.aboutMe.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("createAboutMe", (): void => {
    const createInput: CreateAboutMeInput = {
      titleEN: "Title EN",
      titleFR: "Title FR",
      descriptionEN: "Desc EN",
      descriptionFR: "Desc FR",
      isVisible: true,
    };

    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: null };

      const result: AboutMeResponse = await resolver.createAboutMe(createInput, ctx);

      expect(result.code).toBe(401);
      expect(prismaMock.aboutMe.create).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockRegularUser };

      const result: AboutMeResponse = await resolver.createAboutMe(createInput, ctx);

      expect(result.code).toBe(403);
      expect(prismaMock.aboutMe.create).not.toHaveBeenCalled();
    });

    it("should return 409 when another visible AboutMe already exists", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      const existingVisible: PrismaAboutMe = { 
        id: 2,
        titleEN: "Existing",
        titleFR: "Existant",
        descriptionEN: "Existing desc",
        descriptionFR: "Desc existante",
        isVisible: true,
      };
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(existingVisible);

      const result: AboutMeResponse = await resolver.createAboutMe(createInput, ctx);

      expect(result.code).toBe(409);
      expect(prismaMock.aboutMe.create).not.toHaveBeenCalled();
    });

    it("should create AboutMe successfully when no visible exists", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(null);
      prismaMock.aboutMe.create.mockResolvedValueOnce(mockAboutMe);

      const result: AboutMeResponse = await resolver.createAboutMe(createInput, ctx);

      expect(result.code).toBe(201);
      expect(result.aboutMe).toEqual(mockAboutMe);
      expect(prismaMock.aboutMe.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateAboutMe", (): void => {
    const updateInput: UpdateAboutMeInput = {
      id: 1,
      titleEN: "New Title EN",
      isVisible: true,
    };

    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: null };

      const result: AboutMeResponse = await resolver.updateAboutMe(updateInput, ctx);

      expect(result.code).toBe(401);
      expect(prismaMock.aboutMe.update).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockRegularUser };

      const result: AboutMeResponse = await resolver.updateAboutMe(updateInput, ctx);

      expect(result.code).toBe(403);
      expect(prismaMock.aboutMe.update).not.toHaveBeenCalled();
    });

    it("should return 400 when id is invalid", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      const badInput: UpdateAboutMeInput = { id: 0 };

      const result: AboutMeResponse = await resolver.updateAboutMe(badInput, ctx);

      expect(result.code).toBe(400);
      expect(prismaMock.aboutMe.update).not.toHaveBeenCalled();
    });

    it("should return 404 when AboutMe entry not found", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce(null);

      const result: AboutMeResponse = await resolver.updateAboutMe(updateInput, ctx);

      expect(result.code).toBe(404);
      expect(prismaMock.aboutMe.update).not.toHaveBeenCalled();
    });

    it("should return 409 when another visible AboutMe already exists", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce(mockAboutMe);
      const otherVisible: PrismaAboutMe = {
        id: 2,
        titleEN: "Other",
        titleFR: "Autre",
        descriptionEN: "Other desc",
        descriptionFR: "Autre desc",
        isVisible: true,
      };
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(otherVisible);

      const result: AboutMeResponse = await resolver.updateAboutMe(updateInput, ctx);

      expect(result.code).toBe(409);
      expect(prismaMock.aboutMe.update).not.toHaveBeenCalled();
    });

    it("should update AboutMe successfully when validation passes", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      const updatedAboutMe: PrismaAboutMe = {
        ...mockAboutMe,
        titleEN: "New Title EN",
      };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce(mockAboutMe);
      prismaMock.aboutMe.findFirst.mockResolvedValueOnce(null);
      prismaMock.aboutMe.update.mockResolvedValueOnce(updatedAboutMe);

      const result: AboutMeResponse = await resolver.updateAboutMe(updateInput, ctx);

      expect(result.code).toBe(200);
      expect(result.aboutMe?.titleEN).toBe("New Title EN");
      expect(prismaMock.aboutMe.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteAboutMe", (): void => {
    const deleteId: number = 1;

    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: null };

      const result: AboutMeResponse = await resolver.deleteAboutMe(deleteId, ctx);

      expect(result.code).toBe(401);
      expect(prismaMock.aboutMe.delete).not.toHaveBeenCalled();
    });

    it("should return 403 when user is not admin", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockRegularUser };

      const result: AboutMeResponse = await resolver.deleteAboutMe(deleteId, ctx);

      expect(result.code).toBe(403);
      expect(prismaMock.aboutMe.delete).not.toHaveBeenCalled();
    });

    it("should return 400 when id is invalid", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      const invalidId: number = 0;

      const result: AboutMeResponse = await resolver.deleteAboutMe(invalidId, ctx);

      expect(result.code).toBe(400);
      expect(prismaMock.aboutMe.delete).not.toHaveBeenCalled();
    });

    it("should return 404 when AboutMe entry not found", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce(null);

      const result: AboutMeResponse = await resolver.deleteAboutMe(deleteId, ctx);

      expect(result.code).toBe(404);
      expect(prismaMock.aboutMe.delete).not.toHaveBeenCalled();
    });

    it("should return 409 when AboutMe is visible", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce({
        ...mockAboutMe,
        isVisible: true,
      });

      const result: AboutMeResponse = await resolver.deleteAboutMe(deleteId, ctx);

      expect(result.code).toBe(409);
      expect(prismaMock.aboutMe.delete).not.toHaveBeenCalled();
    });

    it("should delete AboutMe successfully when validation passes", async (): Promise<void> => {
      const ctx: MyContext = { ...baseMockContext, user: mockAdminUser };
      const nonVisibleAboutMe: PrismaAboutMe = { ...mockAboutMe, isVisible: false };
      prismaMock.aboutMe.findUnique.mockResolvedValueOnce(nonVisibleAboutMe);
      prismaMock.aboutMe.delete.mockResolvedValueOnce(nonVisibleAboutMe);

      const result: AboutMeResponse = await resolver.deleteAboutMe(deleteId, ctx);

      expect(result.code).toBe(200);
      expect(result.aboutMe).toEqual(nonVisibleAboutMe);
      expect(prismaMock.aboutMe.delete).toHaveBeenCalledTimes(1);
    });
  });
});
