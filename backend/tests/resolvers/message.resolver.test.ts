import "reflect-metadata";
import { MessageResolver } from "../../src/resolvers/message.resolver";
import { sendEmail } from "../../src/mail/mail.service";
import { MessageResponse } from "../../src/types/response.types";
import { UserRole } from "../../src/entities/user.entity";
import { MyContext } from "../../src/index";
import { User } from "../../src/entities/user.entity";
import { Request } from "express";

/**
 * Mock types and interfaces for sendEmail
 */
interface SendEmailResult {
  readonly status: boolean;
}

/**
 * Mock sendEmail module
 */
jest.mock("../../src/mail/mail.service", () => ({
  sendEmail: jest.fn<Promise<SendEmailResult>, [string, string, string, string, boolean]>(),
}));

describe("MessageResolver", (): void => {
  let resolver: MessageResolver;
  let mockSendEmail: jest.Mock<Promise<SendEmailResult>, [string, string, string, string, boolean]>;
  const consoleSpy: jest.SpyInstance = jest.spyOn(console, "log").mockImplementation();
  const consoleErrorSpy: jest.SpyInstance = jest.spyOn(console, "error").mockImplementation();

  /**
   * Helper to create mock Express.Request
   */
  const createMockRequest = (): unknown => ({
    headers: {},
    method: "POST",
    url: "/graphql",
  });

  beforeEach((): void => {
    jest.clearAllMocks();
    resolver = new MessageResolver();
    mockSendEmail = sendEmail as unknown as jest.Mock<Promise<SendEmailResult>, [string, string, string, string, boolean]>;
  });

  afterAll((): void => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("sendMessage", (): void => {
    it("should return 401 when user is not authenticated", async (): Promise<void> => {
      const ctx: MyContext = { 
        user: null, 
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "test@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(401);
      expect(result.message).toBe("Authentication required.");
    });

    it("should return 403 when user is not admin", async (): Promise<void> => {
      const user: User = {
        id: 1,
        firstname: "User",
        lastname: "Name",
        email: "user@example.com",
        role: UserRole.view,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "test@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(403);
      expect(result.message).toBe("Only admins can send messages.");
    });

    it("should return 400 when no valid recipients are provided", async (): Promise<void> => {
      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "   ,  ,  ";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(400);
      expect(result.message).toBe("No valid recipients provided.");
    });

    it("should successfully send emails to all recipients", async (): Promise<void> => {
      mockSendEmail.mockResolvedValue({ status: true });

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "user1@example.com, user2@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(200);
      expect(result.message).toContain("✅ Email sent to 2/2 recipients");
      expect(mockSendEmail).toHaveBeenCalledTimes(3); // 2 recipients + 1 admin copy
    });

    it("should handle partial email failures", async (): Promise<void> => {
      const mockResults: SendEmailResult[] = [{ status: true }, { status: false }];
      mockSendEmail.mockImplementation(async (): Promise<SendEmailResult> => {
        const result: SendEmailResult | undefined = mockResults.shift();
        return result || { status: false };
      });

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "user1@example.com, user2@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(200);
      expect(result.message).toContain("✅ Email sent to 1/2 recipients");
      expect(result.message).toContain("Failed: user2@example.com");
    });

    it("should return 500 when all emails fail to send", async (): Promise<void> => {
      mockSendEmail.mockResolvedValue({ status: false });

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "user1@example.com, user2@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(500);
      expect(result.message).toContain("✅ Email sent to 0/2 recipients");
    });

    it("should handle email service errors gracefully", async (): Promise<void> => {
      const error: Error = new Error("SMTP connection failed");
      mockSendEmail.mockRejectedValue(error);

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "user1@example.com";

      const result: MessageResponse = await resolver.sendMessage(subject, content, recipients, ctx);

      expect(result.code).toBe(500);
      expect(result.message).toContain("Failed to send email: SMTP connection failed");
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should trim whitespace from recipient emails", async (): Promise<void> => {
      mockSendEmail.mockResolvedValue({ status: true });

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "  user1@example.com  ,  user2@example.com  ";

      await resolver.sendMessage(subject, content, recipients, ctx);

      const callArgs: readonly unknown[] = mockSendEmail.mock.calls[0];
      expect(callArgs[0]).toBe("user1@example.com");
      expect(callArgs[1]).toBe(subject);
      expect(callArgs[3]).toBe(content);
    });

    it("should send copy to admin with COPIE prefix", async (): Promise<void> => {
      mockSendEmail.mockResolvedValue({ status: true });

      const user: User = {
        id: 1,
        firstname: "Admin",
        lastname: "Name",
        email: "admin@example.com",
        role: UserRole.admin,
        isPasswordChange: false,
      };
      const ctx: MyContext = {
        user,
        req: createMockRequest() as Request,
        res: {} as never,
        cookies: {} as never,
      };
      const subject: string = "Test Subject";
      const content: string = "<p>Test content</p>";
      const recipients: string = "user1@example.com";

      await resolver.sendMessage(subject, content, recipients, ctx);

      const lastCall: readonly unknown[] = mockSendEmail.mock.calls[mockSendEmail.mock.calls.length - 1];
      expect(lastCall[1]).toBe(`[COPIE] ${subject}`);
      expect(lastCall[4]).toBe(true); // sendToMe flag
    });
  });
});
