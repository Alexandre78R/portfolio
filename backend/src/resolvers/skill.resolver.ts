import { Resolver, Query } from "type-graphql";
import prisma from "../lib/prisma";
import { Skill } from "../entities/skill.entity";

@Resolver()
export class SkillResolver {
  @Query(() => [Skill])
  async skillList(): Promise<Skill[]> {
    const categories = await prisma.skillCategory.findMany({
      include: { skills: true },
      orderBy: { id: "asc" },
    });

    return categories.map((cat: any): Skill => ({
      id: cat.id,
      categoryFR: cat.categoryFR,
      categoryEN: cat.categoryEN,
      skills: cat.skills.map((s: any) => ({
        id: s.id,
        name: s.name,
        image: s.image,
        category: s.category,
      })),
    }));
  }
}