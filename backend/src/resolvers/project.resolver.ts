import { Resolver, Query } from "type-graphql";
import { Project as GQLProject } from "../types/project.types";
import prisma from "../lib/prisma";
import { SkillSubItem } from "../types/skillSubItems.types";

@Resolver()
export class ProjectResolver {
  @Query(() => [GQLProject])
  async projectsList(): Promise<GQLProject[]> {
    const projects = await prisma.project.findMany({
      include: {
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { id: "asc" },
    });

    if (!projects || !Array.isArray(projects)) return [];

    return projects.map((p: any): GQLProject => ({
      id: p.id,
      title: p.title,
      descriptionFR: p.descriptionFR,
      descriptionEN: p.descriptionEN,
      typeDisplay: p.typeDisplay,
      github: p.github ?? undefined,
      contentDisplay: p.contentDisplay,
      skills: p.skills.map((ps: any): SkillSubItem => ({
        name: ps.skill.name,
        image: ps.skill.image,
      })),
    }));
  }
}