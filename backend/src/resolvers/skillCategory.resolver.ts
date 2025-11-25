import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import type {
  Skill as PrismaSkill,
  SkillCategory as PrismaSkillCategory,
  SkillCategorySkill as PrismaSkillCategorySkill,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";

import { SkillCategoryWithSkillsDTO } from "../entities/skillCategoryWithSkillsDTO.entity";
import { CreateCategoryInput, UpdateCategoryInput } from "../entities/inputs/skill.input";
import { CategoryResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import type { MyContext } from "..";

/**
 * Type interne pour représenter une catégorie avec ses compétences
 * Intersection de PrismaSkillCategory et tableau de jonctions avec compétences associées
 */
type SkillCategoryWithSkills = PrismaSkillCategory & {
  skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
};

/**
 * SkillCategoryResolver
 * Gère les requêtes et mutations GraphQL pour les catégories de compétences
 * et leurs associations via la table de jonction
 */
@Resolver()
export class SkillCategoryResolver {
  private readonly db: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.db = prismaClient ?? new PrismaClient();
  }

  /**
   * Récupère toutes les catégories avec leurs compétences associées
   * @returns Promise<CategoryResponse> - Liste complète des catégories avec compétences
   */
  @Query(() => CategoryResponse)
  async skillList(): Promise<CategoryResponse> {
    try {
      const categories: SkillCategoryWithSkills[] = await this.db.skillCategory.findMany({
        include: {
          skills: {
            include: { skill: true },
          },
        },
        orderBy: { id: "asc" },
      });

      const dtoList: SkillCategoryWithSkillsDTO[] = categories.map(
        (cat: SkillCategoryWithSkills): SkillCategoryWithSkillsDTO => ({
          id: cat.id,
          categoryEN: cat.categoryEN,
          categoryFR: cat.categoryFR,
          skills: cat.skills.map((junction: PrismaSkillCategorySkill & { skill: PrismaSkill }) => ({
            id: junction.skill.id,
            name: junction.skill.name,
            image: junction.skill.image,
            categoryId: cat.id,
          })),
        })
      );

      return { code: 200, message: "Categories fetched successfully", categories: dtoList };
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error fetching categories:", errorMessage);
      return { code: 500, message: "Failed to fetch categories", categories: undefined };
    }
  }

  @Query(() => CategoryResponse)
  async skillCategoryById(@Arg("id", () => Int) id: number): Promise<CategoryResponse> {
    try {
      const category: SkillCategoryWithSkills | null = await this.db.skillCategory.findUnique({
        where: { id },
        include: {
          skills: {
            include: { skill: true },
          },
        },
      });

      if (!category) return { code: 404, message: "Category not found", categories: [] };

      const dto: SkillCategoryWithSkillsDTO = {
        id: category.id,
        categoryEN: category.categoryEN,
        categoryFR: category.categoryFR,
        skills: category.skills.map((junction) => ({
          id: junction.skill.id,
          name: junction.skill.name,
          image: junction.skill.image,
          categoryId: category.id,
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
        data: {
          categoryEN: data.categoryEN,
          categoryFR: data.categoryFR,
        },
      });

      let createdJunctions: PrismaSkillCategorySkill[] = [];

      if (data.skillIds && data.skillIds.length > 0) {
        try {
          const existingSkills: PrismaSkill[] = await this.db.skill.findMany({
            where: { id: { in: data.skillIds } },
          });

          if (existingSkills.length !== data.skillIds.length) {
            await this.db.skillCategory.delete({ where: { id: category.id } });
            return { code: 400, message: "One or more skills not found", categories: undefined };
          }

          createdJunctions = await Promise.all(
            data.skillIds.map((skillId: number): Promise<PrismaSkillCategorySkill> =>
              this.db.skillCategorySkill.create({
                data: {
                  categoryId: category.id,
                  skillId: skillId,
                },
              })
            )
          );
        } catch (error: unknown) {
          console.error("Error linking skills to category:", error);
          await this.db.skillCategory.delete({ where: { id: category.id } });
          return { code: 500, message: "Failed to link skills to category", categories: undefined };
        }
      }

      const completeCategory: SkillCategoryWithSkills | null = await this.db.skillCategory.findUnique({
        where: { id: category.id },
        include: {
          skills: {
            include: { skill: true },
          },
        },
      });

      if (!completeCategory) {
        return { code: 500, message: "Failed to retrieve created category", categories: undefined };
      }

      const dto: SkillCategoryWithSkillsDTO = {
        id: completeCategory.id,
        categoryEN: completeCategory.categoryEN,
        categoryFR: completeCategory.categoryFR,
        skills: completeCategory.skills.map((junction) => ({
          id: junction.skill.id,
          name: junction.skill.name,
          image: junction.skill.image,
          categoryId: completeCategory.id,
        })),
      };

      return { code: 200, message: "Category created successfully", categories: [dto] };
    } catch (error: unknown) {
      console.error("Error creating category:", error);
      return { code: 500, message: "Failed to create category", categories: undefined };
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

      const existing: PrismaSkillCategory | null = await this.db.skillCategory.findUnique({
        where: { id },
      });

      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      try {
        const cat: PrismaSkillCategory = await this.db.skillCategory.update({
          where: { id },
          data: {
            categoryEN: data.categoryEN ?? existing.categoryEN,
            categoryFR: data.categoryFR ?? existing.categoryFR,
          },
        });

        if (data.skillIds !== undefined) {
          const currentJunctions: PrismaSkillCategorySkill[] = await this.db.skillCategorySkill.findMany({
            where: { categoryId: id },
          });

          const currentSkillIds: number[] = currentJunctions.map((j) => j.skillId);
          const newSkillIds: number[] = data.skillIds;

          const skillsToRemove: number[] = currentSkillIds.filter(
            (skillId: number): boolean => !newSkillIds.includes(skillId)
          );

          const skillsToAdd: number[] = newSkillIds.filter(
            (skillId: number): boolean => !currentSkillIds.includes(skillId)
          );

          if (skillsToRemove.length > 0) {
            try {
              const deletedJunctions: { count: number } = await this.db.skillCategorySkill.deleteMany({
                where: {
                  categoryId: id,
                  skillId: { in: skillsToRemove },
                },
              });

              console.log(`Removed ${deletedJunctions.count} skill associations from category`);
            } catch (error: unknown) {
              console.error("Error removing skills from category:", error);
              return { code: 500, message: "Failed to remove skills from category", categories: undefined };
            }
          }

          if (skillsToAdd.length > 0) {
            try {
              const skillsToLink: PrismaSkill[] = await this.db.skill.findMany({
                where: { id: { in: skillsToAdd } },
              });

              if (skillsToLink.length !== skillsToAdd.length) {
                return { code: 400, message: "One or more skills to add were not found", categories: undefined };
              }

              await Promise.all(
                skillsToAdd.map((skillId: number): Promise<PrismaSkillCategorySkill> =>
                  this.db.skillCategorySkill.create({
                    data: {
                      categoryId: id,
                      skillId: skillId,
                    },
                  })
                )
              );

              console.log(`Added ${skillsToAdd.length} skills to category`);
            } catch (error: unknown) {
              console.error("Error adding skills to category:", error);
              return { code: 500, message: "Failed to add skills to category", categories: undefined };
            }
          }
        }

        const updatedCategory: SkillCategoryWithSkills | null = await this.db.skillCategory.findUnique({
          where: { id },
          include: {
            skills: {
              include: { skill: true },
            },
          },
        });

        if (!updatedCategory) {
          return { code: 500, message: "Failed to retrieve updated category", categories: undefined };
        }

        const dto: SkillCategoryWithSkillsDTO = {
          id: updatedCategory.id,
          categoryEN: updatedCategory.categoryEN,
          categoryFR: updatedCategory.categoryFR,
          skills: updatedCategory.skills.map((junction) => ({
            id: junction.skill.id,
            name: junction.skill.name,
            image: junction.skill.image,
            categoryId: updatedCategory.id,
          })),
        };

        return { code: 200, message: "Category updated successfully", categories: [dto] };
      } catch (error: unknown) {
        console.error("Error in category update process:", error);
        return { code: 500, message: "Error updating category", categories: undefined };
      }
    } catch (error: unknown) {
      console.error("Error in updateCategory:", error);
      return { code: 500, message: "Error updating category", categories: undefined };
    }
  }
}
