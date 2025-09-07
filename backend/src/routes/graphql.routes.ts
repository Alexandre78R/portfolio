import { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import cors from "cors";
import Cookies from "cookies";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import express from "express";

import { customAuthChecker } from "../lib/authChecker";
import { checkApiKey } from "../lib/checkApiKey";
import { User, UserRole } from "../entities/user.entity";

import type { Request, Response } from "express";
import { ContactResolver } from "../resolvers/contact.resolver";
import { CaptchaResolver } from "../resolvers/captcha.resolver";
import { SkillResolver } from "../resolvers/skill.resolver";
import { ProjectResolver } from "../resolvers/project.resolver";
import { ExperienceResolver } from "../resolvers/experience.resolver";
import { EducationResolver } from "../resolvers/education.resolver";
import { UserResolver } from "../resolvers/user.resolver";
import { AdminResolver } from "../resolvers/admin.resolver";

/* Types context GraphQL */
export interface JwtPayload {
  id: number;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  apiKey?: string;
  cookies: Cookies;
  token?: string;
  user: User | null;
}

const prisma = new PrismaClient();

/* Fonction appelée depuis app.ts */
export async function mountGraphQL(app: Express) {
  /* 1. Build schema avec TypeGraphQL */
  const schema = await buildSchema({
    resolvers: [
      ContactResolver,
      CaptchaResolver,
      SkillResolver,
      ProjectResolver,
      ExperienceResolver,
      EducationResolver,
      UserResolver,
      AdminResolver,
    ],
    validate: false,
    authChecker: customAuthChecker,
  });

  /* 2. Crée ApolloServer v4 */
  const server = new ApolloServer<GraphQLContext>({ schema });
  await server.start();

  /* 3. Monte le middleware sur /graphql */
  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_URL?.split(",") ?? ["http://localhost:3000"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        /* ▸ Cookies */
        const cookies = new Cookies(req, res);

        /* ▸ Auth utilisateur via JWT */
        let user: User | null = null;
        const token = cookies.get("token");
        if (token && process.env.JWT_SECRET) {
          try {
            const { payload } = await jwtVerify<JwtPayload>(
              token,
              new TextEncoder().encode(process.env.JWT_SECRET)
            );

            const prismaUser = await prisma.user.findUnique({
              where: { id: payload.id },
            });

            if (prismaUser) {
              user = {
                id: prismaUser.id,
                email: prismaUser.email,
                firstname: prismaUser.firstname,
                lastname: prismaUser.lastname,
                role: prismaUser.role as UserRole,
                isPasswordChange: prismaUser.isPasswordChange,
              };
            }
          } catch (err) {
            console.error("JWT invalide :", err);
            cookies.set("token", "", {
              expires: new Date(0),
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
            });
          }
        }

        /* ▸ Vérification de la clé API */
        const apiKeyHeader = req.headers["x-api-key"];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
        if (!apiKey) throw new Error("Unauthorized: x-api-key header is missing.");
        await checkApiKey(apiKey);

        /* Contexte retourné à chaque resolver */
        return { req, res, cookies, token, user, apiKey };
      },
    })
  );
}