import { Field, InputType, ObjectType} from "type-graphql";

@InputType()
export class ContactFrom {
    @Field()
    firstname: string;

    @Field()
    lastname: string;

    @Field()
    email: string;

    @Field()
    object: string;

    @Field()
    message: string;
}

@ObjectType()
export class ContactResponse {
    @Field()
    firstname: string;

    @Field()
    lastname: string;

    @Field()
    email: string;

    @Field()
    object: string;

    @Field()
    message: string;
}