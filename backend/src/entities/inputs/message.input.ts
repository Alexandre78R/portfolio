import { InputType, Field } from "type-graphql";

@InputType()
export class SendMessageInput {
  @Field()
  subject: string;

  @Field()
  content: string;

  @Field()
  recipients: string;
}
