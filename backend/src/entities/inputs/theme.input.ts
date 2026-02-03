import { InputType, Field, Int } from "type-graphql";

@InputType()
export class CreateThemeInput {

  @Field()
  name: string;

  @Field()
  nameEN: string;

  @Field()
  nameFR: string;

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

  @Field(() => Boolean, { defaultValue: false })
  visible: boolean;
}

@InputType()
export class UpdateThemeInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  nameEN?: string;

  @Field({ nullable: true })
  nameFR?: string;

  @Field({ nullable: true })
  body?: string;

  @Field({ nullable: true })
  scrollHandle?: string;

  @Field({ nullable: true })
  scrollHandleHover?: string;

  @Field({ nullable: true })
  primary?: string;

  @Field({ nullable: true })
  secondary?: string;

  @Field({ nullable: true })
  success?: string;

  @Field({ nullable: true })
  error?: string;

  @Field({ nullable: true })
  warn?: string;

  @Field({ nullable: true })
  info?: string;

  @Field({ nullable: true })
  grey?: string;

  @Field({ nullable: true })
  placeholder?: string;

  @Field({ nullable: true })
  footer?: string;

  @Field({ nullable: true })
  admin?: string;

  @Field({ nullable: true })
  textDefault?: string;

  @Field({ nullable: true })
  text100?: string;

  @Field({ nullable: true })
  text200?: string;

  @Field({ nullable: true })
  text300?: string;

  @Field({ nullable: true })
  textButton?: string;

  @Field(() => Boolean, { nullable: true })
  visible?: boolean;
}