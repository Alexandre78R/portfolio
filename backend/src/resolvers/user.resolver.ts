import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user.entity";
import { UsersResponse, UserResponse } from "../entities/response.types";
import { UserRole } from "../entities/user.entity";
import { generateSecurePassword } from "../lib/generateSecurePassword";
import { sendEmail } from "../mail/mail.service";
import { CreateUserInput } from "../entities/inputs/user.input";
import argon2 from "argon2";
import { structureMessageCreatedAccountHTML, structureMessageCreatedAccountTEXT } from "../mail/structureMail.service";

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
}