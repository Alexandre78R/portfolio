import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateSocialInput {
  @Field()
  readonly title: string;

  @Field()
  readonly url: string;

  @Field(() => Int)
  readonly tab: number;
}

@InputType()
export class UpdateSocialInput {
  @Field({ nullable: true })
  readonly title?: string;

  @Field({ nullable: true })
  readonly url?: string;

  @Field(() => Int, { nullable: true })
  readonly tab?: number;
}
