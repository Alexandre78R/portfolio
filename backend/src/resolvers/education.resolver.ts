import { Resolver, Query, Int, Arg, Mutation, Authorized, Ctx } from "type-graphql";
import { Education } from "../entities/education.entity";
import { PrismaClient } from "@prisma/client";
import { EducationResponse, EducationsResponse } from "../entities/response.types";
import { CreateEducationInput, UpdateEducationInput } from "../entities/inputs/education.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

const prisma = new PrismaClient();

@Resolver(() => Education)
export class EducationResolver {

  @Query(() => EducationsResponse)
  async educationList(): Promise<EducationsResponse> {
    try {
      const list = await prisma.education.findMany();
      return { code: 200, message: "Educations fetched", educations: list };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching educations" };
    }
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

  @Authorized([UserRole.admin])
  @Mutation(() => EducationResponse)
  async createEducation(
    @Arg("data") data: CreateEducationInput,
    @Ctx() ctx: MyContext
  ): Promise<EducationResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const edu = await prisma.education.create({ data });
      return { code: 200, message: "Education created", education: edu };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating education" };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => EducationResponse)
  async updateEducation(
    @Arg("data") data: UpdateEducationInput,
    @Ctx() ctx: MyContext
  ): Promise<EducationResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin or Editor role required." };
      }

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

  @Authorized([UserRole.admin])
  @Mutation(() => EducationResponse)
  async deleteEducation(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<EducationResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

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