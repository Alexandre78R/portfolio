import { Resolver, Query, Arg, Int, Mutation } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { PrismaClient } from "@prisma/client";
import { ExperienceResponse, ExperiencesResponse } from "../entities/response.types";
import { CreateExperienceInput, UpdateExperienceInput } from "../entities/inputs/experience.input";

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
      const addExperience = await prisma.experience.create({ data });
      return { code: 200, message: "Experience created", experience: addExperience };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating experience" };
    }
  }

    @Mutation(() => ExperienceResponse)
  async updateExperience(
    @Arg("data") data: UpdateExperienceInput
  ): Promise<ExperienceResponse> {
    try {
      const existing = await prisma.experience.findUnique({ where: { id: data.id } });
      if (!existing) return { code: 404, message: "Experience not found" };
      const up = await prisma.experience.update({
        where: { id: data.id },
        data: {
          jobEN: data.jobEN ?? existing.jobEN,
          jobFR: data.jobFR ?? existing.jobFR,
          business: data.business ?? existing.business,
          employmentContractEN: data.employmentContractEN ?? existing.employmentContractEN,
          employmentContractFR: data.employmentContractFR ?? existing.employmentContractFR,
          startDateEN: data.startDateEN ?? existing.startDateEN,
          startDateFR: data.startDateFR ?? existing.startDateFR,
          endDateEN: data.endDateEN ?? existing.endDateEN,
          endDateFR: data.endDateFR ?? existing.endDateFR,
          month: data.month ?? existing.month,
          typeEN: data.typeEN ?? existing.typeEN,
          typeFR: data.typeFR ?? existing.typeFR,
        },
      });
      return { code: 200, message: "Experience updated", experience: up };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error updating experience" };
    }
  }
}