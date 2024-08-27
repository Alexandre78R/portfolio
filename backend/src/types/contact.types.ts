import { Field, InputType, ObjectType} from "type-graphql";

@InputType()
export class ContactFrom {
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
    email: string;

    @Field()
    object: string;

    @Field()
    message: string;

}