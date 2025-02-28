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
  export class Education {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;
  
    @Field()
    @Column({ length: 100 })
    @Length(1, 100, {
        message: "TitleFR must have between 1 to 100 characters",
    })
    titleFR: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "TtitleEN must have between 1 to 50 characters",
    })
    titleEN: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "DiplomateFR must have between 1 to 50 characters",
    })
    diplomaLevelFR: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "DiplomateEN must have between 1 to 50 characters",
    })
    diplomaLevelEN: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "Shool must have between 1 to 50 characters",
    })
    school: string;
  
    @Field()
    @Column({ length: 50 })
    @Length(1, 50, {
        message: "Location must have between 1 to 50 characters",
    })
    location: string;
  
    @Field()
    @Column({ type: "int" })
    year: number;
  
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
    @Column({ length: 30 })
    @Length(1, 30, {
        message: "TypeEN must have between 1 to 30 characters",
    })
    typeEN: string;
  
    @Field()
    @Column({ length: 30 })
    @Length(1, 30, {
        message: "TypeFR must have between 1 to 30 characters",
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