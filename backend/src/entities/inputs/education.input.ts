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

@InputType()
export class UpdateEducationInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  titleFR?: string;

  @Field({ nullable: true })
  titleEN?: string;

  @Field({ nullable: true })
  diplomaLevelEN?: string;

  @Field({ nullable: true })
  diplomaLevelFR?: string;

  @Field({ nullable: true })
  school?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field({ nullable: true })
  startDateEN?: string;

  @Field({ nullable: true })
  startDateFR?: string;

  @Field({ nullable: true })
  endDateEN?: string;

  @Field({ nullable: true })
  endDateFR?: string;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field({ nullable: true })
  typeEN?: string;

  @Field({ nullable: true })
  typeFR?: string;
}