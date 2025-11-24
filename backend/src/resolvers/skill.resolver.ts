import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import { Skill } from "../entities/skill.entity";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { CreateCategoryInput, CreateSkillInput, UpdateCategoryInput, UpdateSkillInput } from "../entities/inputs/skill.input";
import { CategoryResponse, SubItemResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient, Skill as PrismaSkill, SkillCategory as PrismaSkillCategory } from "@prisma/client";

@Resolver()
export class SkillResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => CategoryResponse)
  async skillList(): Promise<CategoryResponse> {
    try {
      const categories: (PrismaSkillCategory & { skills: PrismaSkill[] })[] = await this.db.skillCategory.findMany({
        include: { skills: true },
        orderBy: { id: "asc" },
      });

      const dto: Skill[] = categories.map((cat) => ({
        id: cat.id,
        categoryEN: cat.categoryEN,
        categoryFR: cat.categoryFR,
        skills: cat.skills.map((s) => ({
          id: s.id,
          name: s.name,
          image: s.image,
          categoryId: s.categoryId,
        })),
      }));

      return { code: 200, message: "Categories fetched successfully", categories: dto };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Failed to fetch categories", categories: undefined };
    }
  }

  @Query(() => SubItemResponse)
  async skillById(@Arg("id", () => Int) id: number): Promise<SubItemResponse> {
    try {
      console.log("Fetching skill with id:", id);
      const skill: PrismaSkill | null = await this.db.skill.findUnique({
        where: { id },
      });

      console.log("Skill found:", skill);

      if (!skill) return { code: 404, message: "Skill not found", subItems: [] };

      const dto: SkillSubItem = { id: skill.id, name: skill.name, image: skill.image, categoryId: skill.categoryId };
      return { code: 200, message: "Skill fetched successfully", subItems: [dto] };
    } catch (error: unknown) {
      console.error("Error fetching skill:", error);
      return { code: 500, message: "Failed to fetch skill", subItems: [] };
    }
  }

  @Query(() => CategoryResponse)
  async skillCategoryById(@Arg("id", () => Int) id: number): Promise<CategoryResponse> {
    try {
      const category: (PrismaSkillCategory & { skills: PrismaSkill[] }) | null = await this.db.skillCategory.findUnique({
        where: { id },
        include: { skills: true },
      });

      if (!category) return { code: 404, message: "Category not found", categories: [] };

      const dto: Skill = {
        id: category.id,
        categoryEN: category.categoryEN,
        categoryFR: category.categoryFR,
        skills: category.skills.map((s) => ({
          id: s.id,
          name: s.name,
          image: s.image,
          categoryId: s.categoryId,
        })),
      };

      return { code: 200, message: "Category fetched successfully", categories: [dto] };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Failed to fetch category", categories: [] };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => CategoryResponse)
  async createCategory(
    @Arg("data") data: CreateCategoryInput,
    @Ctx() ctx: MyContext
  ): Promise<CategoryResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", categories: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", categories: undefined };

      const category: PrismaSkillCategory = await this.db.skillCategory.create({
        data: { categoryEN: data.categoryEN, categoryFR: data.categoryFR },
      });

      const dto: Skill = { id: category.id, categoryEN: category.categoryEN, categoryFR: category.categoryFR, skills: [] };
      return { code: 200, message: "Category created successfully", categories: [dto] };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Failed to create category", categories: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async createSkill(
    @Arg("data") data: CreateSkillInput,
    @Ctx() ctx: MyContext
  ): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", subItems: undefined };

      const category = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
      if (!category) return { code: 400, message: "Category not found", subItems: undefined };

      const subItem: PrismaSkill = await this.db.skill.create({
        data: { name: data.name, image: data.image, categoryId: data.categoryId },
      });

      const dto: SkillSubItem = { id: subItem.id, name: subItem.name, image: subItem.image, categoryId: subItem.categoryId };
      return { code: 200, message: "Skill created successfully", subItems: [dto] };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Failed to create skill", subItems: undefined };
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
      if (!ctx.user) return { code: 401, message: "Authentication required.", categories: undefined };
      if (![UserRole.admin, UserRole.editor].includes(ctx.user.role))
        return { code: 403, message: "Access denied. Admin or Editor role required.", categories: undefined };

      const existing = await this.db.skillCategory.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      const cat = await this.db.skillCategory.update({
        where: { id },
        data: { categoryEN: data.categoryEN ?? existing.categoryEN, categoryFR: data.categoryFR ?? existing.categoryFR },
      });

      const dto: Skill = { id: cat.id, categoryEN: cat.categoryEN, categoryFR: cat.categoryFR, skills: [] };
      return { code: 200, message: "Category updated", categories: [dto] };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error updating category", categories: undefined };
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

      const existing = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found", subItems: undefined };

      if (data.categoryId) {
        const validCat = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!validCat) return { code: 400, message: "Invalid category", subItems: undefined };
      }

      const subItem: PrismaSkill = await this.db.skill.update({
        where: { id },
        data: {
          name: data.name ?? existing.name,
          image: data.image ?? existing.image,
          categoryId: data.categoryId ?? existing.categoryId,
        },
      });

      const dto: SkillSubItem = { id: subItem.id, name: subItem.name, image: subItem.image, categoryId: subItem.categoryId };
      return { code: 200, message: "Skill updated", subItems: [dto] };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error updating skill", subItems: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => CategoryResponse)
  async deleteCategory(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<CategoryResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", categories: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", categories: undefined };

      const existing = await this.db.skillCategory.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      const skills = await this.db.skill.findMany({ where: { categoryId: id }, select: { id: true } });
      const skillIds = skills.map((s) => s.id);
      if (skillIds.length) await this.db.projectSkill.deleteMany({ where: { skillId: { in: skillIds } } });

      await this.db.skill.deleteMany({ where: { categoryId: id } });
      await this.db.skillCategory.delete({ where: { id } });

      return { code: 200, message: "Category and related skills deleted" };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error deleting category", categories: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async deleteSkill(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", subItems: undefined };

      const existing = await this.db.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found", subItems: undefined };

      await this.db.projectSkill.deleteMany({ where: { skillId: id } });
      await this.db.skill.delete({ where: { id } });

      return { code: 200, message: "Skill and related sub-items deleted" };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error deleting skill", subItems: undefined };
    }
  }
}