import { InputType, Field, Int } from "type-graphql";

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

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  video?: string;
}

@InputType()
export class UpdateProjectInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  descriptionFR?: string;

  @Field({ nullable: true })
  descriptionEN?: string;

  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  typeDisplay?: string;

  @Field({ nullable: true })
  contentDisplay?: string;

  @Field(() => [Int], { nullable: true })
  skillIds?: number[];

  @Field({ nullable: true })
  image?: string;

  @Field({ nullable: true })
  video?: string;
}