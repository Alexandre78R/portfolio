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
  export class Experience {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    jobEN: string;
  
    @Field()
    @Column({ length: 100 })
    jobFR: string;
  
    @Field()
    @Column({ length: 100 })
    business: string;
  
    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    employmentContractEN: string | null;
  
    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    employmentContractFR: string | null;
  
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