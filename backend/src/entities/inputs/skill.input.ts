import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateCategoryInput {
  @Field()
  categoryEN: string;

  @Field()
  categoryFR: string;
}

@InputType()
export class CreateSkillInput {
  @Field()
  name: string;

  @Field()
  image: string;

  @Field(() => Int)
  categoryId: number;
}