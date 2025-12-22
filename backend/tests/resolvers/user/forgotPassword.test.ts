import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { ForgotPasswordInput } from "../../../src/entities/inputs/user.input";
import { prismaMock } from "../../singleton";
import * as mailService from "../../../src/mail/mail.service";
import * as passwordUtils from "../../../src/lib/generateSecurePassword";
import * as argon2 from "argon2";
import { Response } from "../../../src/types/response.types";
import { User, UserRole } from "../../../src/entities/user.entity";

jest.mock("../../../src/mail/mail.service");
jest.mock("../../../src/lib/generateSecurePassword");
jest.mock("argon2");

describe("UserResolver - forgotPassword", () => {
  let resolver: UserResolver;

  const mockUser = {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "hashed_password",
    role: UserRole.admin,
    isPasswordChange: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.update.mockReset();

    resolver = new UserResolver(prismaMock);

    (passwordUtils.generateSecurePassword as jest.Mock).mockReturnValue("NewSecure123!");
    (argon2.hash as jest.Mock).mockResolvedValue("new_hashed_password");
    (mailService.sendEmail as jest.Mock).mockResolvedValue(undefined);
  });

  it("should send password reset email in French when lang is 'fr'", async () => {
    const input: ForgotPasswordInput = {
      email: mockUser.email,
      lang: "fr",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
    prismaMock.user.update.mockResolvedValueOnce({
      ...mockUser,
      password: "new_hashed_password",
    });

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: input.email },
    });

    expect(passwordUtils.generateSecurePassword).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledWith("NewSecure123!");

    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: input.email },
      data: {
        password: "new_hashed_password",
        isPasswordChange: false,
      },
    });

    expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mailService.sendEmail).toHaveBeenCalledWith(
      input.email,
      "Réinitialisation de votre mot de passe",
      expect.any(String),
      expect.any(String)
    );
  });

  it("should send password reset email in English when lang is 'en'", async () => {
    const input: ForgotPasswordInput = {
      email: mockUser.email,
      lang: "en",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
    prismaMock.user.update.mockResolvedValueOnce({
      ...mockUser,
      password: "new_hashed_password",
    });

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mailService.sendEmail).toHaveBeenCalledWith(
      input.email,
      "Password Reset",
      expect.any(String),
      expect.any(String)
    );
  });

  it("should return 200 even if user does not exist (security measure)", async () => {
    const input: ForgotPasswordInput = {
      email: "nonexistent@example.com",
      lang: "fr",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
    expect(mailService.sendEmail).not.toHaveBeenCalled();
  });

  it("should return 200 even if password hashing fails (security measure)", async () => {
    const input: ForgotPasswordInput = {
      email: mockUser.email,
      lang: "fr",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
    (argon2.hash as jest.Mock).mockRejectedValueOnce(new Error("Hash error"));

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
    expect(mailService.sendEmail).not.toHaveBeenCalled();
  });

  it("should return 200 even if database update fails (security measure)", async () => {
    const input: ForgotPasswordInput = {
      email: mockUser.email,
      lang: "fr",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
    prismaMock.user.update.mockRejectedValueOnce(new Error("DB update error"));

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(mailService.sendEmail).not.toHaveBeenCalled();
  });

  it("should return 200 even if email sending fails (security measure)", async () => {
    const input: ForgotPasswordInput = {
      email: mockUser.email,
      lang: "fr",
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(mockUser);
    prismaMock.user.update.mockResolvedValueOnce({
      ...mockUser,
      password: "new_hashed_password",
    });
    (mailService.sendEmail as jest.Mock).mockRejectedValueOnce(new Error("Email send error"));

    const result: Response = await resolver.forgotPassword(input);

    expect(result.code).toBe(200);
    expect(result.message).toBe("If an account exists with this email, a new password has been sent.");

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
  });
});
