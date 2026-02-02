// import { Express } from "express";
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import { buildSchema } from "type-graphql";
// import { graphqlUploadExpress } from "graphql-upload-ts";
// import cors from "cors";
// import Cookies from "cookies";
// import { jwtVerify, JWTPayload } from "jose";
// import { PrismaClient, User as PrismaUser } from "@prisma/client";
// import express, { Request, Response } from "express";

// import { customAuthChecker } from "../lib/authChecker";
// import { checkApiKey } from "../lib/checkApiKey";
// import { User, UserRole } from "../entities/user.entity";

// import { ContactResolver } from "../resolvers/contact.resolver";
// import { CaptchaResolver } from "../resolvers/captcha.resolver";
// import { SkillResolver } from "../resolvers/skill.resolver";
// import { SkillCategoryResolver } from "../resolvers/skillCategory.resolver";
// import { ProjectResolver } from "../resolvers/project.resolver";
// import { ExperienceResolver } from "../resolvers/experience.resolver";
// import { EducationResolver } from "../resolvers/education.resolver";
// import { UserResolver } from "../resolvers/user.resolver";
// import { AdminResolver } from "../resolvers/admin.resolver";
// import { CVResolver } from "../resolvers/cv.resolver";
// import { ThemeResolver } from "../resolvers/theme.resolver";
// import { ProjectAdminResolver } from "../resolvers/projectAdmin.resolver";
// import { SocialResolver } from "../resolvers/social.resolver";
// import { MessageResolver } from "../resolvers/message.resolver";
// import { SignatureResolver } from "../resolvers/signature.resolver";
// import { AboutMeResolver } from "../resolvers/aboutme.resolver";
// import { TranslationResolver } from "../resolvers/translation.resolver";

// /* --- Types context GraphQL --- */

// export interface JwtPayloadExtended extends JWTPayload {
//   id: number;
//   email?: string;
//   role?: UserRole;
// }

// export interface GraphQLContext {
//   req: Request;
//   res: Response;
//   apiKey?: string;
//   cookies: Cookies;
//   token?: string;
//   user: User | null;
// }

// /* --- Prisma Client --- */
// const prisma = new PrismaClient();

// /* --- Fonction appelée depuis app.ts --- */
// export async function mountGraphQL(app: Express) {
//   /* 1. Build schema avec TypeGraphQL */
//   const schema = await buildSchema({
//     resolvers: [
//       ContactResolver,
//       CaptchaResolver,
//       SkillResolver,
//     SkillCategoryResolver,
//       ProjectResolver,
//       ExperienceResolver,
//       EducationResolver,
//       UserResolver,
//       AdminResolver,
//       CVResolver,
//       ThemeResolver,
//       ProjectAdminResolver,
//       SocialResolver,
//       MessageResolver,
//       SignatureResolver,
//       AboutMeResolver,
//       TranslationResolver,
//     ],
//     validate: false,
//     authChecker: customAuthChecker,
//   });

//   const server = new ApolloServer<GraphQLContext>({ schema });
//   await server.start();

//   app.use(
//     "/graphql",
//     (req, res, next) => {
//       console.log("GraphQL request:", { 
//         method: req.method,
//         contentType: req.headers['content-type'],
//         url: req.url 
//       });
//       next();
//     },
//     express.json({ limit: "50mb" }),
//     cors<cors.CorsRequest>({
//       origin: process.env.CLIENT_URL?.split(",") ?? ["http://localhost:3000"],
//       credentials: true,
//     }),
//     (req, res, next) => {
//       // Debug middleware - see if body is parsed
//       console.log("Before graphqlUploadExpress:", {
//         body: req.body ? Object.keys(req.body) : null,
//         hasVariables: req.body?.variables ? Object.keys(req.body.variables) : null
//       });
//       next();
//     },
//     graphqlUploadExpress({ 
//       maxFileSize: 50000000,
//       maxFiles: 10 
//     }),
//     (req, res, next) => {
//       console.log("After graphqlUploadExpress:", { 
//         body: req.body ? Object.keys(req.body) : null,
//         file: (req as any).file,
//         files: (req as any).files
//       });
//       next();
//     },
//     expressMiddleware(server, {
//       context: async ({ req, res }): Promise<GraphQLContext> => {

//         const cookies: Cookies = new Cookies(req, res);

//         let user: User | null = null;

//         let token: string | undefined = cookies.get("token") ?? undefined;
        
//         if (!token) {
//           const authHeader = req.headers.authorization;
//           if (authHeader && authHeader.startsWith('Bearer ')) {
//             token = authHeader.substring(7);
//           }
//         }

//         if (token && process.env.JWT_SECRET) {
//           try {
//             const { payload }: { payload: JwtPayloadExtended } = await jwtVerify(
//               token,
//               new TextEncoder().encode(process.env.JWT_SECRET)
//             );

//             const prismaUser: PrismaUser | null = await prisma.user.findUnique({
//               where: { id: payload.id },
//             });

//             if (prismaUser) {
//               user = {
//                 id: prismaUser.id,
//                 email: prismaUser.email,
//                 firstname: prismaUser.firstname,
//                 lastname: prismaUser.lastname,
//                 role: prismaUser.role as UserRole,
//                 isPasswordChange: prismaUser.isPasswordChange,
//               };
//             }
//           } catch (err: unknown) {
//             console.error("JWT invalide :", err);
//             cookies.set("token", "", {
//               expires: new Date(0),
//               httpOnly: true,
//               secure: process.env.NODE_ENV === "production",
//               sameSite: "lax" as const,
//             });
//           }
//         }

//         const apiKeyHeader: string | string[] | undefined = req.headers["x-api-key"];
//         const apiKey: string | undefined = Array.isArray(apiKeyHeader)
//           ? apiKeyHeader[0]
//           : apiKeyHeader;
//         if (!apiKey) throw new Error("Unauthorized: x-api-key header is missing.");
//         await checkApiKey(apiKey);

//         return { req, res, cookies, token, user, apiKey };
//       },
//     })
//   );
// }

import { Express } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload-ts";
import cors from "cors";
import Cookies from "cookies";
import { jwtVerify, JWTPayload } from "jose";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import express, { Request, Response } from "express";

import { customAuthChecker } from "../lib/authChecker";
import { checkApiKey } from "../lib/checkApiKey";
import { User, UserRole } from "../entities/user.entity";

import { ContactResolver } from "../resolvers/contact.resolver";
import { CaptchaResolver } from "../resolvers/captcha.resolver";
import { SkillResolver } from "../resolvers/skill.resolver";
import { SkillCategoryResolver } from "../resolvers/skillCategory.resolver";
import { ProjectResolver } from "../resolvers/project.resolver";
import { ExperienceResolver } from "../resolvers/experience.resolver";
import { EducationResolver } from "../resolvers/education.resolver";
import { UserResolver } from "../resolvers/user.resolver";
import { AdminResolver } from "../resolvers/admin.resolver";
import { CVResolver } from "../resolvers/cv.resolver";
import { ThemeResolver } from "../resolvers/theme.resolver";
import { ProjectAdminResolver } from "../resolvers/projectAdmin.resolver";
import { SocialResolver } from "../resolvers/social.resolver";
import { MessageResolver } from "../resolvers/message.resolver";
import { SignatureResolver } from "../resolvers/signature.resolver";
import { AboutMeResolver } from "../resolvers/aboutme.resolver";
import { TranslationResolver } from "../resolvers/translation.resolver";

/* --- Types context GraphQL --- */

export interface JwtPayloadExtended extends JWTPayload {
  id: number;
  email?: string;
  role?: UserRole;
}

export interface GraphQLContext {
  req: Request;
  res: Response;
  apiKey?: string;
  cookies: Cookies;
  token?: string;
  user: User | null;
}

/* --- Prisma Client --- */
const prisma = new PrismaClient();

/* --- Fonction appelée depuis app.ts --- */
export async function mountGraphQL(app: Express) {
  /* 1. Build schema avec TypeGraphQL */
  const schema = await buildSchema({
    resolvers: [
      ContactResolver,
      CaptchaResolver,
      SkillResolver,
    SkillCategoryResolver,
      ProjectResolver,
      ExperienceResolver,
      EducationResolver,
      UserResolver,
      AdminResolver,
      CVResolver,
      ThemeResolver,
      ProjectAdminResolver,
      SocialResolver,
      MessageResolver,
      SignatureResolver,
      AboutMeResolver,
      TranslationResolver,
    ],
    validate: false,
    authChecker: customAuthChecker,
  });

  const server = new ApolloServer<GraphQLContext>({ schema });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: process.env.CLIENT_URL?.split(",") ?? ["http://localhost:3000"],
      credentials: true,
    }),
    graphqlUploadExpress({ 
      maxFileSize: 50000000,
      maxFiles: 10 
    }),
    express.json({ limit: "50mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {

        const cookies: Cookies = new Cookies(req, res);

        let user: User | null = null;

        let token: string | undefined = cookies.get("token") ?? undefined;
        
        if (!token) {
          const authHeader = req.headers.authorization;
          if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          }
        }

        if (token && process.env.JWT_SECRET) {
          try {
            const { payload }: { payload: JwtPayloadExtended } = await jwtVerify(
              token,
              new TextEncoder().encode(process.env.JWT_SECRET)
            );

            const prismaUser: PrismaUser | null = await prisma.user.findUnique({
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
          } catch (err: unknown) {
            console.error("JWT invalide :", err);
            cookies.set("token", "", {
              expires: new Date(0),
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax" as const,
            });
          }
        }

        const apiKeyHeader: string | string[] | undefined = req.headers["x-api-key"];
        const apiKey: string | undefined = Array.isArray(apiKeyHeader)
          ? apiKeyHeader[0]
          : apiKeyHeader;
        if (!apiKey) throw new Error("Unauthorized: x-api-key header is missing.");
        await checkApiKey(apiKey);

        return { req, res, cookies, token, user, apiKey };
      },
    })
  );
}