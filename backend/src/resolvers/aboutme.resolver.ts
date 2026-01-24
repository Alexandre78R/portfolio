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
import { AboutMeResponse } from "../types/response.types";
import { UpdateAboutMeInput } from "../entities/inputs/aboutme.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

@Resolver(() => AboutMe)
export class AboutMeResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => AboutMeResponse)
  async getAboutMe(): Promise<AboutMeResponse> {
    try {
      const aboutMe: Pick<PrismaAboutMe, "id" | "titleEN" | "titleFR" | "descriptionEN" | "descriptionFR"> | null =
        await this.db.aboutMe.findFirst({
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
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
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error fetching AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error fetching AboutMe",
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
      } = {};

      if (data.titleEN) updateData.titleEN = data.titleEN;
      if (data.titleFR) updateData.titleFR = data.titleFR;
      if (data.descriptionEN) updateData.descriptionEN = data.descriptionEN;
      if (data.descriptionFR) updateData.descriptionFR = data.descriptionFR;

      const aboutMe = await this.db.aboutMe.update({
        where: { id: data.id },
        data: updateData,
        select: {
          id: true,
          titleEN: true,
          titleFR: true,
          descriptionEN: true,
          descriptionFR: true,
        },
      });

      return {
        code: 200,
        message: "AboutMe updated successfully",
        aboutMe,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error updating AboutMe:", errorMessage);
      return {
        code: 500,
        message: "Error updating AboutMe",
      };
    }
  }

}
