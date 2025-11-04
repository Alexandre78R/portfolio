import "reflect-metadata";
import type { Express, Request, Response, RequestHandler, NextFunction } from "express";
import express from "express";
import Cookies from "cookies";
import { jwtVerify, JWTPayload } from "jose";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import type { ApolloServerOptions, BaseContext } from "@apollo/server";
import { expressMiddleware, ExpressContextFunctionArgument } from "@apollo/server/express4";
import * as TypeGraphQL from "type-graphql";
import { GraphQLSchema } from "graphql";

import { mountGraphQL, GraphQLContext, JwtPayloadExtended } from "../../src/routes/graphql.routes";
import { checkApiKey } from "../../src/lib/checkApiKey";
import { UserRole } from "../../src/entities/user.entity";

jest.mock("@apollo/server");
jest.mock("@apollo/server/express4");
jest.mock("../../src/lib/checkApiKey");
jest.mock("jose");
jest.mock("cookies");
jest.mock("@prisma/client", () => {
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => prismaMock) };
});

type MockedExpress = jest.Mocked<Express>;
type MockedRequest = Partial<Request>;
type MockedResponse = Partial<Response>;

interface MockedPrismaClient {
  user: {
    findUnique: jest.Mock<Promise<PrismaUser | null>, [{ where: { id: number } }]>;
  };
}

interface MockReqRes {
  req: Request;
  res: Response;
}

type ExpressMiddlewareOptions = {
  context: (args: ExpressContextFunctionArgument) => Promise<GraphQLContext>;
};

type ContextFunction = (args: ExpressContextFunctionArgument) => Promise<GraphQLContext>;

const buildSchemaMock = jest.spyOn(TypeGraphQL, "buildSchema");
const expressMiddlewareMock = expressMiddleware as unknown as jest.Mock;
const checkApiKeyMock = checkApiKey as jest.MockedFunction<typeof checkApiKey>;
const jwtVerifyMock = jwtVerify as jest.MockedFunction<typeof jwtVerify>;
const CookiesMock = Cookies as unknown as jest.MockedClass<typeof Cookies>;
const ApolloServerMock = ApolloServer as unknown as jest.MockedClass<typeof ApolloServer>;

const prismaMock: MockedPrismaClient = new PrismaClient() as unknown as MockedPrismaClient;

const createMockApp = (): MockedExpress => {
  const app = express() as MockedExpress;
  app.use = jest.fn() as MockedExpress["use"];
  return app;
};

const createMockReqRes = (): MockReqRes => {
  const req: MockedRequest = { headers: { "x-api-key": "valid-api-key" } };
  const res: MockedResponse = {};
  return { req: req as Request, res: res as Response };
};

describe("mountGraphQL", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "jwt-secret";
    process.env.CLIENT_URL = "http://localhost:3000";
  });

  it("should build the GraphQL schema with resolvers and auth checker", async () => {

    const app: MockedExpress = createMockApp();
    buildSchemaMock.mockResolvedValue({} as GraphQLSchema);

    await mountGraphQL(app);

    expect(buildSchemaMock).toHaveBeenCalledTimes(1);
    expect(buildSchemaMock).toHaveBeenCalledWith(
      expect.objectContaining({
        resolvers: expect.any(Array),
        validate: false,
        authChecker: expect.any(Function),
      })
    );
  });

  it("should start Apollo Server and mount /graphql middleware", async () => {

    const app: MockedExpress = createMockApp();
    const startMock = jest.fn<Promise<void>, []>().mockResolvedValue(undefined);

    (ApolloServer as unknown as jest.Mock).mockImplementation(
      (options: ApolloServerOptions<BaseContext>) =>
        ({ start: startMock } as unknown as ApolloServer<BaseContext>)
    );

    buildSchemaMock.mockResolvedValue({} as GraphQLSchema);
    expressMiddlewareMock.mockReturnValue(jest.fn() as RequestHandler);

    await mountGraphQL(app);

    expect(startMock).toHaveBeenCalledTimes(1);
    expect(app.use).toHaveBeenCalledWith(
      "/graphql",
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });

  it("should throw an error when x-api-key header is missing", async () => {

    const app: MockedExpress = createMockApp();
    buildSchemaMock.mockResolvedValue({} as GraphQLSchema);

    expressMiddlewareMock.mockImplementation(
      (_server: ApolloServer<GraphQLContext>, options: ExpressMiddlewareOptions): RequestHandler => {
        return (async (req: Request, res: Response) => {
          const request: Request = { headers: {} } as Request;
          const response: Response = {} as Response;
          await expect(options.context({ req: request, res: response })).rejects.toThrow(
            "Unauthorized: x-api-key header is missing."
          );
        }) as RequestHandler;
      }
    );

    await mountGraphQL(app);
  });

  it("should attach authenticated user to GraphQL context when JWT is valid", async () => {

    const app: MockedExpress = createMockApp();

    const prismaUser: PrismaUser = {
      id: 1,
      email: "test@test.com",
      firstname: "John",
      lastname: "Doe",
      role: UserRole.admin,
      password: "hashed",
      isPasswordChange: false,
    };

    prismaMock.user.findUnique.mockResolvedValue(prismaUser);
    CookiesMock.prototype.get.mockReturnValue("jwt-token");

    jwtVerifyMock.mockResolvedValue({
      payload: { id: prismaUser.id, role: prismaUser.role } as JwtPayloadExtended,
    } as unknown as Awaited<ReturnType<typeof jwtVerify>>);

    buildSchemaMock.mockResolvedValue({} as GraphQLSchema);

    expressMiddlewareMock.mockImplementation(
      (_server: ApolloServer<GraphQLContext>, options: ExpressMiddlewareOptions): RequestHandler => {
        return (async (_req: Request, _res: Response) => {
          const { req, res } = createMockReqRes();
          const context: GraphQLContext = await options.context({ req, res });
          expect(context.user).not.toBeNull();
          expect(context.user?.email).toBe(prismaUser.email);
        }) as RequestHandler;
      }
    );

    await mountGraphQL(app);
  });

  it("should validate API key using checkApiKey", async () => {

    const app: MockedExpress = createMockApp();
    buildSchemaMock.mockResolvedValue({} as GraphQLSchema);

    let capturedContext: ContextFunction | undefined;

    expressMiddlewareMock.mockImplementation(
      (_server: ApolloServer<GraphQLContext>, options: ExpressMiddlewareOptions): RequestHandler => {
        capturedContext = options.context;
        return (async () => {}) as RequestHandler;
      }
    );

    const { req, res } = createMockReqRes();

    await mountGraphQL(app);

    if (capturedContext) await capturedContext({ req, res });

    expect(checkApiKeyMock).toHaveBeenCalledTimes(1);
    expect(checkApiKeyMock).toHaveBeenCalledWith("valid-api-key");
  });
});