import request from "supertest";
import express from "express";
import badgeRouter from "../../src/routes/badge.routes";
import { generateBadgeSvg } from "../../src/lib/badgeGenerator";
import { loadedLogos } from "../../src/lib/logoLoader";

// ---------------------------
// Crée d'abord le mock Prisma
// ---------------------------
const projectCountMock = {
  count: jest.fn(),
};

// ---------------------------
// Mock PrismaClient correctement
// ---------------------------
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      project: projectCountMock,
    })),
  };
});

// ---------------------------
// Mock badgeGenerator
// ---------------------------
jest.mock("../../src/lib/badgeGenerator", () => ({
  generateBadgeSvg: jest.fn(),
}));

// ---------------------------
// Mock logos
// ---------------------------
loadedLogos.set("github", { base64: "fakebase64", mimeType: "image/svg+xml" });

// ---------------------------
// Setup Express App
// ---------------------------
const app = express();
app.use("/badge", badgeRouter);

describe("Badge Routes - GET /stats/projects-count", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and SVG badge with project count", async () => {
    // Prisma mock
    projectCountMock.count.mockResolvedValue(42);

    // generateBadgeSvg mock
    (generateBadgeSvg as jest.Mock).mockReturnValue("<svg>mocked badge</svg>");

    const res = await request(app).get("/badge/stats/projects-count");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image\/svg\+xml/);
    expect(res.text).toBe("<svg>mocked badge</svg>");

    // Vérifie que Prisma a bien été appelé
    expect(projectCountMock.count).toHaveBeenCalledTimes(1);

    // Vérifie que generateBadgeSvg a bien été appelé
    expect(generateBadgeSvg).toHaveBeenCalledWith(
      "Projets",
      "42",
      "4CAF50",
      "2F4F4F",
      loadedLogos.get("github"),
      "white",
      "right"
    );
  });

  it("should return 500 if Prisma fails", async () => {
    projectCountMock.count.mockRejectedValueOnce(new Error("DB error"));
    (generateBadgeSvg as jest.Mock).mockReturnValue("<svg>mocked badge</svg>");

    const res = await request(app).get("/badge/stats/projects-count");

    expect(res.status).toBe(500);
    expect(res.text).toBe("Erreur génération badge");

    expect(projectCountMock.count).toHaveBeenCalledTimes(1);
    expect(generateBadgeSvg).not.toHaveBeenCalled();
  });
});
