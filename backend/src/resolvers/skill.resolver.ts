import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { CreateSkillInput, UpdateSkillInput } from "../entities/inputs/skill.input";
import { SubItemResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient, Skill as PrismaSkill, SkillCategory, SkillCategorySkill as PrismaSkillCategorySkill } from "@prisma/client";

@Resolver()
export class SkillResolver {
  private readonly db: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.db = prismaClient ?? new PrismaClient();
  }

  @Query(() => SubItemResponse)
  async skillById(@Arg("id", () => Int) id: number): Promise<SubItemResponse> {
    try {
      const skill: PrismaSkill | null = await this.db.skill.findUnique({ where: { id } });
      if (!skill) {
        return { code: 404, message: "Skill not found", subItems: [] };
      }

      const skillCategories: PrismaSkillCategorySkill[] = await this.db.skillCategorySkill.findMany({
        where: { skillId: id },
        include: { category: true },
      });
      const categoryId: number = skillCategories.length > 0 ? skillCategories[0].categoryId : 0;

      const dto: SkillSubItem = { id: skill.id, name: skill.name, image: skill.image, categoryId };
      return { code: 200, message: "Skill fetched successfully", subItems: [dto] };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching skill:", errorMessage);
      return { code: 500, message: "Failed to fetch skill", subItems: [] };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async createSkill(@Arg("data") data: CreateSkillInput, @Ctx() ctx: MyContext): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", subItems: undefined };

      const skill: PrismaSkill = await this.db.skill.create({
        data: { name: data.name, image: data.image },
      });

      if (data.categoryId) {
        const category: SkillCategory | null = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!category) {
          await this.db.skill.delete({ where: { id: skill.id } });
          return { code: 400, message: "Category not found", subItems: undefined };
        }

        await this.db.skillCategorySkill.create({
          data: { categoryId: data.categoryId, skillId: skill.id },
        });
      }

      const dto: SkillSubItem = {
        id: skill.id,
        name: skill.name,
        image: skill.image,
        categoryId: data.categoryId || 0,
      };
      return { code: 200, message: "Skill created successfully", subItems: [dto] };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error creating skill:", errorMessage);
      return { code: 500, message: "Failed to create skill", subItems: undefined };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => SubItemResponse)
  async updateSkill(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateSkillInput,
    @Ctx() ctx: MyContext
  ): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (![UserRole.admin, UserRole.editor].includes(ctx.user.role))
        return { code: 403, message: "Access denied. Admin or Editor role required.", subItems: undefined };

      const existing: PrismaSkill | null = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found", subItems: undefined };

      if (data.categoryId) {
        const validCat: SkillCategory | null = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!validCat) return { code: 400, message: "Invalid category", subItems: undefined };
      }

      const subItem: PrismaSkill = await this.db.skill.update({
        where: { id },
        data: {
          name: data.name ?? existing.name,
          image: data.image ?? existing.image,
        },
      });

      const skillCategory: PrismaSkillCategorySkill | null = await this.db.skillCategorySkill.findFirst({ where: { skillId: id } });
      const categoryId: number = skillCategory?.categoryId || 0;

      const dto: SkillSubItem = { id: subItem.id, name: subItem.name, image: subItem.image, categoryId };
      return { code: 200, message: "Skill updated", subItems: [dto] };
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error updating skill:", errorMessage);
      return { code: 500, message: "Error updating skill", subItems: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async deleteSkill(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", subItems: undefined };

      const existing: PrismaSkill | null = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found", subItems: undefined };

      try {
        const deletedProjectSkillsResult: { count: number } = await this.db.projectSkill.deleteMany({
          where: { skillId: id },
        });
        const deletedJunctionsResult: { count: number } = await this.db.skillCategorySkill.deleteMany({
          where: { skillId: id },
        });
        await this.db.skill.delete({ where: { id } });

        const successMessage: string = `Skill deleted along with ${deletedProjectSkillsResult.count} project associations and ${deletedJunctionsResult.count} category associations`;
        return {
          code: 200,
          message: successMessage,
          subItems: [],
        };
      } catch (deleteError: Error | unknown) {
        const deleteErrorMessage: string = deleteError instanceof Error ? deleteError.message : "Unknown error occurred";
        console.error("Error during skill deletion:", deleteErrorMessage);
        return { code: 500, message: "Error deleting skill", subItems: undefined };
      }
    } catch (error: Error | unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error in deleteSkill:", errorMessage);
      return { code: 500, message: "Error deleting skill", subItems: undefined };
    }
  }
}