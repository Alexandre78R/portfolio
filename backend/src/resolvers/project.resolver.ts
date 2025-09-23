import { Resolver, Query, Arg, Int, Mutation, Authorized, Ctx } from "type-graphql";
import { Project } from "../entities/project.entity";
import { CreateProjectInput, UpdateProjectInput } from "../entities/inputs/project.input";
import { Response, ProjectResponse, ProjectsResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient, Project as PrismaProject, ProjectSkill as PrismaProjectSkill, Skill as PrismaSkill } from "@prisma/client";

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => ProjectsResponse)
  async projectList(): Promise<ProjectsResponse> {
    try {
      const projects: (PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] })[] =
        await this.db.project.findMany({
          include: { skills: { include: { skill: true } } },
          orderBy: { id: "desc" },
        });

      const mapped = projects.map((p) => ({
        id: p.id,
        title: p.title,
        descriptionFR: p.descriptionFR,
        descriptionEN: p.descriptionEN,
        typeDisplay: p.typeDisplay,
        github: p.github ?? null,
        contentDisplay: p.contentDisplay,
        skills: p.skills.map((ps) => ({
          id: ps.skill.id,
          name: ps.skill.name,
          image: ps.skill.image,
          categoryId: ps.skill.categoryId,
        })),
      }));

      return { code: 200, message: "Projects fetched successfully", projects: mapped };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Internal server error", projects: undefined };
    }
  }

  @Query(() => ProjectResponse)
  async projectById(@Arg("id", () => Int) id: number): Promise<ProjectResponse> {
    try {
      const project: (PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] }) | null =
        await this.db.project.findUnique({
          where: { id },
          include: { skills: { include: { skill: true } } },
        });

      if (!project) return { code: 404, message: "Project not found", project: undefined };

      return {
        code: 200,
        message: "Project found",
        project: {
          id: project.id,
          title: project.title,
          descriptionFR: project.descriptionFR,
          descriptionEN: project.descriptionEN,
          typeDisplay: project.typeDisplay,
          github: project.github ?? null,
          contentDisplay: project.contentDisplay,
          skills: project.skills.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
            image: ps.skill.image,
            categoryId: ps.skill.categoryId,
          })),
        },
      };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Internal server error", project: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("data") data: CreateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", project: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", project: undefined };

      const validSkills = await this.db.skill.findMany({ where: { id: { in: data.skillIds } } });
      if (validSkills.length !== data.skillIds.length) {
        return { code: 400, message: "One or more skill IDs are invalid.", project: undefined };
      }

      const newProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } =
        await this.db.project.create({
          data: {
            title: data.title,
            descriptionEN: data.descriptionEN,
            descriptionFR: data.descriptionFR,
            typeDisplay: data.typeDisplay,
            github: data.github,
            contentDisplay: data.contentDisplay,
            skills: { create: data.skillIds.map((skillId) => ({ skill: { connect: { id: skillId } } })) },
          },
          include: { skills: { include: { skill: true } } },
        });

      return {
        code: 200,
        message: "Project created successfully",
        project: {
          id: newProject.id,
          title: newProject.title,
          descriptionFR: newProject.descriptionFR,
          descriptionEN: newProject.descriptionEN,
          typeDisplay: newProject.typeDisplay,
          github: newProject.github ?? null,
          contentDisplay: newProject.contentDisplay,
          skills: newProject.skills.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
            image: ps.skill.image,
            categoryId: ps.skill.categoryId,
          })),
        },
      };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Internal server error", project: undefined };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("data") data: UpdateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", project: undefined };
      if (![UserRole.admin, UserRole.editor].includes(ctx.user.role))
        return { code: 403, message: "Access denied. Admin or Editor role required.", project: undefined };

      const { id, skillIds, ...rest } = data;

      const existingProject: (PrismaProject & { skills: PrismaProjectSkill[] }) | null =
        await this.db.project.findUnique({ where: { id }, include: { skills: true } });
      if (!existingProject) return { code: 404, message: "Project not found", project: undefined };

      if (skillIds) {
        const validSkills = await this.db.skill.findMany({ where: { id: { in: skillIds } } });
        if (validSkills.length !== skillIds.length) {
          return { code: 400, message: "One or more skill IDs are invalid.", project: undefined };
        }
        await this.db.projectSkill.deleteMany({ where: { projectId: id } });
      }

      const updatedProject: PrismaProject & { skills: (PrismaProjectSkill & { skill: PrismaSkill })[] } =
        await this.db.project.update({
          where: { id },
          data: { ...rest, skills: skillIds ? { create: skillIds.map((skillId) => ({ skill: { connect: { id: skillId } } })) } : undefined },
          include: { skills: { include: { skill: true } } },
        });

      return {
        code: 200,
        message: "Project updated successfully",
        project: {
          id: updatedProject.id,
          title: updatedProject.title,
          descriptionFR: updatedProject.descriptionFR,
          descriptionEN: updatedProject.descriptionEN,
          typeDisplay: updatedProject.typeDisplay,
          github: updatedProject.github ?? null,
          contentDisplay: updatedProject.contentDisplay,
          skills: updatedProject.skills.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
            image: ps.skill.image,
            categoryId: ps.skill.categoryId,
          })),
        },
      };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Internal server error", project: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteProject(@Arg("id", () => Int) id: number, @Ctx() ctx: MyContext): Promise<Response> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required." };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required." };

      const existingProject = await this.db.project.findUnique({ where: { id } });
      if (!existingProject) return { code: 404, message: "Project not found" };

      await this.db.projectSkill.deleteMany({ where: { projectId: id } });
      await this.db.project.delete({ where: { id } });

      return { code: 200, message: "Project deleted successfully" };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Internal server error" };
    }
  }
}