import { Resolver, Query, Int, Arg, Mutation } from "type-graphql";
import { Education } from "../entities/education.entity";
import { PrismaClient } from "@prisma/client";
import { EducationResponse, EducationsResponse } from "../entities/response.types";
import { CreateEducationInput, UpdateEducationInput } from "../entities/inputs/education.input";

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
      const edu = await prisma.education.create({ data });
      return { code: 200, message: "Education created", education: edu };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating education" };
    }
  }

  @Mutation(() => EducationResponse)
  async updateEducation(
    @Arg("data") data: UpdateEducationInput
  ): Promise<EducationResponse> {
    try {
      const existing = await prisma.education.findUnique({ where: { id: data.id } });
      if (!existing) return { code: 404, message: "Education not found" };
      const up = await prisma.education.update({
        where: { id: data.id },
        data: {
          titleFR: data.titleFR ?? existing.titleFR,
          titleEN: data.titleEN ?? existing.titleEN,
          diplomaLevelEN: data.diplomaLevelEN ?? existing.diplomaLevelEN,
          diplomaLevelFR: data.diplomaLevelFR ?? existing.diplomaLevelFR,
          school: data.school ?? existing.school,
          location: data.location ?? existing.location,
          year: data.year ?? existing.year,
          startDateEN: data.startDateEN ?? existing.startDateEN,
          startDateFR: data.startDateFR ?? existing.startDateFR,
          endDateEN: data.endDateEN ?? existing.endDateEN,
          endDateFR: data.endDateFR ?? existing.endDateFR,
          month: data.month ?? existing.month,
          typeEN: data.typeEN ?? existing.typeEN,
          typeFR: data.typeFR ?? existing.typeFR,
        },
      });
      return { code: 200, message: "Education updated", education: up };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error updating education" };
    }
  }

  @Mutation(() => EducationResponse)
  async deleteEducation(
    @Arg("id", () => Int) id: number
  ): Promise<EducationResponse> {
    try {
      const existing = await prisma.education.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Education not found" };
      await prisma.education.delete({ where: { id } });
      return { code: 200, message: "Education deleted" };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error deleting education" };
    }
  }
}