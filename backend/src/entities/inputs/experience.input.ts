import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateExperienceInput {

  @Field()
  jobEN: string;

  @Field()
  jobFR: string;

  @Field()
  business: string;

  @Field()
  employmentContractEN: string;

  @Field()
  employmentContractFR: string;

  @Field()
  startDateEN: string;

  @Field()
  startDateFR: string;

  @Field()
  endDateEN: string;

  @Field()
  endDateFR: string;

  @Field()
  month: number;

  @Field()
  typeEN: string;

  @Field()
  typeFR: string;

}