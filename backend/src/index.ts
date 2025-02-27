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
import { ProjectResolver } from './resolvers/project.resolver';
import { checkApiKey } from './lib/checkApiKey';
import { ExperienceResolver } from './resolvers/experience.resolver';
export interface MyContext {
  req: express.Request;
  res: express.Response;
  apiKey: string | undefined;
}

const app = express();
const httpServer = http.createServer(app);

async function main() {

  const schema = await buildSchema({
    resolvers: [ContactResolver, GenerateImageResolver, CaptchaResolver, SkillResolver, ProjectResolver, ExperienceResolver],
    validate: false,
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
        const apiKeyHeader = req.headers['x-api-key'];
        const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;
        console.log("HEADERS >>>", req.headers); 
        if (!apiKey)
          throw new Error('Unauthorized TOKEN API');
    
        await checkApiKey(apiKey);

        return { req, res, apiKey };
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