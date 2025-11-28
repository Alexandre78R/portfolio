import { Resolver, Query, Arg, Int } from "type-graphql";
import { PrismaClient, Project as PrismaProject } from "@prisma/client";
import { Project } from "../entities/project.entity";
import { ProjectResponse, ProjectsResponse } from "../types/response.types";
import { mapProject } from "../lib/mapProject";

type PrismaProjectWithSkills = PrismaProject & {
  skills: Array<{
    projectId: number;
    skillId: number;
    skill: {
      id: number;
      name: string;
      image: string;
    };
  }>;
};

@Resolver(() => Project)
export class ProjectResolver {
  private readonly db = new PrismaClient();

  @Query(() => ProjectsResponse)
  async projectList(): Promise<ProjectsResponse> {
    const projects: PrismaProjectWithSkills[] = await this.db.project.findMany({
      include: { skills: { include: { skill: true } } },
      orderBy: { id: "desc" },
    });

    return {
      code: 200,
      message: "Projects fetched",
      projects: projects.map(mapProject),
    };
  }

  @Query(() => ProjectResponse)
  async projectById(
    @Arg("id", () => Int) id: number
  ): Promise<ProjectResponse> {
    const project: PrismaProjectWithSkills | null = await this.db.project.findUnique({
      where: { id },
      include: { skills: { include: { skill: true } } },
    });

    if (!project) {
      return { code: 404, message: "Project not found" };
    }

    return {
      code: 200,
      message: "Project fetched",
      project: mapProject(project),
    };
  }
}
