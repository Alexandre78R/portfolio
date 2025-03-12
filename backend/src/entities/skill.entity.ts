import {
  Entity,
} from "typeorm";
import { Field,
  ID,
  ObjectType
} from "type-graphql";
import { SkillSubItem } from "./skillSubItem.entity";

@ObjectType()
@Entity()
export class Skill {
  @Field(() => ID)
  id: number;

  @Field()
  categoryEN: string;

  @Field()
  categoryFR: string;

  @Field(() => [SkillSubItem])
  skills: SkillSubItem[];
}