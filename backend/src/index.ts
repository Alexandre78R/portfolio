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

async function main() {

    await db.initialize();

    const schema = await buildSchema({
      resolvers: [ContactResolver],
    });

    const server = new ApolloServer<{}>({
      schema,
    });

    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req, res }) => {
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.API_KEY)
          throw new Error('Unauthorized');
        return {};
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  }

  main();