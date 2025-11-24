import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateCategoryInput {
  @Field()
  readonly categoryEN: string;

  @Field()
  readonly categoryFR: string;

  @Field(() => [Int], { nullable: true })
  readonly skillIds?: number[];
}

@InputType()
export class CreateSkillInput {
  @Field()
  readonly name: string;

  @Field()
  readonly image: string;

  @Field(() => Int, { nullable: true })
  readonly categoryId?: number;
}

@InputType()
export class UpdateCategoryInput {
  @Field({ nullable: true })
  readonly categoryEN?: string;

  @Field({ nullable: true })
  readonly categoryFR?: string;

  @Field(() => [Int], { nullable: true })
  readonly skillIds?: number[];
}

@InputType()
export class UpdateSkillInput {
  @Field({ nullable: true })
  readonly name?: string;

  @Field({ nullable: true })
  readonly image?: string;

  @Field(() => Int, { nullable: true })
  readonly categoryId?: number;
}