import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class MessageType {
    @Field()
    label: string;

    @Field()
    message: string;

    @Field()
    status: boolean;
}