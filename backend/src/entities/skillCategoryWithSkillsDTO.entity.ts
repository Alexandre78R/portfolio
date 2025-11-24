import { ObjectType, Field, ID } from "type-graphql";
import { SkillSubItem } from "./skillSubItem.entity";

/**
 * SkillCategoryWithSkills DTO - Used for GraphQL responses
 * Represents a skill category with its associated skills via junction table
 */
@ObjectType()
export class SkillCategoryWithSkillsDTO {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly categoryEN: string;

  @Field()
  readonly categoryFR: string;

  @Field(() => [SkillSubItem])
  readonly skills: SkillSubItem[];
}
