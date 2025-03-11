import { InputType, Field } from "type-graphql";

@InputType()
export class CreateProjectInput {
  @Field()
  title: string;

  @Field()
  descriptionEN: string;

  @Field()
  descriptionFR: string;

  @Field()
  typeDisplay: string;

  @Field({ nullable: true })
  github?: string;

  @Field()
  contentDisplay: string;

  @Field(() => [Number])
  skillIds: number[];
}