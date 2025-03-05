import { Resolver, Query } from "type-graphql";
import { Skill as GQLSkill } from "../types/skill.types";
import prisma from "../lib/prisma";

@Resolver()
export class SkillResolver {
  @Query(() => [GQLSkill])
  async skillList(): Promise<GQLSkill[]> {
    const categories = await prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { id: "asc" },
    });
    
    if (!categories || !Array.isArray(categories)) return [];
    
    return categories.map((cat: any): GQLSkill => ({
      id: cat.id,
      categoryFR: cat.categoryFR,
      categoryEN: cat.categoryEN,
      skills: cat.skills.map((s: any) => ({
        name: s.name,
        image: s.image,
      })),
    }));
  }
}