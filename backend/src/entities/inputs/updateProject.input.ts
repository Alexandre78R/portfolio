import { InputType, Field, Int } from "type-graphql";
import { IsOptional, IsString, IsArray, ArrayUnique, IsInt, IsUrl, Length } from "class-validator";

@InputType()
export class UpdateProjectInput {
  @Field(() => Int)
  id!: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  descriptionFR?: string;

  @Field({ nullable: true })
  descriptionEN?: string;

  @Field({ nullable: true })
  github?: string;

  @Field({ nullable: true })
  typeDisplay?: string;

  @Field({ nullable: true })
  contentDisplay?: string;

  @Field(() => [Int], { nullable: true })
  skillIds?: number[];
}

// @InputType()
// export class UpdateProjectInput {
//   @Field(() => Int)
//   @IsInt()
//   id!: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   @Length(1, 255)
//   title?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   descriptionFR?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   descriptionEN?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   typeDisplay?: string;

//   @Field(() => String, { nullable: true })
//   @IsOptional()
//   @IsUrl()
//   github?: string | null;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   contentDisplay?: string;

//   /**
//    * Skill IDs to link to the project.
//    * - If undefined → skills untouched
//    * - If [] → all skills removed
//    * - If [1,2,3] → partial diff update
//    */
//   @Field(() => [Int], { nullable: true })
//   @IsOptional()
//   @IsArray()
//   @ArrayUnique()
//   @IsInt({ each: true })
//   skillIds?: number[];
// }