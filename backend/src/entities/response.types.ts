import { ObjectType, Field, Int } from "type-graphql";
import { Project } from "../entities/project.entity";

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