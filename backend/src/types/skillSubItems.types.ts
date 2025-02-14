import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class SkillSubItem {
  @Field()
  name: string;

  @Field()
  image: string;
}