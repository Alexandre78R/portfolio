import { Resolver, Query, Arg, Int } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { PrismaClient } from "@prisma/client";
import { ExperienceResponse, ExperiencesResponse } from "../entities/response.types";

const prisma = new PrismaClient();

@Resolver()
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
}