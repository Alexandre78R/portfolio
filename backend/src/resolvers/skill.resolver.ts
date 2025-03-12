import { Resolver, Query, Mutation, Arg } from "type-graphql";
import prisma from "../lib/prisma";
import { Skill } from "../entities/skill.entity";
import { CreateCategoryInput, CreateSkillInput } from "../entities/inputs/skill.input";
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
}
