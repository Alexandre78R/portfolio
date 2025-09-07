import { ObjectType, Field, Int, Float } from "type-graphql";
import { Project } from "../entities/project.entity";
import { Skill } from "../entities/skill.entity";
import { SkillSubItem } from "../entities/skillSubItem.entity";
import { Education } from "../entities/education.entity";
import { Experience } from "../entities/experience.entity";
import { User } from "../entities/user.entity";

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
export class EducationsResponse extends Response {
  @Field(() => [Education], { nullable: true })
  educations?: Education[];
}

@ObjectType()
export class EducationResponse extends Response {
  @Field(() => Education, { nullable: true })
  education?: Education;
}

@ObjectType()
export class ExperiencesResponse extends Response {
  @Field(() => [Experience], { nullable: true })
  experiences?: Experience[];
}

@ObjectType()
export class ExperienceResponse extends Response {
  @Field(() => Experience, { nullable: true })
  experience?: Experience;
}

@ObjectType()
export class UserResponse extends Response{
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UsersResponse extends Response{
  @Field(() => [User], { nullable: true })
  users?: User[];
}

@ObjectType()
export class LoginResponse extends Response {
  @Field(() => String, { nullable: true })
  token?: string;
}

export @ObjectType()
class GlobalStats {
  @Field(() => Int)
  totalUsers!: number;

  @Field(() => Int)
  totalProjects!: number;

  @Field(() => Int)
  totalSkills!: number;

  @Field(() => Int)
  totalEducations!: number;

  @Field(() => Int)
  totalExperiences!: number;

  @Field(() => Int)
  usersByRoleAdmin!: number; 
  @Field(() => Int)
  usersByRoleEditor!: number;
  @Field(() => Int)
  usersByRoleView!: number;
}

@ObjectType()
export class GlobalStatsResponse extends Response {
  @Field(() => GlobalStats, { nullable: true })
  stats?: GlobalStats;
}

@ObjectType()
export class BackupFileInfo {
  @Field()
  fileName!: string; 

  @Field(() => Int)
  sizeBytes!: number;

  @Field()
  createdAt!: Date;

  @Field()
  modifiedAt!: Date;
}

@ObjectType()
export class BackupFilesResponse extends Response {

  @Field(() => [BackupFileInfo], { nullable: true })
  files?: BackupFileInfo[];
}

@ObjectType()
export class BackupResponse extends Response {
  @Field()
  path: string;
}

@ObjectType()
export class UserRolePercent extends Response {
  @Field(() => Float)
  admin: number;

  @Field(() => Float)
  editor: number;

  @Field(() => Float)
  view: number;
}

@ObjectType()
export class TopSkillUsage {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  usageCount: number;
}

@ObjectType()
export class TopSkillsResponse extends Response {
  @Field(() => [TopSkillUsage])
  skills: TopSkillUsage[];
}