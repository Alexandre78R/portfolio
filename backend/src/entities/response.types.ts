import { ObjectType, Field, Int } from "type-graphql";
import { Project } from "./project.entity";
import { Skill } from "./skill.entity";
import { SkillSubItem } from "./skillSubItem.entity";
import { Education } from "./education.entity";

@ObjectType()
export class Response {
  @Field(() => Int)
  code: number;

  @Field()
  message: string;
}

@ObjectType()
export class ProjectResponse {
  @Field(() => Int)
  code: number;

  @Field()
  message: string;

  @Field(() => Project, { nullable: true })
  project?: Project;
}

@ObjectType()
export class ProjectsResponse {
  @Field(() => Int)
  code: number;

  @Field()
  message: string;

  @Field(() => [Project], { nullable: true })
  projects?: Project[];
}

@ObjectType()
export class CategoryResponse extends Response {
  @Field(() => [Skill], { nullable: true })
  categories?: Skill[];
}

@ObjectType()
export class SubItemResponse extends Response {
  @Field(() => [SkillSubItem], { nullable: true })
  subItems?: SkillSubItem[];
}

@ObjectType()
export class EducationResponse extends Response {
  @Field(() => Education, { nullable: true })
  education?: Education;
}

export class EducationsResponse extends Response {
  @Field(() => [Education], { nullable: true })
  educations?: Education[];
}