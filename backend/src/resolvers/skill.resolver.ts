import { Resolver, Query, Mutation, Arg, Int, Authorized, Ctx } from "type-graphql";
import { SkillCategoryWithSkillsDTO } from "../entities/skillCategoryWithSkillsDTO.entity";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { CreateCategoryInput, CreateSkillInput, UpdateCategoryInput, UpdateSkillInput } from "../entities/inputs/skill.input";
import { CategoryResponse, SubItemResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import {
  PrismaClient,
  Skill as PrismaSkill,
  SkillCategory as PrismaSkillCategory,
  SkillCategorySkill as PrismaSkillCategorySkill,
} from "@prisma/client";

type SkillCategoryWithSkills = PrismaSkillCategory & {
  skills: (PrismaSkillCategorySkill & { skill: PrismaSkill })[];
};

@Resolver()
export class SkillResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

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

      const dto: SkillCategoryWithSkillsDTO[] = categories.map((cat) => ({
        id: cat.id,
        categoryEN: cat.categoryEN,
        categoryFR: cat.categoryFR,
        skills: cat.skills.map((junction) => ({
          id: junction.skill.id,
          name: junction.skill.name,
          image: junction.skill.image,
          categoryId: cat.id,
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

      // Find all categories this skill belongs to (use the first one for categoryId in response)
      const skillCategories = await this.db.skillCategorySkill.findMany({
        where: { skillId: id },
        include: { category: true },
      });

      const categoryId = skillCategories.length > 0 ? skillCategories[0].categoryId : 0;

      const dto: SkillSubItem = { id: skill.id, name: skill.name, image: skill.image, categoryId };
      return { code: 200, message: "Skill fetched successfully", subItems: [dto] };
    } catch (error: unknown) {
      console.error("Error fetching skill:", error);
      return { code: 500, message: "Failed to fetch skill", subItems: [] };
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
          // Verify all skills exist
          const existingSkills: PrismaSkill[] = await this.db.skill.findMany({
            where: { id: { in: data.skillIds } },
          });

          if (existingSkills.length !== data.skillIds.length) {
            await this.db.skillCategory.delete({ where: { id: category.id } });
            return { code: 400, message: "One or more skills not found", categories: undefined };
          }

          // Create junction table records to link skills to category
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

      // Fetch the complete category with skills for response
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

  @Authorized([UserRole.admin])
  @Mutation(() => SubItemResponse)
  async createSkill(
    @Arg("data") data: CreateSkillInput,
    @Ctx() ctx: MyContext
  ): Promise<SubItemResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", subItems: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", subItems: undefined };

      // Create skill as standalone (no longer directly linked to category)
      const skill: PrismaSkill = await this.db.skill.create({
        data: {
          name: data.name,
          image: data.image,
        },
      });

      // If categoryId provided, create junction record to link skill to category
      if (data.categoryId) {
        const category = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!category) {
          // Delete the skill if category doesn't exist
          await this.db.skill.delete({ where: { id: skill.id } });
          return { code: 400, message: "Category not found", subItems: undefined };
        }

        await this.db.skillCategorySkill.create({
          data: {
            categoryId: data.categoryId,
            skillId: skill.id,
          },
        });
      }

      const dto: SkillSubItem = {
        id: skill.id,
        name: skill.name,
        image: skill.image,
        categoryId: data.categoryId || 0,
      };

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

      const existing: PrismaSkillCategory | null = await this.db.skillCategory.findUnique({
        where: { id },
      });

      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      try {
        // Update category labels
        const cat: PrismaSkillCategory = await this.db.skillCategory.update({
          where: { id },
          data: {
            categoryEN: data.categoryEN ?? existing.categoryEN,
            categoryFR: data.categoryFR ?? existing.categoryFR,
          },
        });

        // Manage skill associations via junction table
        if (data.skillIds !== undefined) {
          // Get current skill associations
          const currentJunctions: PrismaSkillCategorySkill[] = await this.db.skillCategorySkill.findMany({
            where: { categoryId: id },
          });

          const currentSkillIds: number[] = currentJunctions.map((j) => j.skillId);
          const newSkillIds: number[] = data.skillIds;

          // Determine which skills to add/remove
          const skillsToRemove: number[] = currentSkillIds.filter(
            (skillId: number): boolean => !newSkillIds.includes(skillId)
          );

          const skillsToAdd: number[] = newSkillIds.filter(
            (skillId: number): boolean => !currentSkillIds.includes(skillId)
          );

          // Remove junction records for skills no longer in category
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

          // Add junction records for new skills
          if (skillsToAdd.length > 0) {
            try {
              // Verify all skills exist
              const skillsToLink: PrismaSkill[] = await this.db.skill.findMany({
                where: { id: { in: skillsToAdd } },
              });

              if (skillsToLink.length !== skillsToAdd.length) {
                return { code: 400, message: "One or more skills to add were not found", categories: undefined };
              }

              // Create junction records
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

        // Fetch updated category with skills
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

      // Validate category if provided
      if (data.categoryId) {
        const validCat = await this.db.skillCategory.findUnique({ where: { id: data.categoryId } });
        if (!validCat) return { code: 400, message: "Invalid category", subItems: undefined };
      }

      // Update skill properties
      const subItem: PrismaSkill = await this.db.skill.update({
        where: { id },
        data: {
          name: data.name ?? existing.name,
          image: data.image ?? existing.image,
        },
      });

      // Get first category this skill belongs to (if any)
      const skillCategory = await this.db.skillCategorySkill.findFirst({
        where: { skillId: id },
      });

      const categoryId = skillCategory?.categoryId || 0;

      const dto: SkillSubItem = { id: subItem.id, name: subItem.name, image: subItem.image, categoryId };
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

      const existing: PrismaSkillCategory | null = await this.db.skillCategory.findUnique({
        where: { id },
      });

      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      try {
        // Delete junction records (cascade is handled by DB, but explicit is safer)
        const deletedJunctions: { count: number } = await this.db.skillCategorySkill.deleteMany({
          where: { categoryId: id },
        });

        console.log(`Deleted ${deletedJunctions.count} skill associations from category`);

        // Delete the category itself
        await this.db.skillCategory.delete({ where: { id } });

        return {
          code: 200,
          message: `Category and ${deletedJunctions.count} skill associations deleted successfully`,
        };
      } catch (error: unknown) {
        console.error("Error during category deletion process:", error);
        return { code: 500, message: "Error deleting category and related associations", categories: undefined };
      }
    } catch (error: unknown) {
      console.error("Error in deleteCategory:", error);
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

      try {
        // Delete project-skill associations
        const deletedProjectSkills: { count: number } = await this.db.projectSkill.deleteMany({
          where: { skillId: id },
        });

        console.log(`Deleted ${deletedProjectSkills.count} project-skill associations`);

        // Delete skill-category associations (junction table)
        const deletedJunctions: { count: number } = await this.db.skillCategorySkill.deleteMany({
          where: { skillId: id },
        });

        console.log(`Deleted ${deletedJunctions.count} category-skill associations`);

        // Delete the skill itself
        await this.db.skill.delete({ where: { id } });

        return {
          code: 200,
          message: `Skill deleted along with ${deletedProjectSkills.count} project associations and ${deletedJunctions.count} category associations`,
        };
      } catch (error: unknown) {
        console.error("Error during skill deletion:", error);
        return { code: 500, message: "Error deleting skill", subItems: undefined };
      }
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error deleting skill", subItems: undefined };
    }
  }
}