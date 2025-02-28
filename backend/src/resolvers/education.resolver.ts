import { Resolver, Query } from "type-graphql";
import { Education } from "../entities/education.entity";
import { educationsData } from "../Data/educationsData";

@Resolver()
export class EducationResolver {
  @Query(() => [Education])
  async educationList(): Promise<Education[]> {
    return educationsData.map(education => ({
      id: education.id,
      titleFR: education.titleFR,
      titleEN: education.titleEN,
      diplomaLevelEN: education.diplomaLevelEN,
      diplomaLevelFR: education.diplomaLevelFR,
      school: education.school,
      location: education.location,
      year: education.year,
      startDateEN: education.startDateEN,
      startDateFR: education.startDateFR,
      endDateEN: education.endDateEN,
      endDateFR: education.endDateFR,
      month: education.month,
      typeEN: education.typeEN,
      typeFR: education.typeFR,
      // created_at: education.created_at,
      // updated_at: education.updated_at,
    }));
  }
}