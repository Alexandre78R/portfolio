import "reflect-metadata";
import { UserResolver } from "../../../src/resolvers/user.resolver";
import { CreateUserInput } from "../../../src/entities/inputs/user.input";
import { User, UserRole } from "../../../src/entities/user.entity";
import { prismaMock } from "../../singleton";
import * as mailService from "../../../src/mail/mail.service";
import * as passwordUtils from "../../../src/lib/generateSecurePassword";
import { emailRegex, checkRegex } from "../../../src/regex";
import * as argon2 from "argon2";

jest.mock("../../../src/mail/mail.service");
jest.mock("../../../src/lib/generateSecurePassword");
jest.mock("../../../src/regex", () => ({
  checkRegex: jest.fn(),
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}));
jest.mock("argon2");

describe("UserResolver - registerUser", () => {
  let resolver: UserResolver;

  beforeEach(() => {
    jest.clearAllMocks();

    prismaMock.user.findUnique.mockReset();
    prismaMock.user.create.mockReset();

    resolver = new UserResolver(prismaMock);

    (passwordUtils.generateSecurePassword as jest.Mock).mockReturnValue("Secure123!");
    (argon2.hash as jest.Mock).mockResolvedValue("hashed-password");
    (mailService.sendEmail as jest.Mock).mockResolvedValue(undefined);
    (checkRegex as jest.Mock).mockReturnValue(true);
  });

  it("should return error if email already exists", async () => {
    const input: CreateUserInput = {
      firstname: "Alex",
      lastname: "Renard",
      email: "alex@example.com",
      role: UserRole.admin,
    };

    const existingUser: User & { password: string; pseudo: string | null; ban: boolean } = {
      id: 1,
      firstname: "Alex",
      lastname: "Renard",
      email: "alex@example.com",
      role: UserRole.admin,
      isPasswordChange: false,
      password: "some-hashed-password",
      pseudo: null,
      ban: false,
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(existingUser);

    const result = await resolver.registerUser(input);

    expect(result.code).toBe(409);
    expect(result.message).toBe("Email already exists");
  });

  it("should create a new user and send email", async () => {
    const input: CreateUserInput = {
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean.dupont@example.com",
      role: UserRole.admin,
    };

    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const createdUser: User & { password: string; pseudo: string | null; ban: boolean } = {
      id: 1,
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      role: input.role,
      isPasswordChange: false,
      password: "hashed-password",
      pseudo: null,
      ban: false,
    };

    prismaMock.user.create.mockResolvedValueOnce(createdUser);

    const result = await resolver.registerUser(input);

    expect(result.code).toBe(201);
    expect(result.message).toBe("User registered and email sent");
    expect(result.user?.email).toBe(input.email);

    expect(mailService.sendEmail).toHaveBeenCalledTimes(1);
    expect(mailService.sendEmail).toHaveBeenCalledWith(
      input.email,
      "Votre compte a été créé",
      expect.any(String),
      expect.any(String)
    );

    expect(passwordUtils.generateSecurePassword).toHaveBeenCalledTimes(1);
    expect(argon2.hash).toHaveBeenCalledWith("Secure123!");

    expect(prismaMock.user.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.create).toHaveBeenCalledWith({
      data: {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        password: "hashed-password",
        role: input.role,
        isPasswordChange: false,
      },
    });
  });
});