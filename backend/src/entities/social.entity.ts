import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Social {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  url: string;

  @Field(() => Int)
  tab: number;
}
