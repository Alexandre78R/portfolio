import { Resolver, Query } from "type-graphql";
import { Project } from "../entities/project.entity";
import prisma from "../lib/prisma";

@Resolver(() => Project)
export class ProjectResolver {
  @Query(() => [Project])
  async projectList(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return projects.map((p) => ({
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
  }
}
