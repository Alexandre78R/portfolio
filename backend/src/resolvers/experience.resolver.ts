import { Resolver, Query, Arg, Int, Mutation, Ctx, Authorized } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { ExperienceResponse, ExperiencesResponse } from "../types/response.types";
import { CreateExperienceInput, UpdateExperienceInput } from "../entities/inputs/experience.input";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { PrismaClient } from "@prisma/client";

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Query(() => ExperiencesResponse)
  async experienceList(): Promise<ExperiencesResponse> {
    try {
      const list = await this.db.experience.findMany();
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
      const exp = await this.db.experience.findUnique({ where: { id } });
      if (!exp) return { code: 404, message: "Experience not found" };
      return { code: 200, message: "Experience fetched", experience: exp };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching experience" };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => ExperienceResponse)
  async createExperience(
    @Arg("data") data: CreateExperienceInput,
    @Ctx() ctx: MyContext
  ): Promise<ExperienceResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const addExperience = await this.db.experience.create({ data });
      return { code: 200, message: "Experience created", experience: addExperience };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error creating experience" };
    }
  }

  @Authorized([UserRole.admin, UserRole.editor])
  @Mutation(() => ExperienceResponse)
  async updateExperience(
    @Arg("data") data: UpdateExperienceInput,
    @Ctx() ctx: MyContext
  ): Promise<ExperienceResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      const authorizedRoles = [UserRole.admin, UserRole.editor];

      if (!authorizedRoles.includes(ctx.user.role)) {
        return { code: 403, message: "Access denied. Admin or Editor role required." };
      }

      const existing = await this.db.experience.findUnique({ where: { id: data.id } });
      if (!existing) return { code: 404, message: "Experience not found" };
      const up = await this.db.experience.update({
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

  @Authorized([UserRole.admin])
  @Mutation(() => ExperienceResponse)
  async deleteExperience(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<ExperienceResponse> {
    try {

      if (!ctx.user) {
        return { code: 401, message: "Authentication required." };
      }

      if (ctx.user.role !== UserRole.admin) {
        return { code: 403, message: "Access denied. Admin role required." };
      }

      const existing = await this.db.experience.findUnique({ where: { id } });
      if (!existing) return { code: 404, message: "Experience not found" };
      await this.db.experience.delete({ where: { id } });
      return { code: 200, message: "Experience deleted" };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error deleting experience" };
    }
  }
}