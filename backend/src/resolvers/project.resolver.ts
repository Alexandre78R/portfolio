import { Resolver, Query, Arg, Int, Mutation, Authorized, Ctx } from "type-graphql";
import { Project } from "../entities/project.entity";
import { CreateProjectInput, UpdateProjectInput } from "../entities/inputs/project.input";
import { Response, ProjectResponse, ProjectsResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient } from "@prisma/client";

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => ProjectsResponse)
  async projectList(): Promise<ProjectsResponse> {
    try {
      const projects = await this.db.project.findMany({
        include: {
          skills: {
            include: { skill: true },
          },
        },
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
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }

  @Query(() => ProjectResponse)
  async projectById(
    @Arg("id", () => Int) id: number
  ): Promise<ProjectResponse> {
    try {
      const project = await this.db.project.findUnique({
        where: { id },
        include: { skills: { include: { skill: true } } },
      });

      if (!project) return { code: 404, message: "Project not found" };

      return {
        code: 200,
        message: "Project found",
        project: {
          ...project,
          skills: project.skills.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
            image: ps.skill.image,
            categoryId: ps.skill.categoryId,
          })),
        },
      };
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("data") data: CreateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const validSkills = await this.db.skill.findMany({
        where: { id: { in: data.skillIds } },
      });

      if (validSkills.length !== data.skillIds.length) {
        return { code: 400, message: "One or more skill IDs are invalid." };
      }

      const newProject = await this.db.project.create({
        data: {
          title: data.title,
          descriptionEN: data.descriptionEN,
          descriptionFR: data.descriptionFR,
          typeDisplay: data.typeDisplay,
          github: data.github,
          contentDisplay: data.contentDisplay,
          skills: {
            create: data.skillIds.map((skillId) => ({
              skill: { connect: { id: skillId } },
            })),
          },
        },
        include: {
          skills: { include: { skill: true } },
        },
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
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("data") data: UpdateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      const authorizedRoles = [UserRole.admin, UserRole.editor];

      if (!authorizedRoles.includes(ctx.user.role)) {
        return { code: 403, message: "Access denied. Admin or Editor role required." };
      }

      const { id, skillIds, ...rest } = data;

      const existingProject = await this.db.project.findUnique({
        where: { id },
        include: { skills: true },
      });

      if (!existingProject) {
        return { code: 404, message: "Project not found" };
      }

      if (skillIds) {
        const validSkills = await this.db.skill.findMany({
          where: { id: { in: skillIds } },
        });

        if (validSkills.length !== skillIds.length) {
          return { code: 400, message: "One or more skill IDs are invalid." };
        }

        await this.db.projectSkill.deleteMany({ where: { projectId: id } });
      }

      const updatedProject = await this.db.project.update({
        where: { id },
        data: {
          ...rest,
          skills: skillIds
            ? { create: skillIds.map((skillId) => ({ skill: { connect: { id: skillId } } })) }
            : undefined,
        },
        include: {
          skills: { include: { skill: true } },
        },
      });

      return {
        code: 200,
        message: "Project updated successfully",
        project: {
          ...updatedProject,
          skills: updatedProject.skills.map((ps) => ({
            id: ps.skill.id,
            name: ps.skill.name,
            image: ps.skill.image,
            categoryId: ps.skill.categoryId,
          })),
        },
      };
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteProject(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Response> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const existingProject = await this.db.project.findUnique({ where: { id } });
      if (!existingProject) {
        return { code: 404, message: "Project not found" };
      }

      await this.db.projectSkill.deleteMany({ where: { projectId: id } });
      await this.db.project.delete({ where: { id } });

      return { code: 200, message: "Project deleted successfully" };
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }
}