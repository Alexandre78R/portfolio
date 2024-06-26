import {
    Arg,
    Authorized,
    Float,
    Mutation,
    Query,
    Resolver,
    Ctx,
} from "type-graphql";

import {
    ContactFrom,
    ContactResponse   
} from "../types/contact.types"

import { sendEmail } from "../mail/mail.service";
import { MessageType} from "../types/message.types";
import { structureMessageMeTEXT, structureMessageMeHTML } from "../mail/structureMail.service";

@Resolver()
export class ContactResolver {

    @Query(() => String)  
    async contect(): Promise<string> {
        return "ok";
    }

    @Mutation(() => MessageType)
    async sendEmailTest(@Arg("data", () => ContactFrom) data: ContactFrom, @Ctx() context: any): Promise<MessageType> {
        if (context.apiKey !== process.env.API_KEY) {
            throw new Error('Non autorisé');
        }
        const messageFinalMETEXT = await structureMessageMeTEXT(data);
        const messageFinalMEHTML = await structureMessageMeHTML(data);
        const resultSendEmailME = await sendEmail(data?.email, data?.object, messageFinalMETEXT, messageFinalMEHTML);

        return resultSendEmailME;
    }
}