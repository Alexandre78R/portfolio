import { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended"; // <-- Utilise jest-mock-extended
// import { vi } from "vitest"; // <-- Supprime ou commente cette ligne si tu n'utilises pas vi

export const prismaMock = mockDeep<PrismaClient>();