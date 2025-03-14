import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { PrismaClient } from "@prisma/client";
import { ExperienceResponse, ExperiencesResponse } from "../entities/response.types";
import { CreateExperienceInput } from "../entities/inputs/experience.input";

const prisma = new PrismaClient();

@Resolver(() => Experience)
export class ExperienceResolver {
  @Query(() => ExperiencesResponse)
  async experienceList(): Promise<ExperiencesResponse> {
    try {
      const list = await prisma.experience.findMany();
      return { code: 200, message: "Experiences fetched", experiences: list };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching experiences" };
    }
  }

  @Query(() => ExperienceResponse)
  async experienceById(
    @Arg("id", () => Int) id: number
  ): Promise<ExperienceResponse> {
    try {
      const exp = await prisma.experience.findUnique({ where: { id } });
      if (!exp) return { code: 404, message: "Experience not found" };
      return { code: 200, message: "Experience fetched", experience: exp };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching experience" };
    }
  }

  @Mutation(() => ExperienceResponse)
  async createExperience(
    @Arg("data") data: CreateExperienceInput
  ): Promise<ExperienceResponse> {
    try {
      const rec = await prisma.experience.create({ data });
      return { code: 200, message: "Experience created", experience: rec };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating experience" };
    }
  }
}