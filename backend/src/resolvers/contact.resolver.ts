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
import { checkRegex, emailRegex } from "../regex";

@Resolver()
export class ContactResolver {

    @Mutation(() => MessageType)
    async sendContact(@Arg("data", () => ContactFrom) data: ContactFrom, @Ctx() context: MyContext): Promise<MessageType> {

        if (!checkRegex(emailRegex, data.email))
            throw new Error("Invaid format email.");
        
        const messageFinalMETEXT = await structureMessageMeTEXT(data);
        const messageFinalMEHTML = await structureMessageMeHTML(data);
        const resultSendEmailME = await sendEmail(data?.email, data?.object, messageFinalMETEXT, messageFinalMEHTML, true);

        console.log("resutsSendEmail", resultSendEmailME)
        return resultSendEmailME;
    }
}