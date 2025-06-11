import "reflect-metadata";
import { ContactResolver } from "../../../src/resolvers/contact.resolver";
import { MyContext } from "../../../src";
import { ContactFrom } from "../../../src/types/contact.types";
import { MessageType } from "../../../src/types/message.types";

// Import modules to mock
import * as MailService from "../../../src/mail/mail.service";
import * as StructureMailService from "../../../src/mail/structureMail.service";
import * as RegexModule from "../../../src/regex";


jest.mock("../../../src/mail/mail.service");
jest.mock("../../../src/mail/structureMail.service");
jest.mock("../../../src/regex");

describe("ContactResolver - sendContact", () => {
  let resolver: ContactResolver;
  let mockSendEmail: jest.Mock;
  let mockStructureMessageMeTEXT: jest.Mock;
  let mockStructureMessageMeHTML: jest.Mock;
  let mockCheckRegex: jest.Mock;

  const context: MyContext = {} as MyContext;

  const mockContactData: ContactFrom = {
    email: "john.doe@example.com",
    object: "Inquiry about services",
    message: "I would like to know more about your offerings.",
  };

  const mockTextEmailBody = "Structured text message";
  const mockHtmlEmailBody = "Structured HTML message";

  beforeEach(() => {
    mockSendEmail = MailService.sendEmail as jest.Mock;
    mockStructureMessageMeTEXT = StructureMailService.structureMessageMeTEXT as jest.Mock;
    mockStructureMessageMeHTML = StructureMailService.structureMessageMeHTML as jest.Mock;
    mockCheckRegex = RegexModule.checkRegex as jest.Mock;

    mockSendEmail.mockClear();
    mockStructureMessageMeTEXT.mockClear();
    mockStructureMessageMeHTML.mockClear();
    mockCheckRegex.mockClear();

    resolver = new ContactResolver();

    mockCheckRegex.mockReturnValue(true);
    mockStructureMessageMeTEXT.mockResolvedValue(mockTextEmailBody);
    mockStructureMessageMeHTML.mockResolvedValue(mockHtmlEmailBody);
  });

  it("should successfully send an email when data is valid", async () => {
    const mockSendEmailSuccess: MessageType = {
      message: "Email sent successfully",
      label: "Success",
      status: true,
    };
    mockSendEmail.mockResolvedValue(mockSendEmailSuccess);

    const result: MessageType = await resolver.sendContact(mockContactData, context);

    expect(result.message).toBe("Email sent successfully");
    expect(result.label).toBe("Success");
    expect(result.status).toBe(true);

    expect(mockCheckRegex).toHaveBeenCalledTimes(1);
    expect(mockCheckRegex).toHaveBeenCalledWith(RegexModule.emailRegex, mockContactData.email);

    expect(mockStructureMessageMeTEXT).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeTEXT).toHaveBeenCalledWith(mockContactData);
    expect(mockStructureMessageMeHTML).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeHTML).toHaveBeenCalledWith(mockContactData);

    expect(mockSendEmail).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledWith(
      mockContactData.email,
      mockContactData.object,
      mockTextEmailBody,
      mockHtmlEmailBody,
      true
    );
  });

  it("should throw an error for an invalid email format", async () => {
    mockCheckRegex.mockReturnValue(false); // Simulate invalid email

    await expect(resolver.sendContact(mockContactData, context)).rejects.toThrow(
      "Invaid format email."
    );

    expect(mockCheckRegex).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(mockStructureMessageMeTEXT).not.toHaveBeenCalled();
    expect(mockStructureMessageMeHTML).not.toHaveBeenCalled();
  });

  it("should return failure message if sendEmail service fails", async () => {
    const mockSendEmailFailure: MessageType = {
      message: "Failed to send email due to service error",
      label: "Error",
      status: false,
    };
    mockSendEmail.mockResolvedValue(mockSendEmailFailure);

    const result: MessageType = await resolver.sendContact(mockContactData, context);

    expect(result.message).toBe("Failed to send email due to service error");
    expect(result.label).toBe("Error");
    expect(result.status).toBe(false);

    expect(mockCheckRegex).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeTEXT).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeHTML).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("should handle error during message structuring (TEXT)", async () => {
    const errorMessage = "Error structuring text message";
    mockStructureMessageMeTEXT.mockRejectedValue(new Error(errorMessage));

    await expect(resolver.sendContact(mockContactData, context)).rejects.toThrow(
      errorMessage
    );

    expect(mockCheckRegex).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeTEXT).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeHTML).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("should handle error during message structuring (HTML)", async () => {
    const errorMessage = "Error structuring HTML message";
    mockStructureMessageMeHTML.mockRejectedValue(new Error(errorMessage));

    await expect(resolver.sendContact(mockContactData, context)).rejects.toThrow(
      errorMessage
    );

    expect(mockCheckRegex).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeTEXT).toHaveBeenCalledTimes(1);
    expect(mockStructureMessageMeHTML).toHaveBeenCalledTimes(1);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});