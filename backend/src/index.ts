import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import "dotenv/config";
import { buildSchema } from 'type-graphql';
import express from "express";
import http from "http";
import cors from "cors";
import Cookies from "cookies";
import { jwtVerify } from "jose";
import db from "./lib/db";
// import { UserResolver } from "./resolvers/user.resolver";
import { ContactResolver } from "./resolvers/contact.resolver";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GenerateImageResolver } from "./resolvers/generateImage.resolver";

export interface MyContext {
  req: express.Request;
  res: express.Response;
  apiKey: string | undefined;
}

const app = express();
const httpServer = http.createServer(app);

async function main() {

    await db.initialize();

    const schema = await buildSchema({
      resolvers: [ContactResolver],
      validate: false,
    });

    const server = new ApolloServer<MyContext>({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    
    await server.start();

    app.use(
      "/",
      cors<cors.CorsRequest>({
        origin: ["http://localhost:3000"],
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => {
          const apiKey = req.headers['x-api-key'];
          console.log("apiKey", apiKey)
          return { req, res, apiKey: apiKey as string | undefined };
        },
      })
    );

    await new Promise<void>((resolve) =>
      httpServer.listen({ port: 4000 }, resolve)
    );
    console.log(`🚀 Server lancé sur http://localhost:4000/`);
  }

  main();