import "reflect-metadata";
import { ContactResolver } from "../../../src/resolvers/contact.resolver";
import { MyContext } from "../../../src";
import { ContactFrom } from "../../../src/types/contact.types";
import { MessageType } from "../../../src/types/message.types";

import * as MailService from "../../../src/mail/mail.service";
import * as StructureMailService from "../../../src/mail/structureMail.service";
import * as RegexModule from "../../../src/regex";

jest.mock("../../../src/mail/mail.service");
jest.mock("../../../src/mail/structureMail.service");
jest.mock("../../../src/regex");

describe("ContactResolver - sendContact", () => {
  let resolver: ContactResolver;

  let mockSendEmail: jest.Mock<Promise<MessageType>, [string, string, string, string, boolean]>;
  let mockStructureMessageMeTEXT: jest.Mock<Promise<string>, [ContactFrom]>;
  let mockStructureMessageMeHTML: jest.Mock<Promise<string>, [ContactFrom]>;
  let mockCheckRegex: jest.Mock<boolean, [RegExp, string]>;

  const context: MyContext = {} as MyContext;

  const mockContactData: ContactFrom = {
    email: "john.doe@example.com",
    object: "Inquiry about services",
    message: "I would like to know more about your offerings.",
  };

  const mockTextEmailBody: string = "Structured text message";
  const mockHtmlEmailBody: string = "Structured HTML message";

  beforeEach((): void => {
    mockSendEmail = MailService.sendEmail as unknown as typeof mockSendEmail;
    mockStructureMessageMeTEXT =
      StructureMailService.structureMessageMeTEXT as unknown as typeof mockStructureMessageMeTEXT;
    mockStructureMessageMeHTML =
      StructureMailService.structureMessageMeHTML as unknown as typeof mockStructureMessageMeHTML;
    mockCheckRegex = RegexModule.checkRegex as unknown as typeof mockCheckRegex;

    mockSendEmail.mockClear();
    mockStructureMessageMeTEXT.mockClear();
    mockStructureMessageMeHTML.mockClear();
    mockCheckRegex.mockClear();

    resolver = new ContactResolver();

    mockCheckRegex.mockReturnValue(true);
    mockStructureMessageMeTEXT.mockResolvedValue(mockTextEmailBody);
    mockStructureMessageMeHTML.mockResolvedValue(mockHtmlEmailBody);
  });

  it("should successfully send an email when data is valid", async (): Promise<void> => {
    const mockSendEmailSuccess: MessageType = {
      message: "Email sent successfully",
      label: "Success",
      status: true,
    };

    mockSendEmail.mockResolvedValue(mockSendEmailSuccess);

    const result: MessageType = await resolver.sendContact(
      mockContactData,
      context
    );

    expect(result).toEqual(mockSendEmailSuccess);
    expect(mockCheckRegex).toHaveBeenCalledWith(
      RegexModule.emailRegex,
      mockContactData.email
    );
    expect(mockStructureMessageMeTEXT).toHaveBeenCalledWith(mockContactData);
    expect(mockStructureMessageMeHTML).toHaveBeenCalledWith(mockContactData);
    expect(mockSendEmail).toHaveBeenCalledWith(
      mockContactData.email,
      mockContactData.object,
      mockTextEmailBody,
      mockHtmlEmailBody,
      true
    );
  });

  it("should throw an error for an invalid email format", async (): Promise<void> => {
    mockCheckRegex.mockReturnValue(false);

    await expect(
      resolver.sendContact(mockContactData, context)
    ).rejects.toThrow("Invaid format email.");

    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should return failure message if sendEmail fails", async (): Promise<void> => {
    const mockSendEmailFailure: MessageType = {
      message: "Failed to send email due to service error",
      label: "Error",
      status: false,
    };

    mockSendEmail.mockResolvedValue(mockSendEmailFailure);

    const result: MessageType = await resolver.sendContact(
      mockContactData,
      context
    );

    expect(result).toEqual(mockSendEmailFailure);
  });

  it("should throw if TEXT message structuring fails", async (): Promise<void> => {
    const errorMessage : string = "Error structuring text message";

    mockStructureMessageMeTEXT.mockRejectedValue(new Error(errorMessage));

    await expect(
      resolver.sendContact(mockContactData, context)
    ).rejects.toThrow(errorMessage);
  });

  it("should throw if HTML message structuring fails", async (): Promise<void> => {
    const errorMessage : string = "Error structuring HTML message";

    mockStructureMessageMeHTML.mockRejectedValue(new Error(errorMessage));

    await expect(
      resolver.sendContact(mockContactData, context)
    ).rejects.toThrow(errorMessage);
  });
});