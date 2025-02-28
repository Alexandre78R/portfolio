import { Resolver, Query } from "type-graphql";
import { Skill } from "../types/skill.types";
import { skillsData } from "../Data/skillsData"; 

@Resolver()
export class SkillResolver {

  @Query(() => [Skill])
  async skillList(): Promise<Skill[]> {
    return skillsData.map(skill => ({
      id: skill.id,
      categoryFR: skill.categoryFR,
      categoryEN: skill.categoryEN,
      skills: skill.skills.map(skillItem => ({
        name: skillItem.name,
        image: skillItem.image
      }))
    }));
  }
}