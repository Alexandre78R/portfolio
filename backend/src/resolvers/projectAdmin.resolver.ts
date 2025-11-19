import "reflect-metadata";
import { Resolver, Mutation, Arg, Authorized, Ctx, Int } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { PrismaClient, Prisma, ProjectSkill, Skill } from "@prisma/client";
import fs from "fs";
import path from "path";

import { Project } from "../entities/project.entity";
import { Response, ProjectResponse } from "../types/response.types";
import { CreateProjectInput, UpdateProjectInput } from "../entities/inputs/project.input";
import { MyContext } from "..";
import { UserRole } from "../entities/user.entity";
import prisma from "../lib/prisma"; // singleton Prisma
import { mapProject } from "../lib/mapProject";
import { SkillSubItem } from "../entities/skillSubItem.entity";

const UPLOAD_BASE = path.resolve(__dirname, "../../uploads");
const IMAGE_DIR = "images/projects";
const VIDEO_DIR = "videos/projects";

@Resolver(() => Project)
@Authorized([UserRole.admin, UserRole.editor])
export class ProjectAdminResolver {
  private readonly db: PrismaClient = prisma;

  /* ================= CREATE ================= */
  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("data") data: CreateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required" };

      // Validate skills
      await this.validateSkills(data.skillIds);

      const project = await this.db.project.create({
        data: {
          ...data,
          skills: { create: data.skillIds.map((id) => ({ skill: { connect: { id } } })) },
        },
        include: { skills: { include: { skill: true } } },
      });

      const skills: SkillSubItem[] = project.skills.map((ps: ProjectSkill & { skill: Skill }) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        image: ps.skill.image,
        categoryId: ps.skill.categoryId,
      }));

      return { code: 200, message: "Project created", project: { ...project, skills } };
    } catch (err) {
      console.error(err);
      return { code: 500, message: "Server error" };
    }
  }

  /* ================= UPDATE ================= */
  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("data") data: UpdateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required" };
      if (![UserRole.admin, UserRole.editor].includes(ctx.user.role)) return { code: 403, message: "Forbidden" };

      const { id, skillIds, ...rest } = data;

      const existing = await this.db.project.findUnique({ where: { id }, include: { skills: true } });
      if (!existing) return { code: 404, message: "Project not found" };

      if (skillIds) {
        const validSkills = await this.db.skill.findMany({ where: { id: { in: skillIds } } });
        if (validSkills.length !== skillIds.length) return { code: 400, message: "Invalid skill IDs" };
      }

      // Transaction for updating skills and project fields
      await this.db.$transaction(async (tx: Prisma.TransactionClient) => {
        if (skillIds) {
          await this.syncSkills(tx, id, skillIds, existing.skills);
        }
        await tx.project.update({ where: { id }, data: rest });
      });

      const updated = await this.db.project.findUnique({
        where: { id },
        include: { skills: { include: { skill: true } } },
      });

      if (!updated) return { code: 404, message: "Project not found after update" };

      const skills: SkillSubItem[] = updated.skills.map((ps: ProjectSkill & { skill: Skill }) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        image: ps.skill.image,
        categoryId: ps.skill.categoryId,
      }));

      return { code: 200, message: "Project updated", project: { ...updated, skills } };
    } catch (err) {
      console.error(err);
      return { code: 500, message: "Server error" };
    }
  }

  /* ================= UPLOAD MEDIA ================= */
  @Mutation(() => ProjectResponse)
  async uploadProjectMedia(
    @Arg("projectId", () => Int) projectId: number,
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required" };

      const project = await this.db.project.findUnique({ where: { id: projectId } });
      if (!project) return { code: 404, message: "Project not found" };

      const { createReadStream, filename, mimetype } = file;
      const isImage = mimetype.startsWith("image/");
      const isVideo = mimetype.startsWith("video/");

      if (!isImage && !isVideo) return { code: 400, message: "Invalid file type" };

      const folder = isImage ? IMAGE_DIR : VIDEO_DIR;
      const uploadDir = path.join(UPLOAD_BASE, folder);
      fs.mkdirSync(uploadDir, { recursive: true });

      // Delete old file if exists
      if (project.contentDisplay && project.typeDisplay) {
        const oldFolder = project.typeDisplay === "image" ? IMAGE_DIR : VIDEO_DIR;
        const oldPath = path.join(UPLOAD_BASE, oldFolder, project.contentDisplay);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const finalName = `project-${projectId}-${Date.now()}${path.extname(filename)}`;
      const filePath = path.join(uploadDir, finalName);

      await new Promise<void>((resolve, reject) => {
        const stream = createReadStream();
        const out = fs.createWriteStream(filePath);
        stream.pipe(out);
        out.on("finish", resolve);
        out.on("error", reject);
      });

      const updated = await this.db.project.update({
        where: { id: projectId },
        data: { contentDisplay: finalName, typeDisplay: isImage ? "image" : "video" },
        include: { skills: { include: { skill: true } } },
      });

      const skills: SkillSubItem[] = updated.skills.map((ps: ProjectSkill & { skill: Skill }) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        image: ps.skill.image,
        categoryId: ps.skill.categoryId,
      }));

      return { code: 200, message: "Media uploaded", project: { ...updated, skills } };
    } catch (err) {
      console.error(err);
      return { code: 500, message: "Server error" };
    }
  }

  /* ================= DELETE MEDIA ================= */
    @Mutation(() => ProjectResponse)
    async deleteProjectMedia(
    @Arg("projectId", () => Int) projectId: number,
    @Ctx() ctx: MyContext
    ): Promise<ProjectResponse> {
    try {
        if (!ctx.user) return { code: 401, message: "Authentication required" };

        const project = await this.db.project.findUnique({ 
        where: { id: projectId }, 
        include: { skills: { include: { skill: true } } } 
        });
        if (!project) return { code: 404, message: "Project not found" };

        if (project.contentDisplay && project.typeDisplay) {
        const folder = project.typeDisplay === "image" ? IMAGE_DIR : VIDEO_DIR;
        const filePath = path.join(UPLOAD_BASE, folder, project.contentDisplay);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        const updated = await this.db.project.update({
        where: { id: projectId },
        data: { contentDisplay: "", typeDisplay: "" }, // ne plus utiliser null
        include: { skills: { include: { skill: true } } }, // inclure les skills
        });

        const skills: SkillSubItem[] = updated.skills.map((ps: ProjectSkill & { skill: Skill }) => ({
        id: ps.skill.id,
        name: ps.skill.name,
        image: ps.skill.image,
        categoryId: ps.skill.categoryId,
        }));

        return { code: 200, message: "Media deleted", project: { ...updated, skills } };
    } catch (err) {
        console.error(err);
        return { code: 500, message: "Server error" };
    }
    }

  /* ================= DELETE PROJECT ================= */
  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteProject(@Arg("id", () => Int) id: number): Promise<Response> {
    try {
      const project = await this.db.project.findUnique({ where: { id } });
      if (!project) return { code: 404, message: "Project not found" };

      await this.db.$transaction([
        this.db.projectSkill.deleteMany({ where: { projectId: id } }),
        this.db.project.delete({ where: { id } }),
      ]);

      return { code: 200, message: "Project deleted" };
    } catch (err) {
      console.error(err);
      return { code: 500, message: "Server error" };
    }
  }

  /* ================= HELPERS ================= */
  private async validateSkills(skillIds: number[]): Promise<void> {
    const count = await this.db.skill.count({ where: { id: { in: skillIds } } });
    if (count !== skillIds.length) throw new Error("Invalid skill IDs");
  }

  private async syncSkills(
    tx: Prisma.TransactionClient,
    projectId: number,
    newIds: number[],
    existing: ProjectSkill[]
  ): Promise<void> {
    const existingIds = existing.map((ps) => ps.skillId);
    const toAdd = newIds.filter((id) => !existingIds.includes(id));
    const toRemove = existingIds.filter((id) => !newIds.includes(id));

    if (toRemove.length) await tx.projectSkill.deleteMany({ where: { projectId, skillId: { in: toRemove } } });
    if (toAdd.length) await tx.projectSkill.createMany({ data: toAdd.map((skillId) => ({ projectId, skillId })) });
  }
}
