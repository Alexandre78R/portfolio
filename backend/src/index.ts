import 'reflect-metadata';
import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { ContactResolver } from "./resolvers/contact.resolver";
import { GenerateImageResolver } from "./resolvers/generateImage.resolver";
import path from 'path';
import { CaptchaResolver } from './resolvers/captcha.resolver';
import { captchaImageMap, cleanUpExpiredCaptchas } from './CaptchaMap';
import { SkillResolver } from './resolvers/skill.resolver';
import { checkApiKey } from './lib/checkApiKey';
import { ExperienceResolver } from './resolvers/experience.resolver';
import { EducationResolver } from './resolvers/education.resolver';
import { ProjectResolver } from './resolvers/project.resolver';
import { UserResolver } from './resolvers/user.resolver';
import Cookies from "cookies";
import { PrismaClient } from "@prisma/client";
import { User, UserRole } from "./entities/user.entity"; 
import { jwtVerify } from "jose";
import "dotenv/config";
import { customAuthChecker } from "./lib/authChecker";

const prisma = new PrismaClient(); 

export interface JwtPayload {
  userId: number;
}

export interface MyContext {
  req: express.Request;
  res: express.Response;
  apiKey: string | undefined;
  cookies: Cookies;
  user: User | null;
}

const app = express();
const httpServer = http.createServer(app);

async function main() {
  const schema = await buildSchema({
    resolvers: [
      ContactResolver,
      GenerateImageResolver,
      CaptchaResolver,
      SkillResolver,
      ProjectResolver,
      ExperienceResolver,
      EducationResolver,
      UserResolver,
    ],
    validate: false,
    authChecker: customAuthChecker, 
  });

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.get('/dynamic-images/:id', (req, res) => {
    const imageId = req.params.id;
    const filename = captchaImageMap[imageId];
    if (filename) {
      const imagePath = path.join(__dirname, 'images', filename);
      res.sendFile(imagePath);
    } else {
      res.status(404).send('Image not found');
    }
  });

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["http://localhost:3000"],
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const cookies = new Cookies(req, res);
        console.log("cookies:", cookies.get("jwt")); 
        let user: User | null = null;

        const token = cookies.get("jwt"); 
        console.log("Token du cookie:", token ? "Présent" : "Absent");

        if (token && process.env.JWT_SECRET) {
          try {
            const { payload } = await jwtVerify<JwtPayload>(
              token,
              new TextEncoder().encode(process.env.JWT_SECRET)
            );

            console.log("Payload du token décodé:", payload); 

            const prismaUser = await prisma.user.findUnique({
                where: { id: payload.userId } 
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
            console.error("Erreur de vérification JWT:", err); // Log l'erreur complète
            cookies.set("jwt", "", { expires: new Date(0), httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const });
          }
        }

        const apiKeyHeader = req.headers['x-api-key'];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

        // const operationName = req.body.operationName || (req.body.query && req.body.query.match(/(mutation|query)\s+(\w+)/)?.[2]);

        if (!apiKey) {
          throw new Error('Unauthorized: x-api-key header is missing.');
        }

        if (apiKey) {
          await checkApiKey(apiKey);
        }

        return { req, res, apiKey, cookies, user };
      },
    })
  );

  setInterval(cleanUpExpiredCaptchas, 15 * 60 * 1000);

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server lancé sur http://localhost:4000/`);
}

main();