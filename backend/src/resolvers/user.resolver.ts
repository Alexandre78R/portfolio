import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user.entity";
import { UsersResponse, UserResponse, LoginResponse } from "../entities/response.types";
import { UserRole } from "../entities/user.entity";
import { generateSecurePassword } from "../lib/generateSecurePassword";
import { sendEmail } from "../mail/mail.service";
import { CreateUserInput, LoginInput } from "../entities/inputs/user.input";
import argon2 from "argon2";
import { structureMessageCreatedAccountHTML, structureMessageCreatedAccountTEXT } from "../mail/structureMail.service";
import { Response } from "../entities/response.types";
import { emailRegex, passwordRegex, checkRegex } from "../regex";
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { MyContext } from "..";

const prisma = new PrismaClient();

@Resolver(() => User)
export class UserResolver {
  @Query(() => UsersResponse)
  async userList(): Promise<UsersResponse> {
    try {
      const listUserFromPrisma = await prisma.user.findMany();

      const users: User[] = listUserFromPrisma.map((u) => ({
        id: u.id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: u.role as UserRole,
        isPasswordChange: u.isPasswordChange,
      }));

      return { code: 200, message: "Users fetched", users };
    } catch (error) {
      console.error(error);
      return { code: 500, message: "Error fetching users" };
    }
  }

  @Mutation(() => UserResponse)
  async registerUser(@Arg("data") data: CreateUserInput): Promise<UserResponse> {
    try {
      const existing = await prisma.user.findUnique({ where: { email: data.email } });
      if (existing) return { code: 409, message: "Email already exists" };

      if (!checkRegex(emailRegex, data.email)) {
      return {
        code: 400,
        message:
          "You have entered an invalid email address.",
      };
    }

      const plainPassword = generateSecurePassword();
      const hashedPassword = await argon2.hash(plainPassword);

      const createdUser = await prisma.user.create({
        data: {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: hashedPassword,
          role: data.role as UserRole,
          isPasswordChange: false,
        },
      });

      const subject = "Votre compte a été créé";

      const messageFinalCreatedAccountTEXT = await structureMessageCreatedAccountTEXT(data.firstname, plainPassword);
      const messageFinalCreatedAccountHTML = await structureMessageCreatedAccountHTML(data.firstname, plainPassword);
      await sendEmail(data.email, subject, messageFinalCreatedAccountTEXT, messageFinalCreatedAccountHTML);

      return {
        code: 201,
        message: "User registered and email sent",
        user: {
          ...createdUser,
          role: createdUser.role as UserRole,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unexpected error",
      };
    }
  }

  @Mutation(() => Response)
  async changePassword(
    @Arg("email") email: string,
    @Arg("newPassword") newPassword: string
  ): Promise<Response> {

    if (!checkRegex(passwordRegex, newPassword)) {
      return {
        code: 400,
        message:
          "The password must contain at least 9 characters, with at least one uppercase letter, one lowercase letter, one number and one symbol.",
      };
    }

    try {

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return {
          code: 404,
          message: "User not found with this email.",
        };
      }

      const hashedPassword = await argon2.hash(newPassword);

      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          isPasswordChange: true,
        },
      });

      return {
        code: 200,
        message: "Password updated successfully.",
      };
    } catch (error) {
      console.error("Erreur dans changePassword:", error);
      return {
        code: 500,
        message: "Server error while updating password.",
      };
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Arg("data") { email, password }: LoginInput, @Ctx() ctx: MyContext): Promise<LoginResponse> {
    try {

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return { code: 401, message: "Invalid credentials (email or password incorrect)." };
      }

      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return { code: 401, message: "Invalid credentials (email or password incorrect)." };
      }

      const tokenPayload = {
        userId: user.id,
      };

      if (!process.env.JWT_SECRET) {
        return { code: 500, message: "Please check your JWT configuration !" };
      }

      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET , { expiresIn: "7d" }); 

       const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/',
      };

      ctx.cookies.set("jwt", token, cookieOptions);

      return {
        code: 200,
        message: "Login successful.",
        token: token,
      };
    } catch (error) {
      console.error("Erreur dans login:", error);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unexpected server error during login.",
      };
    }
  }

  @Mutation(() => Response)
  async logout(
    @Ctx() ctx: MyContext 
  ): Promise<Response> {

    try {
      ctx.cookies.set("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        expires: new Date(0),
        path: '/',
      });

      ctx.user = null;
      return { code: 200, message: "Logged out successfully." };

    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return { code: 500, message: "An error occurred during logout." };
    }
  }
}