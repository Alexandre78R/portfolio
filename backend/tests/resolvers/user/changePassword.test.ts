import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { prismaMock } from "../../singleton";
import * as argon2 from "argon2";
import * as regexUtils from "../../../src/regex";
import { UserRole } from "../../../src/entities/user.entity";
import { UserResponse } from "../../../src/types/response.types";

jest.mock("argon2");
jest.mock("../../../src/regex", () => ({
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{9,})/,
  checkRegex: jest.fn(),
}));

describe("UserResolver - changePassword", () => {
  let resolver: UserResolver;

  interface MockUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    isPasswordChange: boolean;
  }

  const mockExistingUser: MockUser = {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "old_hashed_password",
    role: UserRole.admin,
    isPasswordChange: false,
  };

  const newValidPassword = "NewValidPassword123!";
  const newInvalidPassword = "short";

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock.user.findUnique.mockReset();
    prismaMock.user.update.mockReset();

    resolver = new UserResolver(prismaMock);

    (regexUtils.checkRegex as jest.Mock).mockReturnValue(true);
    (argon2.hash as jest.Mock).mockResolvedValue("new_hashed_password");
  });

  it("should successfully change the user's password", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    prismaMock.user.update.mockResolvedValueOnce({
      ...mockExistingUser,
      isPasswordChange: true,
    });

    const result: UserResponse = await resolver.changePassword(
      mockExistingUser.email,
      newValidPassword
    );

    expect(result.code as number).toBe(200);
    expect(result.message as string).toBe("Password updated successfully.");
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(regexUtils.checkRegex).toHaveBeenCalledWith(regexUtils.passwordRegex, newValidPassword);

    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockExistingUser.email },
    });

    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledWith(newValidPassword);

    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { email: mockExistingUser.email },
      data: {
        password: "new_hashed_password",
        isPasswordChange: true,
      },
    });
  });

  it("should return 400 if the new password format is invalid", async () => {
    (regexUtils.checkRegex as jest.Mock).mockReturnValue(false);

    const result: UserResponse = await resolver.changePassword(
      mockExistingUser.email,
      newInvalidPassword
    );

    expect(result.code as number).toBe(400);
    expect(result.message as string).toBe(
      "The password must contain at least 9 characters, with at least one uppercase letter, one lowercase letter, one number and one symbol."
    );
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
    expect(argon2.hash).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 404 if the user is not found", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const result: UserResponse = await resolver.changePassword(
      "nonexistent@example.com",
      newValidPassword
    );

    expect(result.code as number).toBe(404);
    expect(result.message as string).toBe("User not found with this email.");
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });

    expect(argon2.hash).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 500 for unexpected server error during user lookup", async () => {
    prismaMock.user.findUnique.mockRejectedValueOnce(new Error("DB findUnique error"));

    const result: UserResponse = await resolver.changePassword(
      mockExistingUser.email,
      newValidPassword
    );

    expect(result.code as number).toBe(500);
    expect(result.message as string).toBe("Server error while updating password.");
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).not.toHaveBeenCalled();
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 500 for unexpected server error during password hashing", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    (argon2.hash as jest.Mock).mockRejectedValueOnce(new Error("Hash error"));

    const result: UserResponse = await resolver.changePassword(
      mockExistingUser.email,
      newValidPassword
    );

    expect(result.code as number).toBe(500);
    expect(result.message as string).toBe("Server error while updating password.");
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).not.toHaveBeenCalled();
  });

  it("should return 500 for unexpected server error during database update", async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce(mockExistingUser);
    prismaMock.user.update.mockRejectedValueOnce(new Error("DB update error"));

    const result: UserResponse = await resolver.changePassword(
      mockExistingUser.email,
      newValidPassword
    );

    expect(result.code as number).toBe(500);
    expect(result.message as string).toBe("Server error while updating password.");
    expect(result.user).toBeUndefined();

    expect(regexUtils.checkRegex).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
  });
});