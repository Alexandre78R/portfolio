import { Resolver, Query } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver()
export class ExperienceResolver {
  @Query(() => [Experience])
  async experienceList(): Promise<Experience[]> {
    return await prisma.experience.findMany();
  }
}