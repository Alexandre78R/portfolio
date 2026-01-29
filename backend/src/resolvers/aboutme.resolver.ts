import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  Authorized,
  Ctx,
} from "type-graphql";
import { AboutMe } from "../entities/aboutme.entity";
import { PrismaClient, AboutMe as PrismaAboutMe } from "@prisma/client";
import { AboutMeResponse, AboutMesResponse } from "../types/response.types";
import { CreateAboutMeInput, UpdateAboutMeInput } from "../entities/inputs/aboutme.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

@Resolver(() => AboutMe)
export class AboutMeResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => AboutMeResponse)
  async getAboutMe(): Promise<AboutMeResponse> {
    try {
      const aboutMe: Pick<PrismaAboutMe, "id" | "titleEN" | "titleFR" | "descriptionEN" | "descriptionFR" | "isVisible"> | null =
        await this.db.aboutMe.findFirst({
        where: { isVisible: true },
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
          isVisible: true,
        },
      });

      if (!aboutMe) {
        return {
          code: 404,
          message: "AboutMe not found",
        };
      }

      return {
        code: 200,
        message: "AboutMe fetched successfully",
        aboutMe,
      };
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error fetching AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error fetching AboutMe",
      };
    }
  }

  @Query(() => AboutMesResponse)
  async listAboutMe(): Promise<AboutMesResponse> {
    try {
      const aboutMes: PrismaAboutMe[] = await this.db.aboutMe.findMany({
        orderBy: { id: "desc" },
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
          isVisible: true,
        },
      });

      return {
        code: 200,
        message: "AboutMe list fetched successfully",
        aboutMes,
      };
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error listing AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error listing AboutMe",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => AboutMeResponse)
  async createAboutMe(
    @Arg("data") data: CreateAboutMeInput,
    @Ctx() ctx: MyContext
  ): Promise<AboutMeResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can create AboutMe",
        };
      }

      const isVisible: boolean = data.isVisible ?? false;

      if (isVisible) {
        const existingVisible: Pick<PrismaAboutMe, 'id'> | null =
          await this.db.aboutMe.findFirst({
            where: { isVisible: true },
            select: { id: true },
          });

        if (existingVisible) {
          return {
            code: 409,
            message: "Another AboutMe is already visible. Disable it first.",
          };
        }
      }

      const aboutMe: PrismaAboutMe = await this.db.aboutMe.create({
        data: {
          titleEN: data.titleEN,
          titleFR: data.titleFR,
          descriptionEN: data.descriptionEN,
          descriptionFR: data.descriptionFR,
          isVisible,
        },
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
          isVisible: true,
        },
      });

      return {
        code: 201,
        message: "AboutMe created successfully",
        aboutMe,
      };
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error creating AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error creating AboutMe",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => AboutMeResponse)
  async updateAboutMe(
    @Arg("data") data: UpdateAboutMeInput,
    @Ctx() ctx: MyContext
  ): Promise<AboutMeResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can update AboutMe",
        };
      }

      if (!Number.isInteger(data.id) || data.id <= 0) {
        return {
          code: 400,
          message: "Invalid AboutMe ID",
        };
      }

      const existingAboutMe: PrismaAboutMe | null =
        await this.db.aboutMe.findUnique({
          where: { id: data.id },
        });

      if (!existingAboutMe) {
        return {
          code: 404,
          message: `AboutMe with ID ${data.id} not found`,
        };
      }

      const updateData: {
        titleEN?: string;
        titleFR?: string;
        descriptionEN?: string;
        descriptionFR?: string;
        isVisible?: boolean;
      } = {};

      if (data.titleEN) updateData.titleEN = data.titleEN;
      if (data.titleFR) updateData.titleFR = data.titleFR;
      if (data.descriptionEN) updateData.descriptionEN = data.descriptionEN;
      if (data.descriptionFR) updateData.descriptionFR = data.descriptionFR;

      if (typeof data.isVisible === "boolean") {
        if (data.isVisible) {
          const existingVisible: Pick<PrismaAboutMe, 'id'> | null =
            await this.db.aboutMe.findFirst({
              where: { isVisible: true, NOT: { id: data.id } },
              select: { id: true },
            });

          if (existingVisible) {
            return {
              code: 409,
              message: "Another AboutMe is already visible. Disable it first.",
            };
          }
        }
        updateData.isVisible = data.isVisible;
      }

      const aboutMe: PrismaAboutMe = await this.db.aboutMe.update({
        where: { id: data.id },
        data: updateData,
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
          isVisible: true,
        },
      });

      return {
        code: 200,
        message: "AboutMe updated successfully",
        aboutMe,
      };
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error updating AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error updating AboutMe",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => AboutMeResponse)
  async deleteAboutMe(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<AboutMeResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can delete AboutMe",
        };
      }

      if (!Number.isInteger(id) || id <= 0) {
        return {
          code: 400,
          message: "Invalid AboutMe ID",
        };
      }

      const existingAboutMe: PrismaAboutMe | null =
        await this.db.aboutMe.findUnique({
          where: { id },
        });

      if (!existingAboutMe) {
        return {
          code: 404,
          message: `AboutMe with ID ${id} not found`,
        };
      }

      const aboutMe: PrismaAboutMe = await this.db.aboutMe.delete({
        where: { id },
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
          isVisible: true,
        },
      });

      return {
        code: 200,
        message: "AboutMe deleted successfully",
        aboutMe,
      };
    } catch (error: Error | unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error deleting AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error deleting AboutMe",
      };
    }
  }

}
