import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { Skill } from "./skill.entity";

/**
 * SkillSubItem entity - Represents a skill as it appears within a category
 * categoryId is optional since skills are now independent, linked via junction table
 */
@ObjectType()
export class SkillSubItem {
  @Field(() => ID)
  readonly id: number;

  @Field()
  readonly name: string;

  @Field()
  readonly image: string;

  @Field({ nullable: true })
  readonly categoryId?: number;
}
