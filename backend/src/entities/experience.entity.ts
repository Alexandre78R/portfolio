import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class Experience {
  @Field(() => ID)
  id: number;

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