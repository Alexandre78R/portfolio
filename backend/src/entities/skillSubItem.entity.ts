import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from "typeorm";
  import { Field, ID, ObjectType } from "type-graphql";
  import { Skill } from "./skill.entity";
  
@ObjectType()
export class SkillSubItem {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  image: string;

  @Field()
  categoryId: number;
}