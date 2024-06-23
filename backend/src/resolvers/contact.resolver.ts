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

    @Mutation(() => Boolean)
    async sendEmailTest(): Promise<Boolean> {
        await sendEmail("contact@alexandre-renard.dev", "subject", "text")
        return true;
    }
}