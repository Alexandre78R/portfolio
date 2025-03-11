import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Project } from "../entities/project.entity";
import prisma from "../lib/prisma";
import { CreateProjectInput } from "../entities/inputs/project.input";

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
  @Query(() => Project, { nullable: true })
  async projectById(
    @Arg("id", () => Int) id: number
  ): Promise<Project | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    console.log("Project found:", project);

    if (!project) return null;

    return {
      ...project,
      skills: project.skills.map((ps) => ({
        ...ps.skill,
      })),
    };
  }

  @Mutation(() => Project)
  async createProject(
    @Arg("data") data: CreateProjectInput
  ): Promise<Project> {
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
        skills: {
          include: { skill: true },
        },
      },
    });

    return {
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
    };
  }
}
