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
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    @Length(1, 100, {
        message: "Title must have between 1 to 100 characters",
    })
    title: string;
  
    @Field()
    @Column("text")
    descriptionFR: string;
  
    @Field()
    @Column("text")
    descriptionEN: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "TypeDisplay must have between 1 to 50 characters",
    })
    typeDisplay: string;
  
    @Field({ nullable: true })
    @Column({ nullable: true })
    github: string | null;
  
    @Field()
    @Column("text")
    contentDisplay: string;
  
    @Field(() => [SkillSubItem])
    @ManyToMany(() => SkillSubItem, { cascade: true })
    @JoinTable()
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
    updated_at: Date;
  }