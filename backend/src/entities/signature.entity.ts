import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Signature {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  description!: string;
}
