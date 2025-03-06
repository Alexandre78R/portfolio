import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Field, ID, ObjectType } from "type-graphql";
  import { SkillSubItem } from "./skillSubItem.entity";
import { Length } from "class-validator";

@ObjectType()
@Entity()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  descriptionFR: string;

  @Field()
  descriptionEN: string;

  @Field()
  typeDisplay: string;

  @Field(() => String, { nullable: true })
  github: string | null;

  @Field()
  contentDisplay: string;

  @Field(() => [SkillSubItem])
  skills: SkillSubItem[];
  
    // @Field()
    // @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
    // created_at: Date;
  
    // @Field()
    // @UpdateDateColumn({
    //   name: "updated_at",
    //   default: () => "CURRENT_TIMESTAMP",
    //   onUpdate: "CURRENT_TIMESTAMP",
    // })
    // updated_at: Date;
}