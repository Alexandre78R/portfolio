import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import { Skill } from "../entities/skill.entity";
import { CreateCategoryInput, CreateSkillInput, UpdateCategoryInput, UpdateSkillInput } from "../entities/inputs/skill.input";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { CategoryResponse, SubItemResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient } from "@prisma/client";

@Resolver()
export class SkillResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}
  
  @Query(() => CategoryResponse)
  async skillList(): Promise<CategoryResponse> {
    try {
      const categories = await this.db.skillCategory.findMany({
        include: { skills: true },
        orderBy: { id: "asc" },
      });
      const dto = categories.map(cat => ({
        id: cat.id,
        categoryEN: cat.categoryEN,
        categoryFR: cat.categoryFR,
        skills: cat.skills.map(s => ({
          id: s.id,
          name: s.name,
          image: s.image,
          categoryId: s.categoryId,
        })),
      } as Skill));
      return { code: 200, message: "Categories fetched successfully", categories: dto };
    } catch (e) {
      console.error(e);
      return { code: 500, message: "Failed to fetch categories" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => CategoryResponse)
  async createCategory(
    @Arg("data") data: CreateCategoryInput,
    @Ctx() ctx: MyContext
  ): Promise<CategoryResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }
      const category = await this.db.skillCategory.create({
        data: { categoryEN: data.categoryEN, categoryFR: data.categoryFR },
      });
      const dto: Skill = {
        id: category.id,
        categoryEN: category.categoryEN,
        categoryFR: category.categoryFR,
        skills: [],
      };
      return { code: 200, message: "Category created successfully", categories: [dto] };
    } catch (e) {
      console.error(e);
      return { code: 500, message: "Failed to create category" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async createSkill(
    @Arg("data") data: CreateSkillInput,
    @Ctx() ctx: MyContext
  ): Promise<SubItemResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const category = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return { code: 400, message: "Category not found" };
      }
      const subItem = await this.db.skill.create({
        data: { name: data.name, image: data.image, categoryId: data.categoryId },
      });
      const dto: SkillSubItem = {
        id: subItem.id,
        name: subItem.name,
        image: subItem.image,
        categoryId: subItem.categoryId,
      };
      return { code: 200, message: "Skill created successfully", subItems: [dto] };
    } catch (e) {
      console.error(e);
      return { code: 500, message: "Failed to create skill" };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateCategoryInput,
    @Ctx() ctx: MyContext
  ): Promise<CategoryResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      const authorizedRoles = [UserRole.admin, UserRole.editor];

      if (!authorizedRoles.includes(ctx.user.role)) {
        return { code: 403, message: "Access denied. Admin or Editor role required." };
      }

      const existing = await this.db.skillCategory.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Category not found" };
      const cat = await this.db.skillCategory.update({
        where: { id },
        data: {
          categoryEN: data.categoryEN ?? existing.categoryEN,
          categoryFR: data.categoryFR ?? existing.categoryFR,
        },
      });
      const dto: Skill = { id: cat.id, categoryEN: cat.categoryEN, categoryFR: cat.categoryFR, skills: [] };
      return { code: 200, message: "Category updated", categories: [dto] };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error updating category" };
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

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      const authorizedRoles = [UserRole.admin, UserRole.editor];

      if (!authorizedRoles.includes(ctx.user.role)) {
        return { code: 403, message: "Access denied. Admin or Editor role required." };
      }

      const existing = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found" };
      if (data.categoryId) {
        const validCat = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!validCat) return { code: 400, message: "Invalid category" };
      }
      const subItem = await this.db.skill.update({
        where: { id },
        data: {
          name: data.name ?? existing.name,
          image: data.image ?? existing.image,
          categoryId: data.categoryId ?? existing.categoryId,
        },
      });
      const dto: SkillSubItem = { id: subItem.id, name: subItem.name, image: subItem.image, categoryId: subItem.categoryId };
      return { code: 200, message: "Skill updated", subItems: [dto] };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error updating skill" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => CategoryResponse)
  async deleteCategory(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<CategoryResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const existing = await this.db.skillCategory.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Category not found" };

      const skills = await this.db.skill.findMany({ where: { categoryId: id }, select: { id: true } });
      const skillIds = skills.map(s => s.id);

      if (skillIds.length) {
        await this.db.projectSkill.deleteMany({ where: { skillId: { in: skillIds } } });
      }

      await this.db.skill.deleteMany({ where: { categoryId: id } });

      await this.db.skillCategory.delete({ where: { id } });

      return { code: 200, message: "Category and related skills deleted" };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error deleting category" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async deleteSkill(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<SubItemResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const existing = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found" };

      await this.db.projectSkill.deleteMany({ where: { skillId: id } });

      await this.db.skill.delete({ where: { id } });

      return { code: 200, message: "Skill and related sub-items deleted" };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error deleting skill" };
    }
  }
  
}
