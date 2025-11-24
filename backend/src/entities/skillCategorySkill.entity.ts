import { Entity } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { SkillCategory } from "./skillCategory.entity";
import { SkillSubItem } from "./skillSubItem.entity";

/**
 * SkillCategorySkill entity - Junction table for N:N relationship
 * Links SkillCategory to SkillSubItem (skills)
 */
@ObjectType()
@Entity()
export class SkillCategorySkill {
  @Field(() => ID)
  readonly id: number;

  @Field(() => ID)
  readonly categoryId: number;

  @Field(() => ID)
  readonly skillId: number;

  @Field(() => SkillCategory, { nullable: true })
  readonly category?: SkillCategory;

  @Field(() => SkillSubItem, { nullable: true })
  readonly skill?: SkillSubItem;
}
