import { Resolver, Query } from "type-graphql";
import { Project } from "../types/project.types";
import { projectsData } from "../Data/projectsData"; 

@Resolver()
export class ProjectResolver {
  @Query(() => [Project])
  async projects(): Promise<Project[]> {
    return projectsData.map(project => ({
      id: project.id,
      title: project.title,
      descriptionFR: project.descriptionFR,
      descriptionEN: project.descriptionEN,
      typeDisplay: project.typeDisplay,
      github: project.github,
      contentDisplay: project.contentDisplay,
      skills: project.skills.map(skillItem => ({
        name: skillItem.name,
        image: skillItem.image
      }))
    }));
  }
}