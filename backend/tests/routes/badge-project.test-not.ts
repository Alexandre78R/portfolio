import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';


const mockGenerateBadgeSvg = jest.fn((label, message, color, labelColor, icon, iconColor, iconSide) => {
  const iconPart = icon ? `icon-${icon.base64.slice(0, 10)}` : 'no-icon';
  return `<svg>${label}-${message}-${color}-${labelColor}-${iconPart}-${iconColor}-${iconSide}</svg>`;
});
jest.mock('../../src/lib/badgeGenerator', () => ({
  generateBadgeSvg: mockGenerateBadgeSvg,
}));


const mockLoadedLogos = new Map<string, { base64: string; mimeType: string }>();
jest.mock('../../src/lib/logoLoader', () => ({
  loadedLogos: mockLoadedLogos,
  loadLogos: jest.fn(), 
}));

// Mock PrismaClient globally to control its behavior
const mockPrismaClient = jest.fn(() => ({
  project: {
    count: jest.fn(), 
  },
}));
jest.mock('@prisma/client', () => ({
  PrismaClient: mockPrismaClient,
}));

const app = express();

const prisma = new (mockPrismaClient as any)(); 

app.get('/badge/stats/projects-count', async (req: Request, res: Response) => {
  try {
    const projectCount = await prisma.project.count();
    const logoData = mockLoadedLogos.get('github');


    if (!logoData) console.warn("Logo 'github' non trouvé pour le badge projets.");

    const svg = mockGenerateBadgeSvg( 
      'Projets',
      String(projectCount),
      '4CAF50',
      '2F4F4F',
      logoData,
      'white',
      'right'
    );

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(svg);
  } catch (error) {
    console.error("Erreur lors de la génération du badge des projets:", error);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(500).send('<svg width="120" height="20" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="20" fill="#E05D44"/><text x="5" y="14" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11px" fill="white">Error</text></svg>');
  }
});

describe('GET /badge/stats/projects-count', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {

    jest.clearAllMocks();

    (prisma.project.count as jest.Mock).mockResolvedValue(7);

    mockLoadedLogos.clear();
    mockLoadedLogos.set('github', { base64: 'fakebase64github', mimeType: 'image/svg+xml' });

    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('renvoie le SVG du badge avec le nombre de projets mocké', async () => {
    const expectedProjectCount = 7;
    (prisma.project.count as jest.Mock).mockResolvedValueOnce(expectedProjectCount);

    const expectedSvg = `<svg>Projets-${expectedProjectCount}-4CAF50-2F4F4F-icon-fakebase64-white-right</svg>`;
    
    const response = await request(app).get('/badge/stats/projects-count');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(response.text).toBe(expectedSvg);

    expect(prisma.project.count).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).toHaveBeenCalledWith(
      'Projets',
      String(expectedProjectCount),
      '4CAF50',
      '2F4F4F',
      { base64: 'fakebase64github', mimeType: 'image/svg+xml' },
      'white',
      'right'
    );
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('devrait renvoyer un badge d\'erreur 500 si Prisma count échoue', async () => {
    (prisma.project.count as jest.Mock).mockRejectedValueOnce(new Error("DB Error"));

    const response = await request(app).get('/badge/stats/projects-count');

    expect(response.statusCode).toBe(500);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(response.text).toContain('Error');


    expect(prisma.project.count).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('devrait renvoyer un badge d\'erreur 500 si generateBadgeSvg lève une erreur', async () => {
    mockGenerateBadgeSvg.mockImplementationOnce(() => {
      throw new Error("SVG generation failed");
    });

    const response = await request(app).get('/badge/stats/projects-count');

    expect(response.statusCode).toBe(500);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(response.text).toContain('Error');

    // Verify mocks were called
    expect(prisma.project.count).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  });

  it('devrait renvoyer un badge réussi même si le logo github n\'est pas trouvé', async () => {
    mockLoadedLogos.clear(); 

    const expectedSvg = `<svg>Projets-7-4CAF50-2F4F4F-no-icon-white-right</svg>`;

    const response = await request(app).get('/badge/stats/projects-count');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/image\/svg\+xml/);
    expect(response.text).toBe(expectedSvg);

    expect(prisma.project.count).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).toHaveBeenCalledTimes(1);
    expect(mockGenerateBadgeSvg).toHaveBeenCalledWith(
      'Projets',
      '7',
      '4CAF50',
      '2F4F4F',
      undefined,
      'white',
      'right'
    );
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});