import { Entity } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { SkillSubItem } from "./skillSubItem.entity";

/**
 * SkillCategory entity - Represents a skill category
 * Linked to skills via SkillCategorySkill junction table
 */
@ObjectType()
@Entity()
export class SkillCategory {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly categoryEN: string;

  @Field()
  readonly categoryFR: string;

  @Field(() => [SkillSubItem])
  readonly skills: SkillSubItem[];
}
