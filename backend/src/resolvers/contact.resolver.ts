import {
    Arg,
    Authorized,
    Ctx,
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
import { MessageType} from "../types/message.types";
import { structureMessageMeTEXT, structureMessageMeHTML } from "../mail/structureMail.service";
import { MyContext } from "..";
import { checkApiKey } from "../lib/checkApiKey";

@Resolver()
export class ContactResolver {

    @Query(() => String)  
    async contact(@Ctx() context: MyContext): Promise<string> {
        console.log(context)
        return "ok";
    }

    @Mutation(() => MessageType)
    async sendContact(@Arg("data", () => ContactFrom) data: ContactFrom, @Ctx() context: MyContext): Promise<MessageType> {
        if (!context.apiKey)
            throw new Error('Unauthorized TOKEN API');
        await checkApiKey(context.apiKey);
        const messageFinalMETEXT = await structureMessageMeTEXT(data);
        const messageFinalMEHTML = await structureMessageMeHTML(data);
        const resultSendEmailME = await sendEmail(data?.email, data?.object, messageFinalMETEXT, messageFinalMEHTML);

        console.log("resutsSendEmail", resultSendEmailME)
        return resultSendEmailME;
    }
}