import { Entity } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { SkillSubItem } from "./skillSubItem.entity";

/**
 * Skill entity - Represents an individual skill
 * Now independent from categories, linked via SkillCategorySkill join table
 */
@ObjectType()
@Entity()
export class Skill {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly image: string;

  @Field(() => [SkillSubItem])
  readonly skills: SkillSubItem[];
}
