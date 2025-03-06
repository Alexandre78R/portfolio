import { Resolver, Query } from "type-graphql";
import { Experience } from "../entities/experience.entity";
import { experiencesData } from "../prisma/seed/experiencesData";

@Resolver()
export class ExperienceResolver {
  @Query(() => [Experience])
  async experienceList(): Promise<Experience[]> {
    return experiencesData.map(experience => ({
      id: experience.id,
      jobEN: experience.jobEN,
      jobFR: experience.jobFR,
      business: experience.business,
      employmentContractEN: experience.employmentContractEN,
      employmentContractFR: experience.employmentContractFR,
      startDateEN: experience.startDateEN,
      startDateFR: experience.startDateFR,
      endDateEN: experience.endDateEN,
      endDateFR: experience.endDateFR,
      month: experience.month,
      typeEN: experience.typeEN,
      typeFR: experience.typeFR,
      // created_at: experience.created_at,
      // updated_at: experience.updated_at,
    }));
  }
}