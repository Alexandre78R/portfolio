import { Resolver, Mutation, Arg, Authorized, Ctx } from "type-graphql";
import { Message } from "../entities/message.entity";
import { MessageResponse } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";
import { sendEmail } from "../mail/mail.service";

@Resolver(() => Message)
export class MessageResolver {
  @Authorized([UserRole.admin])
  @Mutation(() => MessageResponse)
  async sendMessage(
    @Arg("subject") subject: string,
    @Arg("content") content: string,
    @Arg("recipients") recipients: string,
    @Ctx() ctx: MyContext
  ): Promise<MessageResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required.",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Only admins can send messages.",
        };
      }

      const recipientList: string[] = recipients
        .split(",")
        .map((email: string) => email.trim())
        .filter((email: string) => email.length > 0);

      if (recipientList.length === 0) {
        return {
          code: 400,
          message: "No valid recipients provided.",
        };
      }

      const htmlContent: string = content;

      let successCount: number = 0;
      const failedEmails: string[] = [];

      for (const email of recipientList as string[]) {
        const result: { status: boolean } = await sendEmail(
          email,
          subject,
          "",
          htmlContent,
          false
        );

        if (result.status as boolean) {
          successCount++ as number;
        } else {
          failedEmails.push(email);
        }
      }

      const adminResult: { status: boolean } = await sendEmail(
        ctx.user.email || "admin@example.com",
        `[COPIE] ${subject}`,
        "",
        htmlContent,
        true
      );

      let message: string = `✅ Email sent to ${successCount}/${recipientList.length} recipients`;
      if (adminResult.status) {
        message += " + copy to admin";
      }
      if (failedEmails.length > 0) {
        message += `. Failed: ${failedEmails.join(", ")}`;
      }

      console.log(`✅ Email campaign completed: ${message}`);

      return {
        code: successCount > 0 ? 200 : 500,
        message,
      };
    } catch (error: unknown) {
      const errorMessage: string =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("❌ Error sending email:", errorMessage);
      return {
        code: 500,
        message: `Failed to send email: ${errorMessage}`,
      };
    }
  }
}
