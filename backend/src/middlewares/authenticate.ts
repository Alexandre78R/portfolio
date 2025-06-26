import { RequestHandler } from "express";
import Cookies from "cookies";
import { jwtVerify } from "jose";
import { PrismaClient } from "@prisma/client";
import { JwtPayload } from "../index";
import { User } from "../entities/user.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();

/** Vérifie le cookie JWT et remplit req.user */
export const authenticate: RequestHandler = async (req, res, next) => {
  const cookies = new Cookies(req, res);
  const token = cookies.get("token");

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).send("Non authentifié");
  }

  try {
    const { payload } = await jwtVerify<JwtPayload>(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const prismaUser = await prisma.user.findUnique({
      where: { id: payload.id },
    });
    if (!prismaUser) {
      return res.status(401).send("Utilisateur introuvable");
    }

    // cast léger : prismaUser.role === "ADMIN" | "USER" … -> enum UserRole
    req.user = prismaUser as unknown as User;
    next();
  } catch (err) {
    console.error("JWT invalide :", err);
    return res.status(401).send("Token invalide ou expiré");
  }
};