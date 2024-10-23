import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Field, ID, ObjectType } from "type-graphql";
  
  @ObjectType()
  @Entity()
  export class Education {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    titleFR: string;
  
    @Field()
    @Column({ length: 100 })
    titleEN: string;
  
    @Field()
    @Column({ length: 100 })
    diplomaLevelFR: string;
  
    @Field()
    @Column({ length: 100 })
    diplomaLevelEN: string;
  
    @Field()
    @Column({ length: 100 })
    school: string;
  
    @Field()
    @Column({ length: 100 })
    location: string;
  
    @Field()
    @Column({ type: "int" })
    year: number;
  
    @Field()
    @Column({ length: 50 })
    startDateEN: string;
  
    @Field()
    @Column({ length: 50 })
    startDateFR: string;
  
    @Field()
    @Column({ length: 50 })
    endDateEN: string;
  
    @Field()
    @Column({ length: 50 })
    endDateFR: string; 
  
    @Field({ nullable: true })
    @Column({ nullable: true, type: "int" })
    month: number | null; 
  
    @Field()
    @Column({ length: 50 })
    typeEN: string;
  
    @Field()
    @Column({ length: 50 })
    typeFR: string; 
  
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