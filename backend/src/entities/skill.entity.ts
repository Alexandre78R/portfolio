import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    UpdateDateColumn,
    OneToMany,
  } from "typeorm";
  import { Length } from "class-validator";
  import { Field, ID, ObjectType } from "type-graphql";
  import { SkillSubItem } from "./skillSubItem.entity";

  @ObjectType()
  @Entity()
  export class Skill {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
      message: "Category must have between 1 to 50 characters",
    })
    categoryFR: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
      message: "Category must have between 1 to 50 characters",
    })
    categoryEN: string;

    @Field(() => [SkillSubItem])
    @OneToMany(() => SkillSubItem, (skillSubItem) => skillSubItem.skill, {
      cascade: true,
    })
    skills: SkillSubItem[];

    @Field()
    @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
    created_at: Date;
  
    @Field()
    @UpdateDateColumn({
      name: "updated_at",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
    })
    update_at: Date;
  }