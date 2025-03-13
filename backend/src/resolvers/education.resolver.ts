import { Resolver, Query, Int, Arg } from "type-graphql";
import { Education } from "../entities/education.entity";
import { PrismaClient } from "@prisma/client";
import { EducationResponse, EducationResponseByID } from "../entities/response.types";

const prisma = new PrismaClient();

@Resolver()
export class EducationResolver {
  @Query(() => [Education])
  async educationList(): Promise<Education[]> {
    return await prisma.education.findMany();
  }

  @Query(() => EducationResponseByID)
  async educationById(
    @Arg("id", () => Int) id: number
  ): Promise<EducationResponseByID> {
    try {
      const edu = await prisma.education.findUnique({ where: { id } });
      if (!edu) return { code: 404, message: "Education not found" };
      return { code: 200, message: "Education fetched", education: edu };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching education" };
    }
  }
}