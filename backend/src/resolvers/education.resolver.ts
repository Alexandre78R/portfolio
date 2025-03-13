import { Resolver, Query, Int, Arg, Mutation } from "type-graphql";
import { Education } from "../entities/education.entity";
import { PrismaClient } from "@prisma/client";
import { EducationResponse, EducationsResponse } from "../entities/response.types";
import { CreateEducationInput } from "../entities/inputs/education.input";

const prisma = new PrismaClient();

@Resolver()
export class EducationResolver {
  @Query(() => [Education])
  async educationList(): Promise<Education[]> {
    return await prisma.education.findMany();
  }

  @Query(() => EducationResponse)
  async educationById(
    @Arg("id", () => Int) id: number
  ): Promise<EducationResponse> {
    try {
      const edu = await prisma.education.findUnique({ where: { id } });
      if (!edu) return { code: 404, message: "Education not found" };
      return { code: 200, message: "Education fetched", education: edu };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching education" };
    }
  }

  @Mutation(() => EducationResponse)
  async createEducation(
    @Arg("data") data: CreateEducationInput
  ): Promise<EducationResponse> {
    try {
      const rec = await prisma.education.create({ data });
      return { code: 200, message: "Education created", education: rec };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating education" };
    }
  }
}