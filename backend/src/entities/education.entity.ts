import { ObjectType, Field, ID, Int } from "type-graphql";

@ObjectType()
export class Education {
  @Field(() => ID)
  id: number;

  @Field()
  titleFR: string;

  @Field()
  titleEN: string;

  @Field()
  diplomaLevelFR: string;

  @Field()
  diplomaLevelEN: string;

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

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field()
  typeEN: string;

  @Field()
  typeFR: string;
}