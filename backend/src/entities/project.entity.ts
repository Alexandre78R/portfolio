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
  import { SkillSubItem } from "./skillSubItem.entity";  // Importer SkillSubItem
  
  @ObjectType()
  @Entity()
  export class Project {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    title: string;
  
    @Field()
    @Column("text")
    descriptionFR: string;
  
    @Field()
    @Column("text")
    descriptionEN: string;
  
    @Field()
    @Column({ length: 50 })
    typeDisplay: string;
  
    @Field({ nullable: true })
    @Column({ nullable: true })
    github: string | null;
  
    @Field()
    @Column("text")
    contentDisplay: string;
  
    // Relation Many-to-Many avec SkillSubItem
    @Field(() => [SkillSubItem])
    @ManyToMany(() => SkillSubItem, { cascade: true })
    @JoinTable() // Cette table de jointure sera nommée 'project_skillsubitem'
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