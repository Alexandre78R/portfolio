// export type MessageType = {
//     label: string;
//     message : string | unknown;
//     status : boolean;
// }


import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class MessageType {
    @Field()
    label: string | unknown;

    @Field()
    message: string | unknown;

    @Field()
    status: boolean;
}