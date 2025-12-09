import "reflect-metadata";
import { Resolver, Mutation, Arg, Authorized, Ctx, Int } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload-ts";
import { PrismaClient, Prisma, Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";

import { Project } from "../entities/project.entity";
import { Response, ProjectResponse } from "../types/response.types";
import { CreateProjectInput, UpdateProjectInput } from "../entities/inputs/project.input";
import { MyContext } from "..";
import { UserRole } from "../entities/user.entity";
import prisma from "../lib/prisma";
import { SkillSubItem } from "../entities/skillSubItem.entity";

const UPLOAD_BASE: string = path.resolve(__dirname, "../../uploads");
const IMAGE_DIR: string = "images";
const VIDEO_DIR: string = "videos";

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<ProjectSkill & { skill: Skill }>;
};

type MediaType = "image" | "video";

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface FileUploadResult {
  filename: string;
  type: MediaType;
}

@Resolver(() => Project)
@Authorized([UserRole.admin, UserRole.editor])
export class ProjectAdminResolver {
  private readonly db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  @Mutation(() => ProjectResponse)
  async createProject(
    @Arg("data") data: CreateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { 
          code: 401, 
          message: "Authentication required" 
        };
      }

      const skillValidation: ValidationResult = await this.validateSkills(data.skillIds);
      if (!skillValidation.isValid) {
        return { 
          code: 400, 
          message: skillValidation.message || "Invalid skill IDs" 
        };
      }

      const projectPrisma: PrismaProjectWithSkills = await this.db.project.create({
        data: {
          title: data.title,
          descriptionEN: data.descriptionEN,
          descriptionFR: data.descriptionFR,
          typeDisplay: data.typeDisplay,
          github: data.github || null,
          contentDisplay: data.contentDisplay,
          image: data.image || null,
          video: data.video || null,
          skills: {
            create: data.skillIds.map((skillId: number) => ({
              skill: { connect: { id: skillId } }
            }))
          }
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      const project: Project = this.transformProject(projectPrisma);

      return { 
        code: 200, 
        message: "Project created successfully", 
        project 
      };
    } catch (err: Error | unknown) {
      console.error("Create project error:", err);
      const errorMessage: string = err instanceof Error ? err.message : "Server error";
      return { 
        code: 500, 
        message: errorMessage 
      };
    }
  }
  @Mutation(() => ProjectResponse)
  async updateProject(
    @Arg("data") data: UpdateProjectInput,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { 
          code: 401, 
          message: "Authentication required" 
        };
      }

      const hasPermission: boolean = [UserRole.admin, UserRole.editor].includes(ctx.user.role);
      if (!hasPermission) {
        return { 
          code: 403, 
          message: "Forbidden" 
        };
      }

      const { id, skillIds, ...updateData } = data;

      const existing: (PrismaProject & { skills: ProjectSkill[] }) | null = 
        await this.db.project.findUnique({
          where: { id },
          include: { skills: true }
        });

      if (!existing) {
        return { 
          code: 404, 
          message: "Project not found" 
        };
      }

      if (skillIds) {
        const skillValidation: ValidationResult = await this.validateSkills(skillIds);
        if (!skillValidation.isValid) {
          return { 
            code: 400, 
            message: skillValidation.message || "Invalid skill IDs" 
          };
        }
      }

      await this.db.$transaction(async (tx: Prisma.TransactionClient): Promise<void> => {
        if (skillIds) {
          await this.syncSkills(tx, id, skillIds, existing.skills);
        }

        const hasUpdateData: boolean = Object.keys(updateData).length > 0;
        if (hasUpdateData) {
          await tx.project.update({
            where: { id },
            data: updateData
          });
        }
      });

      const updatedPrisma: PrismaProjectWithSkills | null = 
        await this.db.project.findUnique({
          where: { id },
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        });

      if (!updatedPrisma) {
        return { 
          code: 404, 
          message: "Project not found after update" 
        };
      }

      const project: Project = this.transformProject(updatedPrisma);

      return { 
        code: 200, 
        message: "Project updated successfully", 
        project 
      };
    } catch (err: Error | unknown) {
      console.error("Update project error:", err);
      const errorMessage: string = err instanceof Error ? err.message : "Server error";
      return { 
        code: 500, 
        message: errorMessage 
      };
    }
  }

  @Mutation(() => ProjectResponse)
  async uploadProjectMedia(
    @Arg("projectId", () => Int) projectId: number,
    @Arg("file", () => GraphQLUpload) file: FileUpload,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { 
          code: 401, 
          message: "Authentication required" 
        };
      }

      const project: PrismaProject | null = await this.db.project.findUnique({
        where: { id: projectId }
      });

      if (!project) {
        return { 
          code: 404, 
          message: "Project not found" 
        };
      }

      const { createReadStream, filename, mimetype }: FileUpload = file;

      const fileValidation: ValidationResult = this.validateFileType(mimetype);
      if (!fileValidation.isValid) {
        return { 
          code: 400, 
          message: fileValidation.message || "Invalid file type" 
        };
      }

      const isImage: boolean = mimetype.startsWith("image/");
      const mediaType: MediaType = isImage ? "image" : "video";
      const folder: string = isImage ? IMAGE_DIR : VIDEO_DIR;
      const uploadDir: string = path.join(UPLOAD_BASE, folder);

      await fs.mkdir(uploadDir, { recursive: true });

      const hasOldMedia: boolean = Boolean(project.contentDisplay && project.typeDisplay);
      if (hasOldMedia) {
        await this.deleteMediaFile(
          project.contentDisplay, 
          project.typeDisplay as MediaType
        );
      }

      const uploadResult: FileUploadResult = await this.saveUploadedFile(
        createReadStream,
        filename,
        uploadDir,
        projectId
      );

      const updatedPrisma: PrismaProjectWithSkills = await this.db.project.update({
        where: { id: projectId },
        data: {
          contentDisplay: uploadResult.filename,
          typeDisplay: uploadResult.type
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      const updatedProject: Project = this.transformProject(updatedPrisma);

      return { 
        code: 200, 
        message: "Media uploaded successfully", 
        project: updatedProject 
      };
    } catch (err: Error | unknown) {
      console.error("Upload media error:", err);
      const errorMessage: string = err instanceof Error ? err.message : "Server error";
      return { 
        code: 500, 
        message: errorMessage 
      };
    }
  }

  @Mutation(() => ProjectResponse)
  async deleteProjectMedia(
    @Arg("projectId", () => Int) projectId: number,
    @Ctx() ctx: MyContext
  ): Promise<ProjectResponse> {
    try {
      if (!ctx.user) {
        return { 
          code: 401, 
          message: "Authentication required" 
        };
      }

      const project: PrismaProjectWithSkills | null = 
        await this.db.project.findUnique({
          where: { id: projectId },
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        });

      if (!project) {
        return { 
          code: 404, 
          message: "Project not found" 
        };
      }

      const hasMedia: boolean = Boolean(project.contentDisplay && project.typeDisplay);
      if (hasMedia) {
        await this.deleteMediaFile(
          project.contentDisplay, 
          project.typeDisplay as MediaType
        );
      }

      const updatedPrisma: PrismaProjectWithSkills = await this.db.project.update({
        where: { id: projectId },
        data: {
          contentDisplay: "",
          typeDisplay: ""
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      const updatedProject: Project = this.transformProject(updatedPrisma);

      return { 
        code: 200, 
        message: "Media deleted successfully", 
        project: updatedProject 
      };
    } catch (err: Error | unknown) {
      console.error("Delete media error:", err);
      const errorMessage: string = err instanceof Error ? err.message : "Server error";
      return { 
        code: 500, 
        message: errorMessage 
      };
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
        return { 
          code: 401, 
          message: "Authentication required" 
        };
      }

      const project: PrismaProject | null = await prisma.project.findUnique({
        where: { id }
      });

      if (!project) {
        return { 
          code: 404, 
          message: "Project not found" 
        };
      }

      const hasMedia: boolean = Boolean(project.contentDisplay && project.typeDisplay);
      if (hasMedia) {
        await this.deleteMediaFile(
          project.contentDisplay, 
          project.typeDisplay as MediaType
        );
      }

      await prisma.projectSkill.deleteMany({
        where: { projectId: id }
      });

      await prisma.project.delete({
        where: { id }
      });

      return { 
        code: 200, 
        message: "Project deleted successfully" 
      };
    } catch (err: Error | unknown) {
      console.error("Delete project error:", err);
      const errorMessage: string = err instanceof Error ? err.message : "Server error";
      return { 
        code: 500, 
        message: errorMessage 
      };
    }
  }

  private async validateSkills(skillIds: number[]): Promise<ValidationResult> {
    try {
      const count: number = await this.db.skill.count({
        where: { id: { in: skillIds } }
      });

      const isValid: boolean = count === skillIds.length;

      if (!isValid) {
        return {
          isValid: false,
          message: `Found ${count} valid skills out of ${skillIds.length} provided`
        };
      }

      return { isValid: true };
    } catch (err: Error | unknown) {
      console.error("Validate skills error:", err);
      return {
        isValid: false,
        message: "Error validating skills"
      };
    }
  }

  private validateFileType(mimetype: string): ValidationResult {
    const isImage: boolean = mimetype.startsWith("image/");
    const isVideo: boolean = mimetype.startsWith("video/");
    const isValid: boolean = isImage || isVideo;

    if (!isValid) {
      return {
        isValid: false,
        message: "Only images and videos are allowed"
      };
    }

    return { isValid: true };
  }

  private async syncSkills(
    tx: Prisma.TransactionClient,
    projectId: number,
    newSkillIds: number[],
    existingSkills: ProjectSkill[]
  ): Promise<void> {
    const existingIds: number[] = existingSkills.map((ps: ProjectSkill): number => ps.skillId);
    const toAdd: number[] = newSkillIds.filter((id: number): boolean => !existingIds.includes(id));
    const toRemove: number[] = existingIds.filter((id: number): boolean => !newSkillIds.includes(id));

    const hasSkillsToRemove: boolean = toRemove.length > 0;
    if (hasSkillsToRemove) {
      await tx.projectSkill.deleteMany({
        where: {
          projectId,
          skillId: { in: toRemove }
        }
      });
    }

    const hasSkillsToAdd: boolean = toAdd.length > 0;
    if (hasSkillsToAdd) {
      await tx.projectSkill.createMany({
        data: toAdd.map((skillId: number) => ({
          projectId,
          skillId
        }))
      });
    }
  }


  private transformProject(projectPrisma: PrismaProjectWithSkills): Project {
    const skills: SkillSubItem[] = projectPrisma.skills.map(
      (ps: ProjectSkill & { skill: Skill }): SkillSubItem => ({
        id: ps.skill.id,
        name: ps.skill.name,
        image: ps.skill.image,
        categoryId: 0,
      })
    );

    const project: Project = {
      id: projectPrisma.id,
      title: projectPrisma.title,
      descriptionEN: projectPrisma.descriptionEN,
      descriptionFR: projectPrisma.descriptionFR,
      typeDisplay: projectPrisma.typeDisplay,
      github: projectPrisma.github,
      contentDisplay: projectPrisma.contentDisplay,
      image: projectPrisma.image,
      video: projectPrisma.video,
      skills
    };

    return project;
  }

  private async saveUploadedFile(
    createReadStream: () => NodeJS.ReadableStream,
    originalFilename: string,
    uploadDir: string,
    projectId: number
  ): Promise<FileUploadResult> {
    return new Promise<FileUploadResult>(
      (
        resolve: (value: FileUploadResult) => void, 
        reject: (reason: Error) => void
      ): void => {
        try {
          const ext: string = path.extname(originalFilename);
          const timestamp: number = Date.now();
          const finalName: string = `project-${projectId}-${timestamp}${ext}`;
          const filePath: string = path.join(uploadDir, finalName);

          const stream: NodeJS.ReadableStream = createReadStream();
          const writeStream: fsSync.WriteStream = fsSync.createWriteStream(filePath);

          stream.pipe(writeStream);

          writeStream.on("finish", (): void => {
            const isImage: boolean = /\.(jpg|jpeg|png|gif|webp)$/i.test(ext);
            const type: MediaType = isImage ? "image" : "video";
            resolve({ filename: finalName, type });
          });

          writeStream.on("error", (err: Error): void => {
            reject(new Error(`Failed to write file: ${err.message}`));
          });

          stream.on("error", (err: Error): void => {
            reject(new Error(`Failed to read stream: ${err.message}`));
          });
        } catch (err: Error | unknown) {
          const errorMessage: string = err instanceof Error ? err.message : "Unknown error";
          reject(new Error(`File save error: ${errorMessage}`));
        }
      }
    );
  }


  private async deleteMediaFile(filename: string, type: MediaType): Promise<void> {
    try {
      const folder: string = type === "image" ? IMAGE_DIR : VIDEO_DIR;
      const filePath: string = path.join(UPLOAD_BASE, folder, filename);

      const fileExists: boolean = fsSync.existsSync(filePath);
      if (fileExists) {
        await fs.unlink(filePath);
      }
    } catch (err: Error | unknown) {
      console.error("Error deleting file:", err);
    }
  }
}