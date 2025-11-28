import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import { PrismaClient, Social as PrismaSocial } from "@prisma/client";
import { Social } from "../entities/social.entity";
import { SocialResponse, SocialsResponse } from "../types/response.types";
import { CreateSocialInput, UpdateSocialInput } from "../entities/inputs/social.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

@Resolver(() => Social)
export class SocialResolver {
  private readonly db: PrismaClient = new PrismaClient();

  @Query(() => [Social])
  async socialList(): Promise<PrismaSocial[]> {
    const socials: PrismaSocial[] = await this.db.social.findMany({
      orderBy: { id: "asc" },
    });

    return socials;
  }

  @Query(() => SocialResponse)
  async socialById(@Arg("id", () => Int) id: number): Promise<SocialResponse> {
    try {
      const social: PrismaSocial | null = await this.db.social.findUnique({ where: { id } });
      
      if (!social) {
        return { code: 404, message: "Social not found", social: undefined };
      }

      return { code: 200, message: "Social fetched successfully", social };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching social:", errorMessage);
      return { code: 500, message: "Failed to fetch social", social: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SocialResponse)
  async createSocial(
    @Arg("data") data: CreateSocialInput,
    @Ctx() ctx: MyContext
  ): Promise<SocialResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required.", social: undefined };
      }
      
      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required.", social: undefined };
      }

      const social: PrismaSocial = await this.db.social.create({
        data: {
          title: data.title,
          url: data.url,
          tab: data.tab,
        },
      });

      return { code: 200, message: "Social created successfully", social };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error creating social:", errorMessage);
      return { code: 500, message: "Failed to create social", social: undefined };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => SocialResponse)
  async updateSocial(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateSocialInput,
    @Ctx() ctx: MyContext
  ): Promise<SocialResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required.", social: undefined };
      }

      if (![UserRole.admin, UserRole.editor].includes(ctx.user.role)) {
        return { code: 403, message: "Access denied. Admin or Editor role required.", social: undefined };
      }

      const existing: PrismaSocial | null = await this.db.social.findUnique({ where: { id } });
      
      if (!existing) {
        return { code: 404, message: "Social not found", social: undefined };
      }

      const social: PrismaSocial = await this.db.social.update({
        where: { id },
        data: {
          title: data.title ?? existing.title,
          url: data.url ?? existing.url,
          tab: data.tab ?? existing.tab,
        },
      });

      return { code: 200, message: "Social updated successfully", social };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error updating social:", errorMessage);
      return { code: 500, message: "Failed to update social", social: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SocialResponse)
  async deleteSocial(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<SocialResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required.", social: undefined };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required.", social: undefined };
      }

      const existing: PrismaSocial | null = await this.db.social.findUnique({ where: { id } });
      
      if (!existing) {
        return { code: 404, message: "Social not found", social: undefined };
      }

      await this.db.social.delete({ where: { id } });

      return { code: 200, message: "Social deleted successfully", social: undefined };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error deleting social:", errorMessage);
      return { code: 500, message: "Failed to delete social", social: undefined };
    }
  }
}
