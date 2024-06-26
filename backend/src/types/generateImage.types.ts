import { Field, InputType, ObjectType} from "type-graphql";

@InputType()
export class GenerateImageFrom {
    @Field()
    backgroundColor: string;

    @Field()
    logoUrl?: string;

    @Field()
    text: string;
}

@ObjectType()
export class GenerateImageResponse {
    @Field()
    backgroundColor: string;

    @Field()
    logoUrl?: string;

    @Field()
    text: string;
}