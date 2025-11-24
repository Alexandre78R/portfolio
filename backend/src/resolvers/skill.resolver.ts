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
        data: { 
          categoryEN: data.categoryEN, 
          categoryFR: data.categoryFR 
        },
      });

      let skills: PrismaSkill[] = [];
      if (data.skillIds && data.skillIds.length > 0) {
        try {
          const skillsToDuplicate: PrismaSkill[] = await this.db.skill.findMany({
            where: { id: { in: data.skillIds } },
          });

          if (skillsToDuplicate.length !== data.skillIds.length) {
            await this.db.skillCategory.delete({ where: { id: category.id } });
            return { code: 400, message: "One or more skills not found", categories: undefined };
          }

          const createdSkills: PrismaSkill[] = await Promise.all(
            skillsToDuplicate.map((skill: PrismaSkill): Promise<PrismaSkill> =>
              this.db.skill.create({
                data: {
                  name: skill.name,
                  image: skill.image,
                  categoryId: category.id,
                },
              })
            )
          );

          skills = createdSkills;
        } catch (error: unknown) {
          console.error("Error creating skills for category:", error);
          await this.db.skillCategory.delete({ where: { id: category.id } });
          return { code: 500, message: "Failed to create skills for category", categories: undefined };
        }
      }

      const dto: Skill = { 
        id: category.id, 
        categoryEN: category.categoryEN, 
        categoryFR: category.categoryFR, 
        skills: skills.map((s: PrismaSkill) => ({
          id: s.id,
          name: s.name,
          image: s.image,
          categoryId: s.categoryId,
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

        let updatedSkills: PrismaSkill[] = [];

        if (data.skillIds !== undefined) {
          const currentSkills: PrismaSkill[] = await this.db.skill.findMany({
            where: { categoryId: id },
          });

          const currentSkillIds: number[] = currentSkills.map((s: PrismaSkill): number => s.id);
          const newSkillIds: number[] = data.skillIds;

          const skillsToRemove: number[] = currentSkillIds.filter(
            (skillId: number): boolean => !newSkillIds.includes(skillId)
          );

          const skillsToAdd: number[] = newSkillIds.filter(
            (skillId: number): boolean => !currentSkillIds.includes(skillId)
          );

          if (skillsToRemove.length > 0) {
            try {
              const deletedProjectSkills: { count: number } = await this.db.projectSkill.deleteMany({
                where: { skillId: { in: skillsToRemove } },
              });

              console.log(`Deleted ${deletedProjectSkills.count} project-skill associations`);

              const deletedSkills: { count: number } = await this.db.skill.deleteMany({
                where: { id: { in: skillsToRemove } },
              });

              console.log(`Deleted ${deletedSkills.count} skills from category`);
            } catch (error: unknown) {
              console.error("Error removing skills from category:", error);
              return { code: 500, message: "Failed to remove skills from category", categories: undefined };
            }
          }

          if (skillsToAdd.length > 0) {
            try {
              const skillsToDuplicate: PrismaSkill[] = await this.db.skill.findMany({
                where: { id: { in: skillsToAdd } },
              });

              if (skillsToDuplicate.length !== skillsToAdd.length) {
                return { code: 400, message: "One or more skills to add were not found", categories: undefined };
              }

              const createdSkills: PrismaSkill[] = await Promise.all(
                skillsToDuplicate.map((skill: PrismaSkill): Promise<PrismaSkill> =>
                  this.db.skill.create({
                    data: {
                      name: skill.name,
                      image: skill.image,
                      categoryId: id,
                    },
                  })
                )
              );

              updatedSkills = [...currentSkills.filter((s: PrismaSkill): boolean => !skillsToRemove.includes(s.id)), ...createdSkills];
            } catch (error: unknown) {
              console.error("Error adding skills to category:", error);
              return { code: 500, message: "Failed to add skills to category", categories: undefined };
            }
          } else {
            updatedSkills = currentSkills.filter((s: PrismaSkill): boolean => !skillsToRemove.includes(s.id));
          }
        } else {
          const currentSkills: PrismaSkill[] = await this.db.skill.findMany({
            where: { categoryId: id },
          });
          updatedSkills = currentSkills;
        }

        const dto: Skill = {
          id: cat.id,
          categoryEN: cat.categoryEN,
          categoryFR: cat.categoryFR,
          skills: updatedSkills.map((s: PrismaSkill) => ({
            id: s.id,
            name: s.name,
            image: s.image,
            categoryId: s.categoryId,
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

      const existing: PrismaSkillCategory | null = await this.db.skillCategory.findUnique({
        where: { id },
      });

      if (!existing) return { code: 404, message: "Category not found", categories: undefined };

      try {
        const skillsInCategory: Array<{ readonly id: number }> = await this.db.skill.findMany({
          where: { categoryId: id },
          select: { id: true },
        });

        const skillIds: number[] = skillsInCategory.map(
          (s: { readonly id: number }): number => s.id
        );

        if (skillIds.length > 0) {
          const deletedProjectSkills: { count: number } = await this.db.projectSkill.deleteMany({
            where: { skillId: { in: skillIds } },
          });

          console.log(`Deleted ${deletedProjectSkills.count} project-skill associations`);

          const deletedSkills: { count: number } = await this.db.skill.deleteMany({
            where: { categoryId: id },
          });

          console.log(`Deleted ${deletedSkills.count} skills from category ${id}`);
        }

        await this.db.skillCategory.delete({ where: { id } });

        return {
          code: 200,
          message: `Category and ${skillIds.length} associated skills deleted successfully`,
        };
      } catch (error: unknown) {
        console.error("Error during category deletion process:", error);
        return { code: 500, message: "Error deleting category and related skills", categories: undefined };
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

      await this.db.projectSkill.deleteMany({ where: { skillId: id } });
      await this.db.skill.delete({ where: { id } });

      return { code: 200, message: "Skill and related sub-items deleted" };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error deleting skill", subItems: undefined };
    }
  }
}