import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

export enum UserRole {
  admin = "admin",
  editor = "editor",
  view = "view",
}

registerEnumType(UserRole, {
  name: "Role",
  description: "User roles",
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  isPasswordChange: boolean;
}