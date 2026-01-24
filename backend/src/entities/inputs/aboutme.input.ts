import { InputType, Field, Int } from "type-graphql";

@InputType()
export class UpdateAboutMeInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  titleEN?: string;

  @Field({ nullable: true })
  titleFR?: string;

  @Field({ nullable: true })
  descriptionEN?: string;

  @Field({ nullable: true })
  descriptionFR?: string;
}
