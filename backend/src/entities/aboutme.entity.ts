import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class AboutMe {
  @Field(() => ID)
  id!: number;

  @Field()
  titleEN!: string;

  @Field()
  titleFR!: string;

  @Field()
  descriptionEN!: string;

  @Field()
  descriptionFR!: string;

  @Field()
  isVisible!: boolean;
}
