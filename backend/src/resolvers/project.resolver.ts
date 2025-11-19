import { Resolver, Query, Arg, Int } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Project } from "../entities/project.entity";
import { ProjectResponse, ProjectsResponse } from "../types/response.types";
import { mapProject } from "../lib/mapProject";

@Resolver(() => Project)
export class ProjectResolver {
  private readonly db = new PrismaClient();

  @Query(() => ProjectsResponse)
  async projectList(): Promise<ProjectsResponse> {
    const projects = await this.db.project.findMany({
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
    const project = await this.db.project.findUnique({
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
