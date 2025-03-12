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

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  categoryEN?: string;

  @Field({ nullable: true })
  categoryFR?: string;
}

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Int)
  categoryId?: number;
}