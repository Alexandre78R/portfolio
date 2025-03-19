import { Resolver, Query } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { User } from "../entities/user.entity";
import { UsersResponse } from "../entities/response.types";
import { UserRole } from "../entities/user.entity";

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
}