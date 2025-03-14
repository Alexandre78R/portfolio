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

@InputType()
export class UpdateExperienceInput {

  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  jobEN?: string;

  @Field({ nullable: true })
  jobFR?: string;

  @Field({ nullable: true })
  business?: string;

  @Field({ nullable: true })
  employmentContractEN?: string;

  @Field({ nullable: true })
  employmentContractFR?: string;

  @Field({ nullable: true })
  startDateEN?: string;

  @Field({ nullable: true })
  startDateFR?: string;

  @Field({ nullable: true })
  endDateEN?: string;

  @Field({ nullable: true })
  endDateFR?: string;

  @Field({ nullable: true })
  month?: number;

  @Field({ nullable: true })
  typeEN?: string;

  @Field({ nullable: true })
  typeFR?: string;
}