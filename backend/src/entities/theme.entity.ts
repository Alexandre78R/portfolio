import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
export class Theme {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  body: string;

  @Field()
  scrollHandle: string;

  @Field()
  scrollHandleHover: string;

  @Field()
  primary: string;

  @Field()
  secondary: string;

  @Field()
  success: string;

  @Field()
  error: string;

  @Field()
  warn: string;

  @Field()
  info: string;

  @Field()
  grey: string;

  @Field()
  placeholder: string;

  @Field()
  footer: string;

  @Field()
  admin: string;

  @Field()
  textDefault: string;

  @Field()
  text100: string;

  @Field()
  text200: string;

  @Field()
  text300: string;

  @Field()
  textButton: string;

  @Field(() => Boolean)
  visible: boolean;
}