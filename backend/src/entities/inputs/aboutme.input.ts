import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateAboutMeInput {
  @Field()
  titleEN!: string;

  @Field()
  titleFR!: string;

  @Field()
  descriptionEN!: string;

  @Field()
  descriptionFR!: string;

  @Field({ nullable: true })
  isVisible?: boolean;
}

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

  @Field({ nullable: true })
  isVisible?: boolean;
}
