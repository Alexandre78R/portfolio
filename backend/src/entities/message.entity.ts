import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  subject: string;

  @Field()
  content: string;

  @Field()
  recipients: string;

  @Field()
  createdAt: string;
}
