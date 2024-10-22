import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from "typeorm";
  import { Field, ID, ObjectType } from "type-graphql";
  import { Skill } from "./skill.entity";
  
  @ObjectType()
  @Entity()
  export class SkillSubItem {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 50 })
    name: string;
  
    @Field()
    @Column({ nullable: true })
    image: string;
  
    @Field(() => Skill)
    @ManyToOne(() => Skill, (skill) => skill.skills)
    skill: Skill;
  }