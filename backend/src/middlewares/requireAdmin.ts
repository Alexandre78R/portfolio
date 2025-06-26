import { RequestHandler } from "express";
import { UserRole } from "../entities/user.entity";

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.user?.role !== UserRole.admin) {
    return res.status(403).send("Access denied (ADMIN required)");
  }
  next();
};