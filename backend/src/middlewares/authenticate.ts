import { RequestHandler } from "express";
import Cookies from "cookies";
import { jwtVerify, JWTPayload } from "jose";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import { JwtPayload } from "../index";

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser;
    }
  }
}

const prisma = new PrismaClient();

export const authenticate: RequestHandler = async (req, res, next) => {
  const cookies = new Cookies(req, res);
  const token: string | undefined = cookies.get("token");

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).send("Unauthenticated");
  }

  try {
    const { payload }: { payload: JwtPayload & JWTPayload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const prismaUser: PrismaUser | null = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!prismaUser) {
      return res.status(401).send("User not found");
    }

    req.user = prismaUser;
    next();
  } catch (err: unknown) {
    console.error("JWT invalide :", err);
    return res.status(401).send("Invalid or expired token");
  }
};