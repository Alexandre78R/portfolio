import { Resolver, Query, Mutation, Arg, Authorized, Ctx, Int } from "type-graphql";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { User } from "../entities/user.entity";
import { UsersResponse, UserResponse, LoginResponse, Response } from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { generateSecurePassword } from "../lib/generateSecurePassword";
import { sendEmail } from "../mail/mail.service";
import { CreateUserInput, LoginInput, ForgotPasswordInput } from "../entities/inputs/user.input";
import argon2 from "argon2";
import { structureMessageCreatedAccountHTML, structureMessageCreatedAccountTEXT, structureMessageForgotPasswordHTML, structureMessageForgotPasswordTEXT } from "../mail/structureMail.service";
import { emailRegex, passwordRegex, checkRegex } from "../regex";
import { jwtVerify, SignJWT, JWTVerifyResult } from "jose";
import { TextEncoder } from "util";
import { MyContext } from "..";

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

const secret: Uint8Array = new TextEncoder().encode(process.env.JWT_SECRET);

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly db: PrismaClient = new PrismaClient()) {}

  @Authorized([UserRole.admin])
  @Query(() => UsersResponse)
  async userList(@Ctx() ctx: MyContext): Promise<UsersResponse> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required.", users: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", users: undefined };

      const listUserFromPrisma: PrismaUser[] = await this.db.user.findMany();

      const users: User[] = listUserFromPrisma.map((u) => ({
        id: u.id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: u.role as UserRole,
        isPasswordChange: u.isPasswordChange,
      }));

      return { code: 200, message: "Users fetched", users };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: "Error fetching users", users: undefined };
    }
  }

  @Authorized([UserRole.admin])
  @Query(() => UserResponse)
  async userById(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<UserResponse> {
    try {

      const user: PrismaUser | null = await this.db.user.findFirst({
        where: {
          id,
        },
      });

      if (!user) {
        return {
          code: 404,
          message: "User not found",
          user: undefined,
        };
      }

      return {
        code: 200,
        message: "User found",
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role as UserRole,
          isPasswordChange: user.isPasswordChange,
        },
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
        user: undefined,
      };
    }
  }

  @Mutation(() => UserResponse)
  async registerUser(@Arg("data") data: CreateUserInput): Promise<UserResponse> {
    try {
      const existing: PrismaUser | null = await this.db.user.findUnique({ where: { email: data.email } });
      if (existing) return { code: 409, message: "Email already exists", user: undefined };

      if (!checkRegex(emailRegex, data.email)) {
        return { code: 400, message: "You have entered an invalid email address.", user: undefined };
      }

      const plainPassword : string = generateSecurePassword();
      const hashedPassword : string = await argon2.hash(plainPassword);

      const createdUser: PrismaUser = await this.db.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
          role: data.role as UserRole,
          isPasswordChange: false,
        },
      });

      const subject : string = data.lang === "en" ? "Your account has been created" : "Votre compte a été créé";
      const messageFinalCreatedAccountTEXT: string = await structureMessageCreatedAccountTEXT(data.firstname, plainPassword, data.lang);
      const messageFinalCreatedAccountHTML: string = await structureMessageCreatedAccountHTML(data.firstname, plainPassword, data.lang);

      await sendEmail(data.email, subject, messageFinalCreatedAccountTEXT, messageFinalCreatedAccountHTML);

      return {
        code: 201,
        message: "User registered and email sent",
        user: {
          ...createdUser,
          role: createdUser.role as UserRole,
        },
      };
    } catch (error: unknown) {
      console.error(error);
      return { code: 500, message: error instanceof Error ? error.message : "Unexpected error", user: undefined };
    }
  }

  @Mutation(() => Response)
  async changePassword(@Arg("email") email: string, @Arg("newPassword") newPassword: string): Promise<Response> {
    if (!checkRegex(passwordRegex, newPassword)) {
      return {
        code: 400,
        message: "The password must contain at least 9 characters, with at least one uppercase letter, one lowercase letter, one number and one symbol.",
      };
    }

    try {
      const user: PrismaUser | null = await this.db.user.findUnique({ where: { email } });
      if (!user) return { code: 404, message: "User not found with this email." };

      const hashedPassword: string = await argon2.hash(newPassword);

      await this.db.user.update({
        where: { email },
        data: { password: hashedPassword, isPasswordChange: true },
      });

      return { code: 200, message: "Password updated successfully." };
    } catch (error: unknown) {
      console.error("Erreur dans changePassword:", error);
      return { code: 500, message: "Server error while updating password." };
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("data") { email, password }: LoginInput, @Ctx() ctx: MyContext): Promise<LoginResponse> {
    try {
      const user: PrismaUser | null = await this.db.user.findUnique({ where: { email } });
      if (!user) return { code: 401, message: "Invalid credentials (email or password incorrect).", token: undefined };

      const isPasswordValid: boolean = await argon2.verify(user.password, password);
      if (!isPasswordValid) return { code: 401, message: "Invalid credentials (email or password incorrect).", token: undefined };

      const tokenPayload = { id: user.id, email: user.email, role: user.role };
      if (!process.env.JWT_SECRET) return { code: 500, message: "Please check your JWT configuration !", token: undefined };

      const token: string = await new SignJWT(tokenPayload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret);

      ctx.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/",
      });

      return { code: 200, message: "Login successful.", token };
    } catch (error: unknown) {
      console.error("Erreur dans login:", error);
      return { code: 500, message: error instanceof Error ? error.message : "Unexpected server error during login.", token: undefined };
    }
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    const { token } = ctx;
    if (!token) return null;

    try {
      const verified = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      const payload = verified.payload as unknown as JwtPayload;

      const user: PrismaUser | null = await this.db.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) return null;

      return {
        ...user,
        role: user.role as UserRole,
      };
    } catch (error: unknown) {
      console.error("JWT verification failed:", error);
      return null;
    }
  }

  @Mutation(() => Response)
  async logout(@Ctx() ctx: MyContext): Promise<Response> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required." };

      ctx.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: new Date(0),
        path: "/",
      });

      ctx.user = null;
      return { code: 200, message: "Logged out successfully." };
    } catch (error: unknown) {
      console.error("Erreur lors de la déconnexion:", error);
      return { code: 500, message: "An error occurred during logout." };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteUser(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Response> {
    try {
      if (!ctx.user) return { code: 401, message: "Authentication required." };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required." };

      const user: PrismaUser | null = await this.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        return {
          code: 404,
          message: "User not found",
        };
      }

      if (user.id === ctx.user.id) {
        return {
          code: 400,
          message: "You cannot delete your own account.",
        };
      }

      await this.db.user.delete({
        where: { id },
      });

      return {
        code: 200,
        message: "User deleted successfully.",
      };
    } catch (error: unknown) {
      console.error("Error in deleteUser:", error);
      return {
        code: 500,
        message: "Internal server error while deleting user.",
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => UserResponse)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("firstname", { nullable: true }) firstname?: string,
    @Arg("lastname", { nullable: true }) lastname?: string,
    @Arg("email", { nullable: true }) email?: string,
    @Arg("role", { nullable: true }) role?: UserRole,
    @Ctx() ctx?: MyContext
  ): Promise<UserResponse> {
    try {
      if (!ctx?.user) return { code: 401, message: "Authentication required.", user: undefined };
      if (ctx.user.role !== UserRole.admin) return { code: 403, message: "Access denied. Admin role required.", user: undefined };

      const user: PrismaUser | null = await this.db.user.findUnique({
        where: { id },
      });

      if (!user) {
        return {
          code: 404,
          message: "User not found",
          user: undefined,
        };
      }

      if (email && email !== user.email) {
        if (!checkRegex(emailRegex, email)) {
          return { code: 400, message: "You have entered an invalid email address.", user: undefined };
        }

        const existingEmail: PrismaUser | null = await this.db.user.findUnique({
          where: { email },
        });

        if (existingEmail) {
          return {
            code: 409,
            message: "Email already exists",
            user: undefined,
          };
        }
      }
      
      const updateData: Partial<{
        firstname: string | undefined;
        lastname: string | undefined;
        email: string | undefined;
        role: UserRole | undefined;
      }> = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (email !== undefined) updateData.email = email;
      if (role !== undefined) updateData.role = role;

      const updatedUser: PrismaUser = await this.db.user.update({
        where: { id },
        data: updateData,
      });

      return {
        code: 200,
        message: "User updated successfully.",
        user: {
          id: updatedUser.id,
          firstname: updatedUser.firstname,
          lastname: updatedUser.lastname,
          email: updatedUser.email,
          role: updatedUser.role as UserRole,
          isPasswordChange: updatedUser.isPasswordChange,
        },
      };
    } catch (error: unknown) {
      console.error("Error in updateUser:", error);
      return {
        code: 500,
        message: "Internal server error while updating user.",
        user: undefined,
      };
    }
  }

  @Mutation(() => Response)
  async forgotPassword(@Arg("data") { email, lang }: ForgotPasswordInput): Promise<Response> {
    try {
      const user: PrismaUser | null = await this.db.user.findUnique({ where: { email } });
      
      // Si l'email n'existe pas, on retourne le même message que s'il existait pour des raisons de sécurité
      // (éviter l'énumération d'utilisateurs)
      if (!user) return { code: 200, message: "If an account exists with this email, a new password has been sent." };

      const newPassword: string = generateSecurePassword();
      const hashedPassword: string = await argon2.hash(newPassword);

      await this.db.user.update({
        where: { email },
        data: { 
          password: hashedPassword,
          isPasswordChange: false
        },
      });

      const subject: string = lang === "en" ? "Password Reset" : "Réinitialisation de votre mot de passe";
      const messageFinalForgotPasswordTEXT: string = structureMessageForgotPasswordTEXT(user.firstname, newPassword, lang);
      const messageFinalForgotPasswordHTML: string = structureMessageForgotPasswordHTML(user.firstname, newPassword, lang);

      await sendEmail(email, subject, messageFinalForgotPasswordTEXT, messageFinalForgotPasswordHTML);

      return { code: 200, message: "If an account exists with this email, a new password has been sent." };
    } catch (error: unknown) {
      console.error("Error in forgotPassword:", error);
      return { code: 200, message: "If an account exists with this email, a new password has been sent." };
    }
  }
}