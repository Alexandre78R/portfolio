import { ObjectType, Field, ID } from "type-graphql";
import { SkillSubItem } from "./skillSubItems.types"

@ObjectType()
export class Project {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  descriptionFR: string;

  @Field()
  descriptionEN: string;

  @Field()
  typeDisplay: string;

  @Field({ nullable: true })
  github?: string;

  @Field()
  contentDisplay: string;

  @Field(() => [SkillSubItem])
  skills: SkillSubItem[];
}