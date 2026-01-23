import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateSignatureInput {
  @Field()
  name!: string;

  @Field()
  description!: string;
}

@InputType()
export class UpdateSignatureInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
