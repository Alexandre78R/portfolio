import { Project as PrismaProject, ProjectSkill, Skill } from "@prisma/client";
import { Project } from "../entities/project.entity";

export function mapProject(
  project: PrismaProject & {
    skills: (ProjectSkill & { skill: Skill })[];
  }
): Project {
  return {
    id: project.id,
    title: project.title,
    descriptionFR: project.descriptionFR,
    descriptionEN: project.descriptionEN,
    github: project.github ?? null,
    typeDisplay: project.typeDisplay,
    contentDisplay: project.contentDisplay,
    skills: project.skills.map(ps => ({
      id: ps.skill.id,
      name: ps.skill.name,
      image: ps.skill.image,
      categoryId: ps.skill.categoryId,
    })),
  };
}
