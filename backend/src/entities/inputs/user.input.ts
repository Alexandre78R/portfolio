import { InputType, Field } from "type-graphql";
import { UserRole } from "../user.entity";

@InputType()
export class CreateUserInput {
  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  role: UserRole;
}