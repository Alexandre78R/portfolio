import { Resolver, Mutation, Arg, Ctx, Authorized, Int } from "type-graphql";
import {
  PrismaClient,
  Prisma,
  Project as PrismaProject,
  ProjectSkill as PrismaProjectSkill,
} from "@prisma/client";
import fs from "fs";
import path from "path";

import { ProjectResponse } from "../types/response.types";
import { UpdateProjectInput } from "../entities/inputs/project.input";
import { MyContext } from "..";
import { UserRole } from "../entities/user.entity";
import { Project } from "../entities/project.entity";
import { SkillSubItem } from "../entities/skillSubItem.entity";

const UPLOAD_BASE_PATH: string = path.resolve(__dirname, "../../uploads");

@Resolver()
export class ProjectAdminResolver {
  private readonly db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  /**
   * Helper to sanitize UpdateProjectInput for Prisma
   */
  private sanitizeUpdateInput(
    input: Omit<UpdateProjectInput, "id" | "skillIds">
  ): Prisma.ProjectUpdateInput {
    const data: Prisma.ProjectUpdateInput = {};

    if (input.title != null) data.title = input.title;
    if (input.descriptionFR != null) data.descriptionFR = input.descriptionFR;
    if (input.descriptionEN != null) data.descriptionEN = input.descriptionEN;
    if (input.github !== undefined) data.github = input.github;
    if (input.typeDisplay != null) data.typeDisplay = input.typeDisplay;
    if (input.contentDisplay != null) data.contentDisplay = input.contentDisplay;

    return data;
  }

  /**
   * Update project and manage skills transactionally
   * @param data UpdateProjectInput GraphQL input
   * @param ctx Request context containing authenticated user
   */
  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => ProjectResponse)
  async updateProjectMedia(
    // @Arg("data") data: UpdateProjectInput,
    // @Ctx() ctx: MyContext
      @Arg("data", () => UpdateProjectInput) data: UpdateProjectInput,
      @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required" };
      }

      const { id, skillIds, ...rest } = data;

      const existingProject: (PrismaProject & {
        skills: (PrismaProjectSkill & { skill: { id: number; name: string; image: string; categoryId: number } })[];
      }) | null = await this.db.project.findUnique({
        where: { id },
        include: { skills: { include: { skill: true } } },
      });

      if (!existingProject) {
        return { code: 404, message: "Project not found" };
      }

      let toAdd: number[] = [];
      let toRemove: number[] = [];

      if (Array.isArray(skillIds)) {
        const existingSkillIds: number[] = existingProject.skills.map(
          (ps: PrismaProjectSkill & { skill: { id: number } }) => ps.skillId
        );

        toAdd = skillIds.filter((sid: number) => !existingSkillIds.includes(sid));
        toRemove = existingSkillIds.filter((sid: number) => !skillIds.includes(sid));
      }

      const prismaUpdateData: Prisma.ProjectUpdateInput = this.sanitizeUpdateInput(rest);

      // Transaction to update skills and project
      await this.db.$transaction(async (tx: Prisma.TransactionClient): Promise<void> => {
        if (toRemove.length > 0) {
          await tx.projectSkill.deleteMany({
            where: { projectId: id, skillId: { in: toRemove } },
          });
        }

        if (toAdd.length > 0) {
          await tx.projectSkill.createMany({
            data: toAdd.map((skillId: number) => ({ projectId: id, skillId })),
          });
        }

        await tx.project.update({
          where: { id },
          data: prismaUpdateData,
        });
      });

      // Reload project with skills for GraphQL
      const updatedProjectRaw: (PrismaProject & {
        skills: (PrismaProjectSkill & { skill: { id: number; name: string; image: string; categoryId: number } })[];
      }) | null = await this.db.project.findUnique({
        where: { id },
        include: { skills: { include: { skill: true } } },
      });

      if (!updatedProjectRaw) {
        return { code: 500, message: "Unexpected error after update" };
      }

      // Map to SkillSubItem[]
      const skillsForGraphQL: SkillSubItem[] = updatedProjectRaw.skills.map(
        (ps): SkillSubItem => ({
          id: ps.skill.id,
          name: ps.skill.name,
          image: ps.skill.image,
          categoryId: ps.skill.categoryId,
        })
      );

      // Map to Project
      const projectForGraphQL: Project = {
        id: updatedProjectRaw.id,
        title: updatedProjectRaw.title,
        descriptionEN: updatedProjectRaw.descriptionEN,
        descriptionFR: updatedProjectRaw.descriptionFR,
        github: updatedProjectRaw.github,
        typeDisplay: updatedProjectRaw.typeDisplay,
        contentDisplay: updatedProjectRaw.contentDisplay,
        skills: skillsForGraphQL,
      };

      return { code: 200, message: "Project updated successfully", project: projectForGraphQL };
    } catch (error: unknown) {
      console.error("updateProject error:", error);
      return { code: 500, message: "Internal server error" };
    }
  }

  /**
   * Delete project media (file system + DB)
   * @param projectId Project ID to delete media
   * @param ctx Request context containing authenticated user
   */
  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => ProjectResponse)
  async deleteProjectMedia(
    @Arg("projectId", () => Int) projectId: number,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { code: 401, message: "Authentication required" };
      }

      const project: (PrismaProject & {
        skills: (PrismaProjectSkill & { skill: { id: number; name: string; image: string; categoryId: number } })[];
      }) | null = await this.db.project.findUnique({
        where: { id: projectId },
        include: { skills: { include: { skill: true } } },
      });

      if (!project) {
        return { code: 404, message: "Project not found" };
      }

      if (project.contentDisplay && project.typeDisplay) {
        const folder: string = project.typeDisplay === "image" ? "images/projects" : "videos/projects";
        const filePath: string = path.join(UPLOAD_BASE_PATH, folder, project.contentDisplay);

        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (fileError) {
            console.error("Error deleting file:", fileError);
          }
        }
      }

      const updatedProjectRaw: (PrismaProject & {
        skills: (PrismaProjectSkill & { skill: { id: number; name: string; image: string; categoryId: number } })[];
      }) = await this.db.project.update({
        where: { id: projectId },
        data: { contentDisplay: "", typeDisplay: "" },
        include: { skills: { include: { skill: true } } },
      });

      const skillsForGraphQL: SkillSubItem[] = updatedProjectRaw.skills.map(
        (ps): SkillSubItem => ({
          id: ps.skill.id,
          name: ps.skill.name,
          image: ps.skill.image,
          categoryId: ps.skill.categoryId,
        })
      );

      const projectForGraphQL: Project = {
        id: updatedProjectRaw.id,
        title: updatedProjectRaw.title,
        descriptionEN: updatedProjectRaw.descriptionEN,
        descriptionFR: updatedProjectRaw.descriptionFR,
        github: updatedProjectRaw.github,
        typeDisplay: updatedProjectRaw.typeDisplay,
        contentDisplay: updatedProjectRaw.contentDisplay,
        skills: skillsForGraphQL,
      };

      return { code: 200, message: "Project media deleted successfully", project: projectForGraphQL };
    } catch (error: unknown) {
      console.error("deleteProjectMedia error:", error);
      return { code: 500, message: "Internal server error" };
    }
  }
}
