import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  Authorized,
  Ctx,
} from "type-graphql";
import { PrismaClient, Theme as PrismaTheme } from "@prisma/client";

import { Theme } from "../entities/theme.entity";
import {
  CreateThemeInput,
  UpdateThemeInput,
} from "../entities/inputs/theme.input";
import {
  Response,
  ThemeResponse,
  ThemesResponse,
} from "../types/response.types";
import { UserRole } from "../entities/user.entity";
import { MyContext } from "..";

@Resolver(() => Theme)
export class ThemeResolver {
  private readonly db: PrismaClient;

  constructor(db?: PrismaClient) {
    this.db = db ?? new PrismaClient();
  }
  
  @Query(() => ThemesResponse)
  async themeList(@Ctx() ctx: MyContext): Promise<ThemesResponse> {
    try {
      const isAdmin: boolean = ctx.user?.role === UserRole.admin;

      const themes: PrismaTheme[] = await this.db.theme.findMany({
        where: isAdmin ? undefined : { visible: true },
        orderBy: { id: "desc" },
      });

      return {
        code: 200,
        message: "Themes fetched successfully",
        themes,
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
        themes: undefined,
      };
    }
  }

  @Query(() => ThemeResponse)
  async themeById(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<ThemeResponse> {
    try {
      const isAdmin: boolean = ctx.user?.role === UserRole.admin;

      const theme: PrismaTheme | null = await this.db.theme.findFirst({
        where: {
          id,
          ...(isAdmin ? {} : { visible: true }),
        },
      });

      if (!theme) {
        return {
          code: 404,
          message: "Theme not found",
          theme: undefined,
        };
      }

      return {
        code: 200,
        message: "Theme found",
        theme,
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
        theme: undefined,
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => ThemeResponse)
  async createTheme(
    @Arg("data") data: CreateThemeInput,
    @Ctx() ctx: MyContext
  ): Promise<ThemeResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required.",
          theme: undefined,
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Access denied. Admin role required.",
          theme: undefined,
        };
      }

      const existingTheme: PrismaTheme | null =
        await this.db.theme.findUnique({
          where: { name: data.name },
        });

      if (existingTheme) {
        return {
          code: 400,
          message: "Theme with this name already exists.",
          theme: undefined,
        };
      }

      const newTheme: PrismaTheme = await this.db.theme.create({
        data,
      });

      return {
        code: 200,
        message: "Theme created successfully",
        theme: newTheme,
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
        theme: undefined,
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => ThemeResponse)
  async updateTheme(
    @Arg("data") data: UpdateThemeInput,
    @Ctx() ctx: MyContext
  ): Promise<ThemeResponse> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required.",
          theme: undefined,
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Access denied. Admin role required.",
          theme: undefined,
        };
      }

      const existingTheme: PrismaTheme | null =
        await this.db.theme.findUnique({
          where: { id: data.id },
        });

      if (!existingTheme) {
        return {
          code: 404,
          message: "Theme not found",
          theme: undefined,
        };
      }

      const updatedTheme: PrismaTheme = await this.db.theme.update({
        where: { id: data.id },
        data,
      });

      return {
        code: 200,
        message: "Theme updated successfully",
        theme: updatedTheme,
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
        theme: undefined,
      };
    }
  }

  @Authorized([UserRole.admin])
  @Mutation(() => Response)
  async deleteTheme(
    @Arg("id", () => Int) id: number,
    @Ctx() ctx: MyContext
  ): Promise<Response> {
    try {
      if (!ctx.user) {
        return {
          code: 401,
          message: "Authentication required.",
        };
      }

      if (ctx.user.role !== UserRole.admin) {
        return {
          code: 403,
          message: "Access denied. Admin role required.",
        };
      }

      const existingTheme: PrismaTheme | null =
        await this.db.theme.findUnique({
          where: { id },
        });

      if (!existingTheme) {
        return {
          code: 404,
          message: "Theme not found",
        };
      }

      await this.db.theme.delete({
        where: { id },
      });

      return {
        code: 200,
        message: "Theme deleted successfully",
      };
    } catch (error: unknown) {
      console.error(error);
      return {
        code: 500,
        message: "Internal server error",
      };
    }
  }
}