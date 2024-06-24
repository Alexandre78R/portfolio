import {
    Arg,
    Authorized,
    Float,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";

import {
    ContactFrom,
    ContactResponse   
} from "../types/contact.types"

import { sendEmail } from "../mail/mail.service";
import { MessageType } from "../types/message.types";

@Resolver()
export class ContactResolver {

    @Query(() => String)  
    async contectTest(): Promise<string> {
        return "ok";
    }

    // @Mutation(() => [String])
    // async contactMe (@Arg("data") data: ContactFrom) {
    //     return data;
    // }

    @Mutation(() => ContactResponse)
    async contactMe(@Arg("data", () => ContactFrom) data: ContactFrom): Promise<ContactResponse> {
        return data;
    }

    @Mutation(() => MessageType)
    async sendEmailTest(): Promise<MessageType> {
        const resultSendEmail = await sendEmail("contactalexandre-renard.dev", "subject", "text");
        console.log(resultSendEmail)
        return resultSendEmail
    }
}