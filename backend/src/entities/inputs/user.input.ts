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

  @Field()
  lang: string;
}

@InputType()
export class LoginInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  email!: string;

  @Field()
  lang!: string;
}