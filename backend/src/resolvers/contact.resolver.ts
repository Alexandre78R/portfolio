import {
    Arg,
    Ctx,
    Mutation,
    Resolver,
} from "type-graphql";

import {
    ContactFrom,  
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
        
        const messageFinalMETEXT : string = await structureMessageMeTEXT(data);
        const messageFinalMEHTML : string = await structureMessageMeHTML(data);
        const resultSendEmailME : MessageType = await sendEmail(data?.email, data?.object, messageFinalMETEXT, messageFinalMEHTML, true);

        return resultSendEmailME;
    }
}