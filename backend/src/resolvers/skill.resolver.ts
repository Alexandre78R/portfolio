import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import prisma from "../lib/prisma";
import { Skill } from "../entities/skill.entity";
import { CreateCategoryInput, CreateSkillInput, UpdateCategoryInput, UpdateSkillInput } from "../entities/inputs/skill.input";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { CategoryResponse, SubItemResponse } from "../entities/response.types";

@Resolver()
export class SkillResolver {
  @Query(() => CategoryResponse)
  async skillList(): Promise<CategoryResponse> {
    try {
      const categories = await prisma.skillCategory.findMany({
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

  @Mutation(() => CategoryResponse)
  async createCategory(
    @Arg("data") data: CreateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const category = await prisma.skillCategory.create({
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

  @Mutation(() => SubItemResponse)
  async createSkill(
    @Arg("data") data: CreateSkillInput
  ): Promise<SubItemResponse> {
    try {
      const category = await prisma.skillCategory.findUnique({ where: { id: data.categoryId } });
      if (!category) {
        return { code: 400, message: "Category not found" };
      }
      const subItem = await prisma.skill.create({
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

  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const existing = await prisma.skillCategory.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Category not found" };
      const cat = await prisma.skillCategory.update({
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

  @Mutation(() => SubItemResponse)
  async updateSkill(
    @Arg("id", () => Int) id: number,
    @Arg("data") data: UpdateSkillInput
  ): Promise<SubItemResponse> {
    try {
      const existing = await prisma.skill.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Skill not found" };
      if (data.categoryId) {
        const validCat = await prisma.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!validCat) return { code: 400, message: "Invalid category" };
      }
      const subItem = await prisma.skill.update({
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

}
