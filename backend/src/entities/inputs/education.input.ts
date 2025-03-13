import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateEducationInput {
  @Field()
  titleFR: string;
  @Field()
  titleEN: string;
  @Field()
  diplomaLevelEN: string;
  @Field()
  diplomaLevelFR: string;
  @Field()
  school: string;
  @Field()
  location: string;
  @Field(() => Int)
  year: number;
  @Field()
  startDateEN: string;
  @Field()
  startDateFR: string;
  @Field()
  endDateEN: string;
  @Field()
  endDateFR: string;
  @Field(() => Int)
  month: number;
  @Field()
  typeEN: string;
  @Field()
  typeFR: string;
}