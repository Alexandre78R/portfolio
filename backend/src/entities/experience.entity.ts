import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
  import { Field, ID, ObjectType } from "type-graphql";
import { Length } from "class-validator";
  
  @ObjectType()
  @Entity()
  export class Experience {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    @Length(1, 40, {
        message: "JobEN must have between 1 to 40 characters",
    })
    jobEN: string;
  
    @Field()
    @Column({ length: 100 })
    @Length(1, 40, {
        message: "JobFR must have between 1 to 40 characters",
    })
    jobFR: string;
  
    @Field()
    @Column({ length: 25 })
    @Length(1, 25, {
        message: "Business must have between 1 to 25 characters",
    })
    business: string;
  
    @Field(() => String, { nullable: true })
    @Column({ length: 50, nullable: true })
    @Length(1, 50, {
        message: "EmploymentContractEN must have between 1 to 50 characters",
    })
    employmentContractEN: string | null;
  
    @Field(() => String, { nullable: true })
    @Column({ length: 100, nullable: true })
    @Length(1, 50, {
        message: "EmploymentContractFR must have between 1 to 50 characters",
    })
    employmentContractFR: string | null;
  
    @Field()
    @Column({ length: 20 })
    @Length(1, 20, {
        message: "StartDateEN must have between 1 to 20 characters",
    })
    startDateEN: string;
  
    @Field()
    @Column({ length: 20 })
    @Length(1, 20, {
        message: "StartDateFR must have between 1 to 20 characters",
    })
    startDateFR: string; 
  
    @Field()
    @Column({ length: 20 })
    @Length(1, 20, {
        message: "EndDateEN must have between 1 to 20 characters",
    })
    endDateEN: string;
  
    @Field()
    @Column({ length: 20 })
    @Length(1, 20, {
        message: "EndDateFR must have between 1 to 20 characters",
    })
    endDateFR: string;
  
    @Field(() => Number, { nullable: true }) 
    @Column({ nullable: true, type: "int" })
    month: number | null;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "TypeEN must have between 1 to 50 characters",
    })
    typeEN: string; 
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "TypeFR must have between 1 to 50 characters",
    })
    typeFR: string;
  
    // @Field({ nullable: true })
    // @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
    // created_at: Date;
  
    // @Field({ nullable: true })
    // @UpdateDateColumn({
    //   name: "updated_at",
    //   default: () => "CURRENT_TIMESTAMP",
    //   onUpdate: "CURRENT_TIMESTAMP",
    // })
    // updated_at: Date;
  }