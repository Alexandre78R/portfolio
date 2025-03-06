import { Resolver, Query } from "type-graphql";
import { Education } from "../entities/education.entity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver()
export class EducationResolver {
  @Query(() => [Education])
  async educationList(): Promise<Education[]> {
    return await prisma.education.findMany();
  }
}