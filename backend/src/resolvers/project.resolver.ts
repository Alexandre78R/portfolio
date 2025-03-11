import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Project } from "../entities/project.entity";
import prisma from "../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../entities/inputs/project.input";
import { Response, ProjectResponse, ProjectsResponse } from "../entities/response.types";

@Resolver(() => Project)
export class ProjectResolver {
  
  @Query(() => ProjectsResponse)
  async projectList(): Promise<ProjectsResponse> {
    try {
      const projects = await prisma.project.findMany({
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
      const project = await prisma.project.findUnique({
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

  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("data") data: CreateProjectInput
  ): Promise<ProjectResponse> {
    try {
      const validSkills = await prisma.skill.findMany({
        where: { id: { in: data.skillIds } },
      });

      if (validSkills.length !== data.skillIds.length) {
        return { code: 400, message: "One or more skill IDs are invalid." };
      }

      const newProject = await prisma.project.create({
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

  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("data") data: UpdateProjectInput
  ): Promise<ProjectResponse> {
    try {
      const { id, skillIds, ...rest } = data;

      const existingProject = await prisma.project.findUnique({
        where: { id },
        include: { skills: true },
      });

      if (!existingProject) {
        return { code: 404, message: "Project not found" };
      }

      if (skillIds) {
        const validSkills = await prisma.skill.findMany({
          where: { id: { in: skillIds } },
        });

        if (validSkills.length !== skillIds.length) {
          return { code: 400, message: "One or more skill IDs are invalid." };
        }

        await prisma.projectSkill.deleteMany({ where: { projectId: id } });
      }

      const updatedProject = await prisma.project.update({
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

  @Mutation(() => Response)
  async deleteProject(
    @Arg("id", () => Int) id: number
  ): Promise<Response> {
    try {
      const existingProject = await prisma.project.findUnique({ where: { id } });
      if (!existingProject) {
        return { code: 404, message: "Project not found" };
      }

      await prisma.projectSkill.deleteMany({ where: { projectId: id } });
      await prisma.project.delete({ where: { id } });

      return { code: 200, message: "Project deleted successfully" };
    } catch (error) {
      return { code: 500, message: "Internal server error" };
    }
  }
}