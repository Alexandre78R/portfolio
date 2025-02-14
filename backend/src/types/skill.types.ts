import { ObjectType, Field, ID } from "type-graphql";
import { SkillSubItem } from "./skillSubItems.types"

@ObjectType()
export class Skill {
  @Field(() => ID)
  id: number;

  @Field()
  categoryFR: string;

  @Field()
  categoryEN: string;

  @Field(() => [SkillSubItem])
  skills: SkillSubItem[];
}